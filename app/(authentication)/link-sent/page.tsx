<<<<<<< HEAD
import React, { Suspense } from 'react'
import LinkSentClient from './LinkSentClient'
=======
"use client"

import Link from 'next/link'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { AuthShell } from '../../components/ui/AuthShell'
import { MailCheck, RotateCcw } from 'lucide-react'
import { useResendEmail } from '@/hooks/useResendEmail'

function Page() {
    const searchParams = useSearchParams()
    const email = searchParams?.get('email') || ''
    const { resend, loading: resendLoading } = useResendEmail()
    const [message, setMessage] = React.useState<string | null>(null)
>>>>>>> remotes/personalRepo/Sebastian-branch

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LinkSentClient />
    </Suspense>
  )
}