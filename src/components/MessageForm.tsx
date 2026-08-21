import { useState, useRef } from 'react'
import angleUpImg from '../assets/angle-up.svg'

interface Props {
  onNewMessage: (message: string) => void
}

export default function MessageForm({ onNewMessage }: Props) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const valid = message.trim().length > 0

  function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!valid) return
    onNewMessage(message)
    setMessage('')
    textareaRef.current?.blur()
  }

  function handleKeyUp(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value.replace(/(\r\n|\n|\r)/gm, ''))
  }

  return (
    <div id="bottom" className="flex valign bg-frost">
      <div className="x-right x-bottom x-left">
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <textarea
            id="message"
            className="textarea br-radius-md"
            name="message"
            rows={1}
            placeholder="Message"
            value={message}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
            ref={textareaRef}
            enterKeyHint="send"
          />
          <button
            className="button"
            type="submit"
            name="Send message"
            title="Send message"
            disabled={!valid}
          >
            <img
              style={{ display: 'block', width: 'auto', height: '28px' }}
              src={angleUpImg.src}
              width={28}
              height={28}
              alt="Send"
            />
          </button>
        </form>
      </div>
    </div>
  )
}
