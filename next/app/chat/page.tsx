'use client'
import { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import MessageRow from '../../components/MessageRow'
import { Textarea } from '@/components/ui/textarea'

type LocalMessage = {
  id: string
  user: string
  message: string
}

type LocalState = {
  prompt: string
  loading: boolean
  generating: boolean
  messages: LocalMessage[]
}

const Chat = () => {
  const [localState, setLocalState] = useState<LocalState>({
    prompt: '',
    loading: false,
    generating: false,
    messages: [],
  })

  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  // Append the list with the given message
  const addToMessages = (message: LocalMessage) => {
    setLocalState((prev) => {
      return {
        ...prev,
        messages: [...prev.messages, message],
      }
    })
  }

  // Append to message with the given id
  const appendToMessage = (id: string, message: string) => {
    setLocalState((prev) => {
      const updatedMessages = prev.messages.map((msg) => {
        if (msg.id === id) {
          return {
            ...msg,
            message: msg.message + message,
          }
        }
        return msg
      })
      return {
        ...prev,
        messages: updatedMessages,
      }
    })
  }

  // ----------------- Our Generate API -----------------
  const submitData = async (msg: any) => {
    return await fetch('/api/openai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        prompt: msg.prompt,
        prompt_id: msg.id,
        chat_history: localState.messages,
      }),
    })
  }

  const handleSubmit = async (e: any) => {
    if (
      e.key === 'Enter' &&
      e.code === 'Enter' &&
      !e.shiftKey &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.metaKey &&
      !localState.loading &&
      localState.prompt.trim() !== ''
    ) {
      e.preventDefault()

      try {
        // Clean the prompt/input and set loading to true
        setLocalState((prev: LocalState) => ({
          ...prev,
          prompt: '',
          loading: true,
        }))

        // Omitting message here so we show a loading ellipsis
        // When we receive the response, we will populate the message field
        // with redacted version of the prompt
        const id = uuidv4()
        const userPrompt = {
          id,
          user: 'User',
        }

        addToMessages({
          ...userPrompt,
          message: localState?.prompt,
        })

        let latestMsgId = uuidv4()
        addToMessages({
          id: latestMsgId,
          user: 'Assistant',
          message: '',
        })

        // Add the prompt when submitting to the API
        setLocalState((prev: LocalState) => ({ ...prev, generating: true }))

        const promptResponse = await submitData({
          ...userPrompt,
          prompt: localState?.prompt,
        })

        if (promptResponse.ok) {
          // Get the reader from the response
          const reader = promptResponse.body?.getReader()
          const decoder = new TextDecoder('utf-8')
          let done = false

          while (!done && reader) {
            const { value, done: doneReading } = await reader.read()
            done = doneReading

            let chunk = decoder.decode(value)

            // Append to the local state
            appendToMessage(latestMsgId, chunk)
          }

          console.log('Stream complete')
          setLocalState((prev: LocalState) => ({
            ...prev,
            loading: false,
            generating: false,
          }))
        } else {
          const errorContent = await promptResponse.text()
          console.error(errorContent, promptResponse.status)
          addToMessages({
            id: uuidv4(),
            user: 'Assistant',
            message: `${errorContent} | Status: ${promptResponse.statusText}`,
          })
        }
      } catch (error: any) {
        // Add the error as a message so users can see it
        addToMessages({
          id: uuidv4(),
          user: 'Assistant',
          message: error.message || 'Something went wrong',
        })
      } finally {
        console.log('finally')
        setLocalState((prev: LocalState) => ({
          ...prev,
          loading: false,
          generating: false,
        }))
      }
    }
  }

  // We scroll to the bottom of the messages
  useEffect(() => {
    if (messagesEndRef.current !== null) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [localState.messages])

  return (
    <main className='flex flex-col w-full h-full p-0'>
      <div className='w-full h-full mt-4 overflow-y-auto'>
        <>
          {localState.messages.map((msg: any) => (
            <MessageRow key={msg.id} message={msg} />
          ))}
        </>
        <div ref={messagesEndRef} />
      </div>
      <div className='relative flex-1 w-100'>
        <Textarea
          className='my-4 text-md'
          disabled={localState.loading}
          placeholder={localState.loading ? '' : 'Enter a prompt'}
          value={localState.prompt}
          // className="w-4/5 h-12 px-4 py-2 m-4 text-base border border-gray-300 rounded-lg"
          onChange={(e) =>
            setLocalState((prev: LocalState) => ({
              ...prev,
              prompt: e.target.value,
            }))
          }
          onKeyDown={handleSubmit}
        />
      </div>
      <p className='flex justify-center my-2 text-sm text-gray-400 dark:text-gray-700'>
        This app is for educational purposes. Not intended for production use
      </p>
    </main>
  )
}

export default Chat
