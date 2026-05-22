"use client"

import React from 'react'

import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@/contexts/userContext/userContext';

function Navbar() {
  const { state, logout } = useUser()
  const user = state.user
  const displayName = user?.profile?.firstName ? `${user.profile.firstName}${user.profile.lastName ? ' ' + user.profile.lastName : ''}` : (user?.email ?? null)

  return (
    <nav
      style={{
        position: 'sticky',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        borderBottom: '1px solid #E5E7EB',
        background: '#fff',
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link href="/">
          <Image src="/Logo.png" alt="TriMergePro Logo" width={200} height={90} style={{ objectFit: 'contain', height: '3rem' }} />
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link href="/browse-jobs" style={{ color: '#1E293B', fontWeight: 500, fontSize: '1rem', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: 6, transition: 'background 0.15s' }}>
          Browse Jobs
        </Link>
        <Link href="/about" style={{ color: '#1E293B', fontWeight: 500, fontSize: '1rem', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: 6, transition: 'background 0.15s' }}>
          About Us
        </Link>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ color: '#1E293B', fontWeight: 600 }}>{displayName}</div>
            <button onClick={() => logout()} style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: 600 }}>Logout</button>
          </div>
        ) : (
          <>
            <Link href="/signup">
              <button style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: '1px solid #1E3A8A', background: '#fff', color: '#1E3A8A', fontWeight: 600, marginRight: '1rem' }}>Sign Up</button>
            </Link>
            <Link href="/login">
              <button style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', background: '#1E3A8A', color: '#fff', fontWeight: 600 }}>Log In</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar