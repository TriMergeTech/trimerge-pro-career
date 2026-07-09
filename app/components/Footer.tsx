"use client"

import Link from 'next/link'
import { ArrowUpRight, Globe, Mail, MapPin, Phone } from 'lucide-react'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ marginTop: '4rem', borderTop: '1px solid rgba(148, 163, 184, 0.18)', background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(18px)' }}>
      <div className="tp-container" style={{ padding: '3rem 0 1.5rem' }}>
        <div className="tp-card-soft" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(29,78,216,0.08), rgba(245,166,35,0.08))' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div className="tp-kicker">TriMergePro Careers</div>
              <h3 style={{ margin: '0.4rem 0 0', fontSize: '1.5rem', letterSpacing: '-0.04em' }}>Driving quality and innovation forward.</h3>
            </div>
            <Link href="/join-now" className="tp-btn-primary">
              Join the community
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: '1.5rem' }}>
          <div className="auth-span-5">
            <div style={{ display: 'grid', gap: '0.9rem' }}>
              <p className="tp-lead" style={{ margin: 0 }}>
                A polished careers experience for talents and employers, built to support fast-moving hiring with a consulting-grade standard of clarity.
              </p>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
              {[
                { title: 'Explore', links: [{ href: '/browse-jobs', label: 'Browse Jobs' }, { href: '/join-now', label: 'Join Now' }, { href: '/login', label: 'Log In' }] },
                { title: 'Company', links: [{ href: '/about', label: 'About Us' }, { href: '/forgot-password', label: 'Forgot Password' }] },
              ].map((column) => (
                <div key={column.title} className="tp-card" style={{ padding: '1.1rem 1.1rem 1rem' }}>
                  <div className="tp-kicker" style={{ marginBottom: '0.8rem' }}>{column.title}</div>
                  <div style={{ display: 'grid', gap: '0.55rem' }}>
                    {column.links.map((link) => (
                      <Link key={link.href} href={link.href} className="tp-footer-link">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(148, 163, 184, 0.16)', display: 'flex', flexWrap: 'wrap', gap: '1.1rem', fontSize: '0.92rem' }}>
          {['Privacy Policy', 'Terms of Use', 'Accessibility', 'Contact Us'].map((label) => (
            <a key={label} href="#" onClick={(e) => e.preventDefault()} className="tp-footer-link">
              {label}
            </a>
          ))}
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