'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import ThemeModeToggle from '@/components/ThemeModeToggle'
import { Separator } from '@/components/ui/separator'

type ServerSettings = {
  audit?: Boolean
  redact?: Boolean
  threatAnalysis?: Boolean
}
const AppBar = () => {
  const [serverSettings, setServerSettings] = useState<ServerSettings>({})

  const getServerSettings = async () => {
    try {
      const response = await fetch('/api/openai/settings', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return response.json()
    } catch (ex) {
      console.error(ex)
    }
  }

  return (
    <div className='flex flex-col justify-between w-1/5 px-4 py-3 border-r-2 dark:border-r-neutral-800 min-w-fit'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <p className='flex-1 text-lg font-bold text-center'>
            🤙🥷 LLM On Prem
          </p>
          <ThemeModeToggle />
        </div>
        <Separator />
        <Link href={'/'} passHref className='w-full'>
          <Button className='w-full' variant='ghost'>
            Home
          </Button>
        </Link>
        <Link href={'/chat'} passHref className='w-full'>
          <Button className='w-full' variant='ghost'>
            Secure LLM Chat
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default AppBar
