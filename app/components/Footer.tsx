"use client"

import Link from 'next/link'
import { Globe, Mail, MapPin, Phone } from 'lucide-react'
import { useUser } from '@/contexts/userContext/userContext'

function Footer() {
  const year = new Date().getFullYear()
  const { state } = useUser()
  const isRecruiter = state.user?.accountType === 'EMPLOYER'

  const isLoggedInCandidate = !!state.user && !isRecruiter

  if (isLoggedInCandidate) return null

  if (isRecruiter) {
    return (
      <footer style={{ borderTop: '1px solid rgba(148, 163, 184, 0.18)', background: 'rgba(255,255,255,0.72)' }}>
        <div className="tp-container" style={{ padding: '0.85rem 0', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--tp-muted)' }}>
          <span>© {year} TriMergePro Careers. All rights reserved.</span>
          <span>TriMergePRO Careers is a workforce and recruiting platform designed to connect talent, employers, and opportunities through technology-driven solutions.</span>
        </div>
      </footer>
    )
  }

  return (
    <footer style={{ marginTop: '4rem', borderTop: '1px solid rgba(148, 163, 184, 0.18)', background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(18px)' }}>
      <div className="tp-container" style={{ padding: '3rem 0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: '1.5rem' }}>
          <div className="auth-span-5">
            <div style={{ display: 'grid', gap: '0.9rem' }}>
              <div style={{ display: 'grid', gap: '0.55rem', color: 'var(--tp-muted)', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Mail size={16} /> careers@trimergeconsulting.com</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Phone size={16} /> (305) 940-5344</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><MapPin size={16} /> Miami, FL</div>
                <a href="https://www.trimergeconsulting.com" target="_blank" rel="noopener noreferrer" className="tp-footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--tp-muted)' }}><Globe size={16} /> www.TriMergeConsulting.com</a>
                <a href="https://www.trimergepro.com" target="_blank" rel="noopener noreferrer" className="tp-footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--tp-muted)' }}><Globe size={16} /> www.TriMergePRO.com</a>
              </div>
            </div>
          </div>

          <div className="auth-span-7">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(9rem, 1fr))', gap: '1.5rem' }}>
              {[
                { title: 'Employers', links: [{ href: '/employers', label: 'Post a Job' }, { href: '/login', label: 'Employer Log In' }] },
                { title: 'Job Seekers', links: [{ href: '/browse-jobs', label: 'Browse Jobs' }, { href: '/join-now', label: 'Create Profile' }, { href: '/login', label: 'Log In' }] },
                { title: 'Company', links: [{ href: '/about', label: 'About Us' }, { href: 'mailto:careers@trimergeconsulting.com', label: 'Contact Us' }] },
                { title: 'Support', links: [{ href: '/forgot-password', label: 'Forgot Password' }, { href: '#', label: 'Privacy Policy' }, { href: '#', label: 'Terms of Use' }, { href: '#', label: 'Accessibility' }] },
              ].map((column) => (
                <div key={column.title}>
                  <div className="tp-kicker" style={{ marginBottom: '0.8rem' }}>{column.title}</div>
                  <div style={{ display: 'grid', gap: '0.55rem' }}>
                    {column.links.map((link) => (
                      link.href === '#' ? (
                        <a key={link.label} href="#" onClick={(e) => e.preventDefault()} className="tp-footer-link">
                          {link.label}
                        </a>
                      ) : (
                        <Link key={link.label} href={link.href} className="tp-footer-link">
                          {link.label}
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(148, 163, 184, 0.16)', color: 'var(--tp-muted)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '0.75rem', fontSize: '0.92rem' }}>
          <span>© {year} TriMergePro Careers. All rights reserved.</span>
          <span>TriMergePRO Careers is a workforce and recruiting platform designed to connect talent, employers, and opportunities through technology-driven solutions.</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer