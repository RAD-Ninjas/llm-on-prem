'use client'
import { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import MessageRow from '../../components/MessageRow'
import { Textarea } from '@/components/ui/textarea'

type LocalState = {
  prompt: string
  loading: boolean
  promptLoading: boolean
  messages: string[]
}

const Chat = () => {
  const [localState, setLocalState] = useState({
    prompt: '',
    loading: false,
    promptLoading: false,
    messages: [],
  })

  const messagesEndRef = useRef<null | HTMLDivElement>(null)


  // Append the list with the given message
  const addToMessages = (message: any) => {
    setLocalState((prev: any) => {
      return {
        ...prev,
        messages: [...prev.messages, message],
      }
    })
  }

  // ----------------- OpenAI API -----------------
  const submitData = async (msg: any) => {
    console.log(localState.messages)

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

  const handleKeyDown = async (e: any) => {
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
        setLocalState((prev) => ({ ...prev, prompt: '', loading: true }))

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

        // Add the prompt when submitting to the API
        setLocalState((prev) => ({ ...prev, promptLoading: true }))

        const promptResponse = await submitData({
          ...userPrompt,
          prompt: localState?.prompt,
        })

        let promptData
        if (promptResponse.status === 200) {
          promptData = await promptResponse.json()
          addToMessages({
            id: uuidv4(),
            user: 'System',
            message: promptData?.result,
            maliciousURLs: promptData?.maliciousURLs,
          })
        } else {
          const errorContent = await promptResponse.text()
          console.error(errorContent, promptResponse.status)
          addToMessages({
            id: uuidv4(),
            user: 'System',
            message: `${errorContent} | Status: ${promptResponse.status}`,
            maliciousURLs: [],
          })

        }
      } catch (error: any) {
        // Add the error as a message so users can see it
        addToMessages({
          id: uuidv4(),
          user: 'System',
          message: error.message || 'Something went wrong',
          maliciousURLs: [],
        })
      } finally {
        console.log('finally')
        setLocalState((prev) => ({
          ...prev,
          loading: false,
          promptLoading: false,
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
          {localState.promptLoading && (
            <MessageRow key='loader' message={{ user: 'System' }} />
          )}
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
            setLocalState((prev) => ({ ...prev, prompt: e.target.value }))
          }
          onKeyDown={handleKeyDown}
        />
      </div>
      <p className='flex justify-center my-2 text-sm text-gray-400 dark:text-gray-700'>
        This app is for educational purposes. Not intended for production use
      </p>
    </main>
  )
}

export default Chat
