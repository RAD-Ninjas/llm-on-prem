'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ThemeModeToggle from '@/components/ThemeModeToggle'
import { Separator } from '@/components/ui/separator'


const AppBar = () => {

  return (
    <div className='flex flex-col justify-between w-1/5 px-4 py-3 border-r-2 dark:border-r-neutral-800 min-w-fit'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <p className='flex-1 pr-4 text-lg font-bold text-center'>
            🤙🥷 LLM-On-Prem
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
