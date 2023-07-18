'use client'
import { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useAuth } from '@pangeacyber/react-auth'
import pageWithAuthentication from '../../components/pageWithAuthentication'
import MessageRow from '../../components/MessageRow'
import { Textarea } from '@/components/ui/textarea'

const initialState = {
  prompt: '',
  loading: false,
  promptLoading: false,
  messages: [],
}

const Chat = () => {
  const { getToken, user } = useAuth()
  const [localState, setLocalState] = useState(initialState)

  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const token = getToken()

  // Append the list with the given message
  const addToMessages = (message: any) => {
    setLocalState((prev: any) => {
      return {
        ...prev,
        messages: [...prev.messages, message],
      }
    })
  }

  // Update the message with the given ID with the given content
  const updateMessagePrompt = (messageID: string, newPrompt: string) => {
    setLocalState((prev: any) => ({
      ...prev,
      messages: prev.messages.map((m: any) => {
        if (m.id === messageID) {
          return {
            ...m,
            message: newPrompt,
          }
        }
        return m
      }),
    }))
  }

  const redactData = async (msg: any) => {
    return await fetch('/api/redact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt: msg.prompt, prompt_id: msg.id }),
    })
  }

  // ----------------- OpenAI API -----------------
  const submitData = async (msg: any) => {
    console.log(localState.messages)

    return await fetch('/api/openai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        prompt: msg.prompt,
        prompt_id: msg.id,
        chat_history: localState.messages,
      }),
    })
  }

  const handleKeyDown = async (e: any) => {
    if (e.key === 'Enter' && !localState.loading) {
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
          user: user?.profile?.first_name || 'User',
        }

        addToMessages(userPrompt)

        let redactedData = { prompt: localState.prompt }

        // Call the redact function
        const redactResponse = await redactData({
          prompt: localState.prompt,
        })

        if (redactResponse.status !== 200) {
          const errorContent = await redactResponse.text()
          console.error(errorContent, redactResponse.status)
          addToMessages({
            id: uuidv4(),
            user: 'System',
            message: `${errorContent} | Status: ${redactResponse.status}`,
            maliciousURLs: [],
          })
        } else {
          redactedData = await redactResponse.json()
          // Update the message with the redacted prompt
          updateMessagePrompt(id, redactedData?.prompt)

          // Add the prompt when submitting to the API
          setLocalState((prev) => ({ ...prev, promptLoading: true }))

          const promptResponse = await submitData({
            ...userPrompt,
            prompt: redactedData?.prompt,
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
    <main className='w-full h-full p-0 flex flex-col'>
      <div className='w-full h-full overflow-y-auto mt-4'>
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
      <div className='relative flex-0 flex-1 w-100'>
        <Textarea
          className='resize-none my-4'
          disabled={localState.loading}
          placeholder={localState.loading ? '' : 'Enter a prompt'}
          value={localState.prompt}
          // className="border border-gray-300 px-4 py-2 text-base w-4/5 h-12 m-4 rounded-lg"
          onChange={(e) =>
            setLocalState((prev) => ({ ...prev, prompt: e.target.value }))
          }
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className='flex justify-center my-2'>
        This app is for educational purposes. Not intended for production use
      </div>
    </main>
  )
}

export default pageWithAuthentication(Chat)