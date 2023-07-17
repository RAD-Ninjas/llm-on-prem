'use client'
import { useAuth } from '@pangeacyber/react-auth'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

type ServerSettings = {
  audit?: Boolean
  redact?: Boolean
  threatAnalysis?: Boolean
}
const AppBar = () => {
  const [serverSettings, setServerSettings] = useState<ServerSettings>({})
  const { authenticated, getToken, login, logout } = useAuth()
  const token = authenticated ? getToken() : ''

  const getServerSettings = async () => {
    try {
      const response = await fetch('/api/openai/settings', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      return response.json()
    } catch (ex) {
      console.error(ex)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await getServerSettings()
      setServerSettings(data)
    }
    if (token) {
      fetchData()
    }
  }, [authenticated])

  return (
    <div className='border-r-2 w-1/5 min-w-fit flex flex-col justify-between'>
      <div className='flex flex-col px-4 py-3 gap-2'>
        <Link href={'/'} passHref className='w-full'>
          <Button className='w-full' variant='secondary'>
            Home
          </Button>
        </Link>

        {authenticated && (
          <Link href={'/chat'} passHref className='w-full'>
            <Button className='w-full' variant='secondary'>
              Secure LLM Chat
            </Button>
          </Link>
        )}
      </div>
      <div className='px-1 py-0'>
        {authenticated && (
          <>
            <p>Audit: {serverSettings?.audit ? 'Enabled' : 'Disabled'}</p>

            <p>Redact: {serverSettings?.redact ? 'Enabled' : 'Disabled'}</p>

            <p>
              Threat Analysis:{' '}
              {serverSettings?.threatAnalysis ? 'Enabled' : 'Disabled'}
            </p>

            <Button onClick={() => logout()}>Sign Out</Button>
          </>
        )}
        {!authenticated && (
          <Button variant='secondary' color='purple' onClick={() => login()}>
            Sign In
          </Button>
        )}
      </div>
    </div>
  )
}

export default AppBar
