"use client";

import { useEffect, useState, useMemo } from 'react';
// icons and extra components removed from this view because they are unused here
import { useUser } from '@/contexts/userContext/userContext';
import useGetEmployer from '@/hooks/useGetEmployer';
import { useRouter } from 'next/navigation';


export function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState<'accountInfo' | 'accountSettings' | 'privacySecurity'>('accountInfo');
  const {state} = useUser()
  const router = useRouter();
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
  // memoize primaryHiringNeeds transformation to keep stable identity for deps
  const memoPrimaryHiringNeeds = useMemo(() => {
    const primaryHiringNeeds = profileRecord['primaryHiringNeeds'] ?? [];
    return Array.isArray(primaryHiringNeeds)
      ? primaryHiringNeeds.map(String)
      : primaryHiringNeeds ? [String(primaryHiringNeeds)] : [];
  }, [profileRecord]);
  const opportunitiesAndBenefits = String(profileRecord['benefitsAndOpportunities'] ?? '');
  // local state: local additions and removed items (by name). We keep these
  // separate from backend-provided primary needs to avoid effect loops.
  const [localAdds, setLocalAdds] = useState<string[]>([]);
  const [removedNeeds, setRemovedNeeds] = useState<string[]>([]);
  const [newHiringNeed, setNewHiringNeed] = useState('');

  // Compose the displayed list: backend primary needs first (unless removed),
  // then local additions. Deduplicate so items added locally that match a
  // primary need don't duplicate.
  const displayedNeeds = useMemo(() => {
    const result: string[] = [];
    const seen = new Set<string>();
    for (const p of memoPrimaryHiringNeeds) {
      if (removedNeeds.includes(p)) continue;
      if (!seen.has(p)) { seen.add(p); result.push(p); }
    }
    for (const p of localAdds) {
      if (!seen.has(p)) { seen.add(p); result.push(p); }
    }
    return result;
  }, [memoPrimaryHiringNeeds, localAdds, removedNeeds]);
  const accountType = String(state.user?.accountType ?? '');
  useEffect(() => {
    console.log(userData)
    if (accountType === 'TALENT') router.replace('/talent-dashboard');
  }, [accountType, router, userData]);
  // recruiter profile accessed directly from state.user?.profile when needed
  
  return (
    <div className="flex-1 bg-[#F4F4F9] overflow-hidden h-[90vh] " style={{ display: 'flex', flexDirection: 'column', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0b1f3a', marginBottom: '1.5rem' }}>
        My Profile
      </h1>
      <span>
        <div style={{ display: 'flex',  columnGap: '1rem' }}>
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: activeTab === 'accountInfo' ? '#1E5DAA' : '#A0AEC0', cursor: 'pointer', textUnderlineOffset: '10px', textDecoration: activeTab === 'accountInfo' ? 'underline' : 'none' }} onClick={() => setActiveTab('accountInfo')}>Account Info</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: activeTab === 'accountSettings' ? '#1E5DAA' : '#A0AEC0', cursor: 'pointer', textUnderlineOffset: '10px', textDecoration: activeTab === 'accountSettings' ? 'underline' : 'none' }} onClick={() => setActiveTab('accountSettings')}>Account Settings</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: activeTab === 'privacySecurity' ? '#1E5DAA' : '#A0AEC0', cursor: 'pointer', textUnderlineOffset: '10px', textDecoration: activeTab === 'privacySecurity' ? 'underline' : 'none' }} onClick={() => setActiveTab('privacySecurity')}>Privacy and Security</p>
        </div>
      </span>
      <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '4px' }} />
      {
        activeTab === 'accountInfo' ? (
          <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem', flexWrap: 'wrap', display: 'flex', columnGap: '1rem', paddingTop: '1rem' }}>
            <div style={{ backgroundColor: 'white', width: '45%', height: 'fit-content', borderRadius: '0.5rem', padding: '2rem', display: 'flex', flexDirection: 'column', rowGap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0b1f3a', width: '100%', display:'flex', justifyContent: 'space-between' }}>
                <p>
                  Recruiter Contact Info
                </p>
                <button style={{
                  backgroundColor: 'white',
                  color: '#1e3a8a',
                  padding: '0.25rem 0.75rem',
                  border: '1px solid #1e3a8a',
                  cursor: 'pointer',
                  borderRadius: '0.375rem',
                }} >
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
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#4A5568', marginBottom: '0.25rem' }}>Role/Title</label>
                <input value={recruiterRole} style={{ border: '1px solid #E2E8F0', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', width: '100%' }} />
              </div>
            </div>
            <div style={{ backgroundColor: 'white', width: '45%', height: 'fit-content', borderRadius: '0.5rem', padding: '2rem', display: 'flex', flexDirection: 'column', rowGap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0b1f3a', width: '100%', display:'flex', justifyContent: 'space-between' }}>
                <p>
                  Company Profile
                </p>
                <button style={{
                  backgroundColor: 'white',
                  color: '#1e3a8a',
                  padding: '0.25rem 0.75rem',
                  border: '1px solid #1e3a8a',
                  cursor: 'pointer',
                  borderRadius: '0.375rem',
                }} >
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
            <div style={{ backgroundColor: 'white', width: '45%', height: 'fit-content', borderRadius: '0.5rem', padding: '2rem', display: 'flex', flexDirection: 'column', rowGap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0b1f3a', width: '100%', display:'flex', justifyContent: 'space-between' }}>
                <p>
                  Company Overview
                </p>
                <button style={{
                  backgroundColor: 'white',
                  color: '#1e3a8a',
                  padding: '0.25rem 0.75rem',
                  border: '1px solid #1e3a8a',
                  cursor: 'pointer',
                  borderRadius: '0.375rem',
                }} >
                  Edit
                </button>
              </span>
                <input value={companyOverview} style={{ border: '1px solid #E2E8F0', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', width: '100%' }} />
            </div>
            <div style={{ backgroundColor: 'white', width: '45%', marginTop:10,  height: 'fit-content', borderRadius: '0.5rem', padding: '2rem', display: 'flex', flexDirection: 'column', rowGap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0b1f3a', width: '100%', display:'flex', justifyContent: 'space-between' }}>
                <p>
                  Primary Hiring Needs
                </p>
                <button style={{
                  backgroundColor: 'white',
                  color: '#1e3a8a',
                  padding: '0.25rem 0.75rem',
                  border: '1px solid #1e3a8a',
                  cursor: 'pointer',
                  borderRadius: '0.375rem',
                }} >
                  Edit
                </button>
              </span>
              <div style={{ display: 'flex', gap: 8, width: '100%', flexWrap: 'wrap' }}>
                {displayedNeeds.map((need: string, index: number) => (
                  <div key={need + '-' + index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ border: '1px solid #E2E8F0', borderRadius: '0.775rem', backgroundColor:'#ddeeff', color:'#2b5881', padding: '0.25rem 2rem 0.25rem 0.5rem', width: 'fit-content', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{need}</span>
                      <button type="button" onClick={() => {
                        // If the need exists in primary list, mark it removed. Otherwise remove from localAdds.
                        if (memoPrimaryHiringNeeds.includes(need)) {
                          setRemovedNeeds(prev => prev.includes(need) ? prev : [need, ...prev]);
                        } else {
                          setLocalAdds(prev => prev.filter(x => x !== need));
                        }
                      }} aria-label={`Remove ${need}`} style={{ background: 'transparent', border: 'none', color: '#ff5f1f', cursor: 'pointer', fontSize: 14, paddingLeft: 8 }}>×</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{width: '100%', display:'flex', justifyContent:'space-between', marginTop: '1rem'}}>
                <input placeholder="Add a hiring need" value={newHiringNeed} onChange={e => setNewHiringNeed(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); const v = newHiringNeed.trim(); if (v) { setLocalAdds(prev => [v, ...prev]); setNewHiringNeed(''); } } }} style={{ border: '1px solid #E2E8F0', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', width: '80%' }} />
                <button type="button" onClick={() => { const v = newHiringNeed.trim(); if (!v) return; setLocalAdds(prev => [v, ...prev]); setNewHiringNeed(''); }} style={{
                  backgroundColor: '#1d5ae8',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  border: '1px solid #1e3a8a',
                  cursor: 'pointer',
                  borderRadius: '0.375rem',
                }} >
                  Add
                </button>
              </div>
            </div>
            <div style={{ backgroundColor: 'white', width: '45%', height: 'fit-content', marginTop: 20, borderRadius: '0.5rem', padding: '2rem', display: 'flex', flexDirection: 'column', rowGap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0b1f3a', width: '100%', display:'flex', justifyContent: 'space-between' }}>
                <p>
                  Opportunities and Benefits
                </p>
                <button style={{
                  backgroundColor: 'white',
                  color: '#1e3a8a',
                  padding: '0.25rem 0.75rem',
                  border: '1px solid #1e3a8a',
                  cursor: 'pointer',
                  borderRadius: '0.375rem',
                }} >
                  Edit
                </button>
              </span>
                <input value={opportunitiesAndBenefits} style={{ border: '1px solid #E2E8F0', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', width: '100%' }} />
            </div>
             <div style={{ backgroundColor: 'white', width: '45%', marginTop: 20, height: 'fit-content', borderRadius: '0.5rem', padding: '2rem', display: 'flex', flexDirection: 'column', rowGap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0b1f3a', width: '100%', display:'flex', justifyContent: 'space-between' }}>
                <p>
                  Company Links
                </p>
                <button style={{
                  backgroundColor: 'white',
                  color: '#1e3a8a',
                  padding: '0.25rem 0.75rem',
                  border: '1px solid #1e3a8a',
                  cursor: 'pointer',
                  borderRadius: '0.375rem',
                }} >
                  Edit
                </button>
              </span>
                <input value={opportunitiesAndBenefits} style={{ border: '1px solid #E2E8F0', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', width: '100%' }} />
            </div>
          </div>
        ) : activeTab === 'accountSettings' ? (
          <div>

          </div>
        ):
        (
          <div>
            </div>
        )
       
      }
    </div>
  );
}

export default EmployerDashboard;