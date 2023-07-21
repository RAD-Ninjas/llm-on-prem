import { NextRequest } from 'next/server'
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai'

const SOURCE = 'pangea-secure-chatgpt'
const TARGET_MODEL = 'mpt-7b-chat'
const ACTION = 'openai_generate'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  basePath: process.env.MODEL_BASE_PATH,
})

const openai = new OpenAIApi(configuration)

const handler = async (req: NextRequest) => {
  if (!configuration.apiKey) {
    return new Response('The service cannot communicate with OpenAI', {
      status: 500,
    })
  }

  const body = await req.json()
  const prompt = body?.prompt?.trim() || ''
  const prompt_id = body?.prompt_id || ''
  const chat_history = body?.chat_history || []

  if (prompt.length === 0) {
    return new Response('Please enter a valid prompt', { status: 400 })
  }

  try {
    const promises = []

    // we start with the original prompt and update it based on the options
    let processedPrompt = prompt

    // Call OpenAI API with the processed prompt
    const chatReqData = {
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
                : ChatCompletionRequestMessageRoleEnum.System,
            content: msg.message,
          }
        }),
        {
          role: ChatCompletionRequestMessageRoleEnum.User,
          content: processedPrompt,
        },
      ],
      // temperature: 0.7,
      // max_tokens: getAvailableTokens(processedPrompt),
    }

    promises.push(openai.createChatCompletion(chatReqData))

    const results = await Promise.allSettled(promises)

    let auditResults
    let chatResults

    if (results.length > 1) {
      auditResults = results[0] as any
      auditResults = auditResults?.value
      chatResults = results[1] as any
      chatResults = chatResults?.value
    } else {
      chatResults = results[0]
    }

    let sanitizedResponse =
      chatResults.data?.choices?.[0]?.message?.content || ''

    // Remove the pattern "<|im_end|><|endoftext|>" from the response
    sanitizedResponse = sanitizedResponse.replaceAll('<|im_end|>', '')
    sanitizedResponse = sanitizedResponse.replaceAll('<|endoftext|>', '')

    const responseData = {
      prompt: processedPrompt,
      prompt_id,
      result: sanitizedResponse,
    }

    return new Response(JSON.stringify(responseData), {
      headers: { 'content-type': 'application/json' },
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
