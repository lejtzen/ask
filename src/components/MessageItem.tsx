import { useEffect, useRef } from 'react'
import refreshImg from '../assets/refresh.svg'

interface Message {
  id: string
  sender: string
  type: string
  time: Date
  body: string
}

interface Props {
  message: Message
  onReplay: (attachment: string) => void
}

function FrozenImage({ src, className }: { src: string; className?: string }) {
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    function freeze() {
      if (!img) return
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) return

      canvas.setAttribute('class', img.className)
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      context.drawImage(img, 0, 0, canvas.width, canvas.height)
      img.parentNode?.replaceChild(canvas, img)
    }

    if (img.complete && img.naturalWidth > 0) {
      freeze()
    } else {
      img.addEventListener('load', freeze, { once: true })
    }
  }, [src])

  return (
    <img
      ref={imgRef}
      className={className}
      src={src}
      style={{ display: 'block', width: '100%', height: 'auto', margin: 0 }}
      alt=""
    />
  )
}

export default function MessageItem({ message, onReplay }: Props) {
  const isAttachment = message.type === 'attachment'

  return (
    <div
      className={[
        'br-radius-md',
        message.type,
        message.sender === 'bot'
          ? 'received bg-grey'
          : 'sent bg-blue text-light-primary',
      ].join(' ')}
    >
      {isAttachment ? (
        <div>
          <div className="replay">
            <button
              className="text-blue"
              onClick={() => onReplay(message.body)}
              name="Replay message"
              title="Replay message"
            >
              <img
                src={refreshImg.src}
                width={14}
                height={14}
                alt="Replay"
                style={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  marginBottom: '2px',
                }}
              />
              Replay
            </button>
          </div>
          <FrozenImage src={message.body} className="br-radius-md" />
        </div>
      ) : message.sender === 'bot' ? (
        <span dangerouslySetInnerHTML={{ __html: message.body }} />
      ) : (
        <span>{message.body}</span>
      )}
    </div>
  )
}
