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
                style={{ display: 'inline-block', verticalAlign: 'middle', marginBottom: '2px' }}
              />
              Replay
            </button>
          </div>
          <img
            className="br-radius-md"
            src={message.body}
            style={{ display: 'block', width: '100%', height: 'auto', margin: 0 }}
            alt=""
          />
        </div>
      ) : message.sender === 'bot' ? (
        <span dangerouslySetInnerHTML={{ __html: message.body }} />
      ) : (
        <span>{message.body}</span>
      )}
    </div>
  )
}
