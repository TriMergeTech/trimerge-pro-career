"use client"

import React from 'react'

import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@/contexts/userContext/userContext';
import { ChevronRight, LogOut, Menu, Sparkles, X } from 'lucide-react';

function Navbar() {
  const { state, logout } = useUser()
  const user = state.user
  const [open, setOpen] = React.useState(false)
  const displayName = user?.profile?.firstName ? `${user.profile.firstName}${user.profile.lastName ? ' ' + user.profile.lastName : ''}` : (user?.email ?? null)
  const isEmployer = user?.accountType === 'EMPLOYER'

  const navLinks = [
    { href: '/browse-jobs', label: 'Browse Jobs' },
    { href: '/about', label: 'About Us' },
    { href: '/join-now', label: 'Join Now' },
  ]

  const employerLink = { href: '/employer-dashboard', label: 'Employer Dashboard' }

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(148, 163, 184, 0.18)',
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(18px)',
        boxShadow: '0 16px 38px -26px rgba(15,23,42,0.4)',
      }}
    >
      <div className="tp-container" style={{ padding: '1rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <Image src="/Logo.png" alt="TriMergePro Logo" width={190} height={84} style={{ objectFit: 'contain', height: '2.8rem', width: 'auto' }} />
          </Link>

          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.35rem' }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="tp-nav-link">
                {link.label}
              </Link>
            ))}
            {isEmployer && (
              <Link href={employerLink.href} className="tp-nav-link" style={{ fontWeight: 800, color: 'var(--tp-primary)' }}>
                {employerLink.label}
              </Link>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {user ? (
              <>
                <div style={{ display: 'none', alignItems: 'center', gap: '0.65rem', padding: '0.55rem 0.8rem', borderRadius: '999px', background: 'rgba(29,78,216,0.08)', color: 'var(--tp-primary-dark)' }} className="md:flex">
                  <span style={{ width: '0.55rem', height: '0.55rem', borderRadius: '999px', background: 'var(--tp-success)' }} />
                  <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>{displayName}</span>
                </div>
                <button onClick={() => logout()} className="tp-btn-ghost" style={{ padding: '0.8rem 1rem' }}>
                  <LogOut size={16} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="tp-btn-secondary hidden sm:inline-flex" style={{ padding: '0.8rem 1rem' }}>
                  Log In
                </Link>
                <Link href="/join-now" className="tp-btn-primary" style={{ padding: '0.8rem 1rem' }}>
                  Join Now
                  <ChevronRight size={16} />
                </Link>
              </>
            )}

            <button onClick={() => setOpen((current) => !current)} className="tp-btn-ghost md:hidden" aria-label="Toggle navigation" style={{ padding: '0.75rem' }}>
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="tp-card-soft md:hidden tp-fade-up" style={{ marginTop: '0.9rem', padding: '0.85rem' }}>
            <div style={{ display: 'grid', gap: '0.4rem' }}>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="tp-nav-link" onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              ))}
              {isEmployer && (
                <Link href={employerLink.href} className="tp-nav-link" onClick={() => setOpen(false)}>
                  {employerLink.label}
                </Link>
              )}
              {!user && (
                <Link href="/login" className="tp-nav-link" onClick={() => setOpen(false)}>
                  Log In
                </Link>
              )}
            </div>
            <div style={{ marginTop: '0.8rem', padding: '0.8rem', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(29,78,216,0.12), rgba(245,166,35,0.12))', color: 'var(--tp-ink)', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
              <Sparkles size={16} color="var(--tp-primary)" />
              <span style={{ fontSize: '0.92rem', fontWeight: 700 }}>Built for talents and employers with a modern consulting-grade experience.</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar