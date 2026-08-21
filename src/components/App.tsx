import { useState, useEffect } from 'react'
import Navigation from './Navigation'
import MessageForm from './MessageForm'
import MessageList from './MessageList'
import MessageWallpaper from './MessageWallpaper'
import trashImg from '../assets/trash.svg'
import infoImg from '../assets/info.svg'

interface Message {
  id: string
  sender: string
  type: string
  time: Date
  body: string
}

interface Visible {
  top: boolean
  view: boolean
  bottom: boolean
  wallpaper: boolean
}

const INITIAL_MESSAGE: Message = {
  id: 'initial',
  sender: 'bot',
  type: 'message',
  time: new Date(0),
  body: `Hi there! Ask me anything and I'll give you a <a href="https://slumpgenerator.com/yes-or-no">yes or no</a>. Let's go 👊`,
}

function createMessage(sender: string, type: string, message: string): Message {
  return {
    id:
      Math.random().toString(36).substring(2) +
      new Date().getTime().toString(36),
    sender,
    type,
    time: new Date(),
    body: message,
  }
}

function preload(attachment: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => resolve()
    image.onerror = () => resolve()
    image.src = attachment
  })
}

function transformResponse(answer: string): string {
  const answers: Record<string, string[]> = {
    yes: [
      "Yes, that's right.",
      'Yes ...',
      "That's a yes",
      'Yep!',
      'Always!',
      'You know that. Of course.',
    ],
    no: [
      'Simply ... no',
      'Never',
      "I don't think so",
      "I'd say no actually.",
      'No ...',
      "No, but don't tell anyone 🤫",
    ],
    maybe: ['Maybe 😉'],
  }
  const list = answers[answer] || answers['maybe']
  return list[Math.floor(Math.random() * list.length)]
}

export default function App() {
  const [bot] = useState({ name: 'Vincent Lejtzén' })
  const [botWriting, setBotWriting] = useState(false)
  const [conversation, setConversation] = useState<Message[]>([INITIAL_MESSAGE])
  const [wallpaper, setWallpaper] = useState('')
  const [visible, setVisible] = useState<Visible>({
    top: true,
    view: true,
    bottom: true,
    wallpaper: false,
  })

  function sendMessage(message: Message, conv?: Message[]) {
    const current = conv ?? conversation
    const updated = [...current, message]
    setConversation(updated)
    localStorage.setItem('conversation', JSON.stringify(updated))
    window.scrollTo(0, document.getElementById('view')?.offsetHeight ?? 0)
    return updated
  }

  function sendResponse(conv: Message[]) {
    setTimeout(() => setBotWriting(true), 500)

    setTimeout(() => {
      fetch('https://yesno.wtf/api')
        .then((r) => r.json())
        .then((data) => {
          setBotWriting(false)

          preload(data.image).then(() => {
            setWallpaper(data.image)
            setVisible({
              top: false,
              view: true,
              bottom: false,
              wallpaper: true,
            })

            let latest = conv
            setTimeout(() => {
              latest = sendMessage(
                createMessage('bot', 'attachment', data.image),
                latest,
              )
            }, 2000)

            setTimeout(() => {
              latest = sendMessage(
                createMessage('bot', 'message', transformResponse(data.answer)),
                latest,
              )
            }, 3000)

            setTimeout(() => {
              setVisible({
                top: true,
                view: true,
                bottom: true,
                wallpaper: false,
              })
            }, 5000)
          })
        })
        .catch(() => {
          setBotWriting(false)
          sendMessage(
            createMessage(
              'bot',
              'message',
              "Sorry, I can't answer any questions now. The yesno.wtf API seems to be down :(",
            ),
            conv,
          )
        })
    }, 1500)
  }

  function onNewMessage(body: string) {
    const msg = createMessage('user', 'message', body)
    const updated = sendMessage(msg)
    sendResponse(updated)
  }

  function onReplay(attachment: string) {
    preload(attachment).then(() => {
      setWallpaper(attachment)
      setVisible({ top: false, view: true, bottom: false, wallpaper: true })

      setTimeout(() => {
        setVisible({ top: true, view: true, bottom: true, wallpaper: false })
      }, 5000)
    })
  }

  function clearConversation() {
    if (conversation.length) {
      const confirmed = window.confirm(
        'Are you sure you want to delete the conversation?',
      )
      if (confirmed) {
        setConversation([INITIAL_MESSAGE])
        localStorage.removeItem('conversation')
      }
    }
  }

  function showInfo() {
    sendMessage(
      createMessage(
        'bot',
        'message',
        "That button there. It should show some info about this project but i haven't made it that far yet. Come back soon.",
      ),
    )
  }

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem('conversation') ?? 'null',
    ) as Message[] | null
    if (saved && saved.length > 0) {
      setConversation(saved)
    }
  }, [])

  return (
    <>
      {visible.top && (
        <Navigation
          name={bot.name}
          left={
            <button
              className="pd-x-xs"
              onClick={clearConversation}
              disabled={!conversation.length}
              name="Clear conversation"
              title="Clear conversation"
            >
              <img
                style={{ display: 'block', width: 'auto', height: '28px' }}
                src={trashImg.src}
                width={28}
                height={28}
                alt="Clear conversation"
              />
            </button>
          }
          right={
            <button
              className="pd-x-xs"
              onClick={showInfo}
              name="Show information"
              title="Show information"
            >
              <img
                style={{ display: 'block', width: 'auto', height: '28px' }}
                src={infoImg.src}
                width={28}
                height={28}
                alt="Information"
              />
            </button>
          }
        />
      )}

      {visible.view && (
        <div
          id="view"
          className={`x-all${visible.wallpaper ? ' fullscreen' : ''}`}
        >
          <MessageList conversation={conversation} onReplay={onReplay} />

          {botWriting && (
            <div className="mg-t-xs pd-x-xs">
              <div className="br-radius-md message received bg-grey">
                <span className="writing"></span>
                <span
                  className="writing"
                  style={{ animationDelay: '-0.25s' }}
                ></span>
                <span
                  className="writing"
                  style={{ animationDelay: '-0.5s' }}
                ></span>
              </div>
            </div>
          )}
        </div>
      )}

      {visible.bottom && <MessageForm onNewMessage={onNewMessage} />}

      {visible.wallpaper && <MessageWallpaper wallpaper={wallpaper} />}
    </>
  )
}
