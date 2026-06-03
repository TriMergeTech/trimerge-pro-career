
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './styles/index.css'

import React, { ReactNode } from 'react'
import { Manrope } from 'next/font/google'
import { UserProvider } from '@/contexts/userContext/userContext'

const manrope = Manrope({ subsets: ['latin'], display: 'swap' })

function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={manrope.className} suppressHydrationWarning>
      <body className="tp-shell overflow-x-hidden antialiased" suppressHydrationWarning style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-ink)' }}>
        <UserProvider>
          <a href="#content" className="skip-link">Skip to content</a>
          <Navbar />
          <main id="content" tabIndex={-1}>{children}</main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  )
}

export default Layout