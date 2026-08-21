import MessageItem from './MessageItem'

interface Message {
  id: string
  sender: string
  type: string
  time: Date
  body: string
}

interface Props {
  conversation: Message[]
  onReplay: (attachment: string) => void
}

export default function MessageList({ conversation, onReplay }: Props) {
  return (
    <div>
      <ul className="messages pd-x-xs">
        {conversation.map((message, index) => (
          <li
            key={message.id}
            className={
              conversation[index - 1] &&
              conversation[index - 1].sender === message.sender
                ? 'mg-t-min'
                : 'mg-t-xs'
            }
          >
            <MessageItem message={message} onReplay={onReplay} />
          </li>
        ))}
      </ul>
    </div>
  )
}
