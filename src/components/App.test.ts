import { describe, expect, it } from 'vitest'
import { INITIAL_MESSAGE, normalizeConversation } from './App'

describe('normalizeConversation', () => {
  it('always keeps the canonical initial message first', () => {
    const conversation = normalizeConversation([
      {
        id: 'abc123',
        sender: 'user',
        type: 'message',
        time: new Date(),
        body: 'Hello',
      },
    ])

    expect(conversation[0]).toEqual(INITIAL_MESSAGE)
    expect(conversation).toHaveLength(2)
  })

  it('replaces mutated initial message content with the server-rendered one', () => {
    const conversation = normalizeConversation([
      {
        ...INITIAL_MESSAGE,
        body: 'Hi there! Ask me anything and I will give you a yes or no.',
      },
      {
        id: 'def456',
        sender: 'bot',
        type: 'message',
        time: new Date(),
        body: 'Yep!',
      },
    ])

    expect(conversation[0].body).toBe(INITIAL_MESSAGE.body)
    expect(conversation[0].body).toContain(
      '<a href="https://slumpgenerator.com/yes-or-no">',
    )
    expect(conversation).toHaveLength(2)
  })
})
