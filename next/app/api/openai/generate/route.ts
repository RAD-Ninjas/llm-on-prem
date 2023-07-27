
import { NextRequest, NextResponse } from 'next/server'
import { ChatCompletionRequestMessageRoleEnum } from 'openai'
import { OpenAIStream, OpenAIStreamPayload } from './open-ai-stream'

const TARGET_MODEL = process.env.MODEL_NAME || 'Llama-2-7b-chat-hf'

// ----------------------------------------------------------
const handler = async (req: NextRequest, res: NextResponse) => {
  const body = await req.json()
  const prompt = body?.prompt?.trim() || ''
  const prompt_id = body?.prompt_id || ''
  const chat_history = body?.chat_history || []

  if (prompt.length === 0) {
    return new Response('Please enter a valid prompt', { status: 400 })
  }

  try {
    // Build up the request data
    const chatReqData: OpenAIStreamPayload = {
      model: TARGET_MODEL,
      messages: [
        {
          role: ChatCompletionRequestMessageRoleEnum.System,
          content: 'You are a language model assistant.',
        },
        // Populate the chat history
        ...chat_history.map((msg: any, ix: number) => {
          return {
            role:
              ix % 2 === 0
                ? ChatCompletionRequestMessageRoleEnum.User
                : ChatCompletionRequestMessageRoleEnum.Assistant,
            content: msg.message as string,
          }
        }),
        {
          role: ChatCompletionRequestMessageRoleEnum.User,
          content: prompt as string,
        },
      ],
      stream: true,
      // temperature: 0.7,
      // max_tokens: getAvailableTokens(processedPrompt),
    }

    const stream = await OpenAIStream(chatReqData)

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })

  } catch (error: any) {
    if (error.response) {
      console.error(error.response.status, error.response.data)
      return new Response('An error occurred during your request.', {
        status: 400,
      })
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
      return new Response('An error occurred during your request.', {
        status: 500,
      })
    }
  }
}

export const POST = handler
