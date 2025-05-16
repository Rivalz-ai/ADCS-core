import { OpenAI } from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Anthropic } from '@anthropic-ai/sdk'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

export async function openai(apiKey: string, model: string, message: string) {
  const openai = new OpenAI({
    apiKey: apiKey
  })

  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: message }
  ]

  const response = await openai.chat.completions.create({
    model: model,
    messages: messages
  })
  return response.choices[0].message.content
}

export async function anthropic(apiKey: string, model: string, message: string) {
  const client = new Anthropic({
    apiKey: apiKey
  })

  const response = await client.messages.create({
    model: model,
    system: 'You are a helpful assistant.',
    messages: [{ role: 'user', content: message }],
    max_tokens: 1000
  })

  const content = response.content[0]
  if (content.type === 'text') {
    return content.text
  }
  throw new Error('Unexpected response type from Anthropic')
}

export async function gemini(apiKey: string, model: string, message: string) {
  const client = new GoogleGenerativeAI(apiKey)
  const modelInstance = client.getGenerativeModel({ model: model })

  const chat = modelInstance.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: 'You are a helpful assistant.' }]
      },
      {
        role: 'model',
        parts: [{ text: 'I understand. I will be a helpful assistant.' }]
      }
    ]
  })

  const result = await chat.sendMessage(message)
  const response = result.response
  return response.text()
}

export function extractJsonFromText(text: string): any {
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0])
    } catch (e) {
      throw new Error('Failed to parse JSON from text')
    }
  }
  throw new Error('No JSON found in text')
}

// Example usage:
// const json = extractJsonFromText(response);
// console.log(json.coinName); // "bitcoin"
// console.log(json.shouldBuy); // false
