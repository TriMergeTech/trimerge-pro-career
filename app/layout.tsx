
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './styles/index.css'

import React, { ReactNode } from 'react'
import { Manrope } from 'next/font/google'
import { UserProvider } from '@/contexts/userContext/userContext'

const manrope = Manrope({ subsets: ['latin'], display: 'swap' })

function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={manrope.className}>
      <body className="tp-shell overflow-x-hidden antialiased" style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-ink)' }}>
        <UserProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  )
}

export default Layout