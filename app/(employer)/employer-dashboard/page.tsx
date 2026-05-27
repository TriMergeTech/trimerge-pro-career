"use client";

import { useEffect, useState } from 'react';
// icons and extra components removed from this view because they are unused here
import { useUser } from '@/contexts/userContext/userContext';
import useGetEmployer from '@/hooks/useGetEmployer';
import { Building2, Globe, ShieldCheck, Users2 } from 'lucide-react';


export function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState<'accountInfo' | 'accountSettings' | 'privacySecurity'>('accountInfo');
  const {state} = useUser()
  const { data: userData } = useGetEmployer()
  // keep typing light here; profile comes from backend and may be loosely shaped
  // guard against `userData` being null (fetch hook may return null while loading)
  const profile = (userData as Record<string, unknown> | null)?.['profile'] ?? {};
  const profileRecord = profile as Record<string, unknown>;
  const companyName = String(profileRecord['companyName'] ?? '');
  const companyWebsite = String(profileRecord['companyWebsite'] ?? '');
  const industry = String(profileRecord['industry'] ?? '');
  const companySize = String(profileRecord['companySize'] ?? '');
  const recruiterRole = String(profileRecord['yourRole'] ?? profileRecord['role'] ?? '');
  const companyOverview = String(profileRecord['companyOverview'] ?? '');
  useEffect(( ) => {
    console.log(userData)

  },[userData])
  const recruiterProfile = (state.user?.profile ?? {}) as Record<string, unknown>;
  const recruiterPhone = String(recruiterProfile['phone'] ?? recruiterProfile['phoneNumber'] ?? '');
  const stats = [
    { label: 'Company profile', value: companyName || 'Incomplete', icon: Building2 },
    { label: 'Primary industry', value: industry || 'Not set', icon: Globe },
    { label: 'Team size', value: companySize || 'Not set', icon: Users2 },
    { label: 'Security state', value: 'Verified', icon: ShieldCheck },
  ];
  
  return (
    <div className="flex-1 overflow-hidden" style={{ background: 'linear-gradient(180deg, #f8fbff 0%, #f4f7fb 42%, #eef4fb 100%)', minHeight: '90vh', padding: '2rem' }}>
      <div className="tp-container" style={{ display: 'grid', gap: '1.25rem' }}>
        <div className="tp-card-soft" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #07172e 0%, #1d4ed8 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 'auto -4rem -4rem auto', width: '14rem', height: '14rem', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', filter: 'blur(28px)' }} />
          <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div className="tp-chip" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', borderColor: 'rgba(255,255,255,0.14)' }}>Employer dashboard</div>
              <h1 style={{ margin: '0.75rem 0 0.35rem', fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.05em' }}>My profile</h1>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.82)', maxWidth: '46rem', lineHeight: 1.7 }}>Review the company data powering your employer profile and keep the hiring experience consistent across the platform.</p>
            </div>
            <div style={{ display: 'grid', gap: '0.5rem', minWidth: '15rem' }}>
              <div style={{ fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>Current tab</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{activeTab === 'accountInfo' ? 'Account info' : activeTab === 'accountSettings' ? 'Account settings' : 'Privacy and security'}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }}>
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="tp-card-soft" style={{ padding: '1rem 1.1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ width: '2.8rem', height: '2.8rem', borderRadius: '16px', background: 'rgba(29,78,216,0.08)', color: 'var(--tp-primary)', display: 'grid', placeItems: 'center' }}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--tp-muted)' }}>{stat.label}</div>
                    <div style={{ fontWeight: 800, color: 'var(--tp-ink)' }}>{stat.value}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button className="tp-chip" style={{ background: activeTab === 'accountInfo' ? 'rgba(29,78,216,0.12)' : 'white', color: activeTab === 'accountInfo' ? 'var(--tp-primary)' : 'var(--tp-muted)', borderColor: activeTab === 'accountInfo' ? 'rgba(29,78,216,0.25)' : 'rgba(148,163,184,0.18)' }} onClick={() => setActiveTab('accountInfo')}>Account Info</button>
          <button className="tp-chip" style={{ background: activeTab === 'accountSettings' ? 'rgba(29,78,216,0.12)' : 'white', color: activeTab === 'accountSettings' ? 'var(--tp-primary)' : 'var(--tp-muted)', borderColor: activeTab === 'accountSettings' ? 'rgba(29,78,216,0.25)' : 'rgba(148,163,184,0.18)' }} onClick={() => setActiveTab('accountSettings')}>Account Settings</button>
          <button className="tp-chip" style={{ background: activeTab === 'privacySecurity' ? 'rgba(29,78,216,0.12)' : 'white', color: activeTab === 'privacySecurity' ? 'var(--tp-primary)' : 'var(--tp-muted)', borderColor: activeTab === 'privacySecurity' ? 'rgba(29,78,216,0.25)' : 'rgba(148,163,184,0.18)' }} onClick={() => setActiveTab('privacySecurity')}>Privacy and Security</button>
        </div>
      </div>
      {
        activeTab === 'accountInfo' ? (
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem', flexWrap: 'wrap', display: 'flex', columnGap: '1rem', paddingTop: '1rem', rowGap: '1rem' }}>
            <div className="tp-card-soft" style={{ width: '45%', height: 'fit-content', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', rowGap: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0b1f3a', width: '100%', display:'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>
                  Recruiter Contact Info
                </p>
                <button className="tp-btn-secondary" style={{ padding: '0.55rem 0.9rem' }}>
                  Edit
                </button>
              </span>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#4A5568', marginBottom: '0.25rem' }}>Full Name</label>
                <input value={`${state.user?.profile?.firstName ?? ''} ${state.user?.profile?.lastName ?? ''}`} style={{ border: '1px solid #E2E8F0', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#4A5568', marginBottom: '0.25rem' }}>Email</label>
                <input value={state.user?.email ?? ''} style={{ border: '1px solid #E2E8F0', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#4A5568', marginBottom: '0.25rem' }}>Phone Number</label>
                <input value={recruiterPhone} style={{ border: '1px solid #E2E8F0', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#4A5568', marginBottom: '0.25rem' }}>Role/Title</label>
                <input value={recruiterRole} style={{ border: '1px solid #E2E8F0', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', width: '100%' }} />
              </div>
            </div>
            <div className="tp-card-soft" style={{ width: '45%', height: 'fit-content', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', rowGap: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0b1f3a', width: '100%', display:'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>
                  Company Profile
                </p>
                <button className="tp-btn-secondary" style={{ padding: '0.55rem 0.9rem' }}>
                  Edit
                </button>
              </span>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#4A5568', marginBottom: '0.25rem' }}>Company Name</label>
                <input value={companyName} style={{ border: '1px solid #E2E8F0', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#4A5568', marginBottom: '0.25rem' }}>Company Website</label>
                <input value={companyWebsite} style={{ border: '1px solid #E2E8F0', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#4A5568', marginBottom: '0.25rem' }}>Company Industry</label>
                <input value={industry} style={{ border: '1px solid #E2E8F0', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#4A5568', marginBottom: '0.25rem' }}>Company Size</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input value={`${companySize} People`} style={{ border: '1px solid #E2E8F0', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', width: '100%' }} />
                </div>
              </div>
            </div>
            <div className="tp-card-soft" style={{ width: '45%', height: 'fit-content', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', rowGap: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0b1f3a', width: '100%', display:'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>
                  Company Overview
                </p>
                <button className="tp-btn-secondary" style={{ padding: '0.55rem 0.9rem' }}>
                  Edit
                </button>
              </span>
                <input value={companyOverview} style={{ border: '1px solid rgba(148,163,184,0.2)', borderRadius: '16px', padding: '0.75rem 0.9rem', width: '100%', background: '#f8fafc' }} />
            </div>
          </div>
        ) : activeTab === 'accountSettings' ? (
          <div className="tp-card-soft" style={{ marginTop: '1rem', padding: '1.5rem', borderRadius: '24px' }}>
            <p style={{ margin: 0, color: 'var(--tp-muted)' }}>Account settings will land here next.</p>

          </div>
        ):
        (
          <div className="tp-card-soft" style={{ marginTop: '1rem', padding: '1.5rem', borderRadius: '24px' }}>
            <p style={{ margin: 0, color: 'var(--tp-muted)' }}>Privacy and security settings will land here next.</p>
            </div>
        )
       
      }
      </div>
    </div>
  );
}

export default EmployerDashboard;