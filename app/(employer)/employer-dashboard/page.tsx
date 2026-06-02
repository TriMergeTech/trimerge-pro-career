"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, BriefcaseBusiness, Building2, LayoutDashboard, Settings2, Sparkles, Users } from 'lucide-react';
import { useUser } from '@/contexts/userContext/userContext';
import useGetEmployer from '@/hooks/useGetEmployer';
import { useGetJobs } from '@/hooks/useGetJobs';
import CandidateOverviewClient from '../candidate-overview/CandidateOverviewClient';

type Tab = 'overview' | 'jobs' | 'applications' | 'company';
type JobRecord = {
  id?: number | string;
  _id?: string;
  title?: string;
  department?: string;
  location?: string;
  status?: string;
  description?: string;
  employerId?: string;
};

const tabMeta: Array<{ id: Tab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'jobs', label: 'Jobs', icon: BriefcaseBusiness },
  { id: 'applications', label: 'Applications', icon: Users },
  { id: 'company', label: 'Company', icon: Building2 },
];

export function EmployerDashboard() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as Tab | null) ?? 'overview';
  const initialJobId = searchParams.get('jobId') ?? '';

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const { state } = useUser();
  const { data: userData } = useGetEmployer();
  const { fetchJobs } = useGetJobs();
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const profile = (userData as Record<string, unknown> | null)?.['profile'] ?? {};
  const profileRecord = profile as Record<string, unknown>;
  const companyName = String(profileRecord['companyName'] ?? 'Your company');
  const companyWebsite = String(profileRecord['companyWebsite'] ?? 'Add website');
  const industry = String(profileRecord['industry'] ?? 'Industry');
  const companySize = String(profileRecord['companySize'] ?? 'N/A');
  const recruiterRole = String(profileRecord['yourRole'] ?? profileRecord['role'] ?? 'Recruiter');
  const companyOverview = String(profileRecord['companyOverview'] ?? 'Add a short overview so candidates know what your team does.');
  const benefits = String(profileRecord['benefitsAndOpportunities'] ?? 'Add benefits, perks, and what makes your company stand out.');

  const memoPrimaryHiringNeeds = useMemo(() => {
    const primaryHiringNeeds = profileRecord['primaryHiringNeeds'] ?? [];
    return Array.isArray(primaryHiringNeeds)
      ? primaryHiringNeeds.map(String)
      : primaryHiringNeeds ? [String(primaryHiringNeeds)] : [];
  }, [profileRecord]);

  useEffect(() => {
    let mounted = true;

    const loadJobs = async () => {
      const response = await fetchJobs({ page: 1, limit: 100 });
      if (!mounted) return;

      const payload = Array.isArray(response)
        ? response
        : Array.isArray((response as { data?: unknown[] } | null)?.data)
          ? (response as { data: JobRecord[] }).data
          : Array.isArray((response as { jobs?: unknown[] } | null)?.jobs)
            ? (response as { jobs: JobRecord[] }).jobs
            : Array.isArray((response as { items?: unknown[] } | null)?.items)
              ? (response as { items: JobRecord[] }).items
              : [];

      setJobs(payload as JobRecord[]);
      setLoadingJobs(false);
    };

    loadJobs();
    return () => { mounted = false; };
  }, [fetchJobs]);

  const employerJobs = useMemo(() => {
    const userId = String(state.user?.id ?? '');
    return jobs.filter((job) => {
      if (!userId) return true;
      if (job.employerId && String(job.employerId) !== userId) return false;
      return true;
    });
  }, [jobs, state.user?.id]);

  useEffect(() => {
    if (!selectedJobId && employerJobs.length > 0) {
      setSelectedJobId(String(employerJobs[0].id ?? employerJobs[0]._id ?? ''));
    }
  }, [employerJobs, selectedJobId]);

  const selectedJob = useMemo(() => {
    if (!selectedJobId) return employerJobs[0] ?? null;
    return employerJobs.find((job) => String(job.id ?? job._id ?? '') === selectedJobId) ?? employerJobs[0] ?? null;
  }, [employerJobs, selectedJobId]);

  const metrics = useMemo(() => ({
    totalJobs: employerJobs.length,
    openJobs: employerJobs.filter((job) => String(job.status ?? '').toUpperCase() === 'OPEN').length,
    draftJobs: employerJobs.filter((job) => String(job.status ?? '').toUpperCase() === 'DRAFT').length,
  }), [employerJobs]);

  return (
    <div style={{ minHeight: '90vh', background: 'linear-gradient(180deg, #f7faff 0%, #eef4fb 48%, #eaf1f9 100%)' }}>
      <div className="tp-container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="tp-card-soft tp-fade-up" style={{ marginBottom: '1rem', padding: '1.5rem', background: 'linear-gradient(135deg, #07172e 0%, #1d4ed8 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 'auto -5rem -5rem auto', width: '16rem', height: '16rem', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', filter: 'blur(32px)' }} />
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ maxWidth: '42rem' }}>
              <div className="tp-chip" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', borderColor: 'rgba(255,255,255,0.14)' }}>
                Employer dashboard
              </div>
              <h1 style={{ margin: '0.85rem 0 0.45rem', fontSize: 'clamp(2rem, 4vw, 3.1rem)', letterSpacing: '-0.05em' }}>
                Manage jobs, applications, and company identity in one place.
              </h1>
              <p style={{ margin: 0, maxWidth: '44rem', color: 'rgba(255,255,255,0.84)', lineHeight: 1.75 }}>
                This is the unified employer surface: profile settings, live postings, and applicant review stay in the same workflow so you do not bounce between disconnected screens.
              </p>
            </div>
            <div style={{ display: 'grid', gap: '0.65rem', minWidth: '16rem' }}>
              <div style={{ padding: '0.95rem 1rem', borderRadius: '18px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.68)' }}>Active jobs</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{metrics.openJobs}</div>
              </div>
              <div style={{ padding: '0.95rem 1rem', borderRadius: '18px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.68)' }}>Total postings</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{metrics.totalJobs}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="tp-card" style={{ padding: '0.65rem', marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', background: 'rgba(255,255,255,0.86)' }}>
          {tabMeta.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.8rem 1rem',
                  borderRadius: '14px',
                  border: '1px solid transparent',
                  background: isActive ? 'linear-gradient(135deg, #07172e 0%, #1d4ed8 100%)' : 'transparent',
                  color: isActive ? 'white' : '#475569',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Open jobs', value: metrics.openJobs, tone: '#1d4ed8' },
                { label: 'Draft jobs', value: metrics.draftJobs, tone: '#FF5F1F' },
                { label: 'Company profile fields', value: 6, tone: '#0f172a' },
              ].map((item) => (
                <div key={item.label} className="tp-card-soft" style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--tp-muted)', marginBottom: '0.45rem' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '2.2rem', lineHeight: 1, fontWeight: 800, color: item.tone }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))', gap: '1rem' }}>
              <div className="tp-card-soft" style={{ padding: '1.25rem' }}>
                <div className="tp-kicker">Quick actions</div>
                <h2 style={{ margin: '0.35rem 0 0', fontSize: '1.5rem', letterSpacing: '-0.04em' }}>Keep the employer workflow together.</h2>
                <div style={{ display: 'grid', gap: '0.8rem', marginTop: '1rem' }}>
                  <Link href="/browse-jobs" className="tp-btn-secondary">
                    Review public listings
                  </Link>
                  <button type="button" onClick={() => setActiveTab('applications')} className="tp-btn-primary">
                    Review applications
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <div className="tp-card-soft" style={{ padding: '1.25rem' }}>
                <div className="tp-kicker">Identity</div>
                <h2 style={{ margin: '0.35rem 0 0', fontSize: '1.5rem', letterSpacing: '-0.04em' }}>{companyName}</h2>
                <p className="tp-lead" style={{ marginTop: '0.7rem' }}>{companyOverview}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="tp-card-soft" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div className="tp-kicker">Your jobs</div>
                <h2 style={{ margin: '0.35rem 0 0', fontSize: '1.8rem', letterSpacing: '-0.04em' }}>Posted jobs and their application entry point.</h2>
              </div>
              <Link href="/browse-jobs" className="tp-btn-primary">
                Create or review jobs
              </Link>
            </div>

            {loadingJobs ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--tp-muted)' }}>Loading jobs...</div>
            ) : employerJobs.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--tp-muted)' }}>No employer jobs found yet.</div>
            ) : (
              <div style={{ display: 'grid', gap: '0.85rem' }}>
                {employerJobs.map((job, index) => {
                  const jobId = String(job.id ?? job._id ?? `${index}`);
                  return (
                    <div key={jobId} className="tp-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--tp-ink)' }}>{job.title ?? 'Untitled job'}</div>
                        <div style={{ color: 'var(--tp-muted)', marginTop: '0.35rem' }}>{job.department ?? 'General'} · {job.location ?? 'Remote'}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedJobId(jobId);
                          setActiveTab('applications');
                        }}
                        className="tp-btn-secondary"
                      >
                        View applications
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'applications' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(18rem, 24rem) 1fr', gap: '1rem', alignItems: 'start' }}>
            <div className="tp-card-soft" style={{ padding: '1.25rem', position: 'sticky', top: '1rem' }}>
              <div className="tp-kicker">Pick a job</div>
              <h2 style={{ margin: '0.35rem 0 0', fontSize: '1.5rem', letterSpacing: '-0.04em' }}>Choose the posting you want to review.</h2>
              <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
                {employerJobs.length === 0 ? (
                  <div style={{ color: 'var(--tp-muted)' }}>No jobs available yet.</div>
                ) : employerJobs.map((job, index) => {
                  const jobId = String(job.id ?? job._id ?? `${index}`);
                  const isActive = selectedJobId ? selectedJobId === jobId : index === 0;
                  return (
                    <button
                      key={jobId}
                      type="button"
                      onClick={() => setSelectedJobId(jobId)}
                      style={{
                        textAlign: 'left',
                        padding: '0.95rem 1rem',
                        borderRadius: '16px',
                        border: isActive ? '1px solid rgba(29,78,216,0.25)' : '1px solid rgba(148,163,184,0.16)',
                        background: isActive ? 'linear-gradient(135deg, rgba(29,78,216,0.08), rgba(255,255,255,0.95))' : 'white',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{job.title ?? 'Untitled job'}</div>
                      <div style={{ marginTop: '0.35rem', color: 'var(--tp-muted)', fontSize: '0.92rem' }}>{job.department ?? 'General'} · {job.location ?? 'Remote'}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              {selectedJob ? (
                <CandidateOverviewClient jobId={String(selectedJob.id ?? selectedJob._id ?? '')} />
              ) : (
                <div className="tp-card-soft" style={{ padding: '2rem' }}>
                  <div className="tp-kicker">Applications</div>
                  <h2 style={{ margin: '0.35rem 0 0', fontSize: '1.8rem', letterSpacing: '-0.04em' }}>No posting selected yet.</h2>
                  <p className="tp-lead" style={{ marginTop: '0.75rem' }}>Select a job on the left to load the applicant dashboard inline.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'company' && (
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))' }}>
            <div className="tp-card-soft" style={{ padding: '1.25rem' }}>
              <div className="tp-kicker">Profile</div>
              <h2 style={{ margin: '0.35rem 0 0', fontSize: '1.55rem', letterSpacing: '-0.04em' }}>{companyName}</h2>
              <div style={{ display: 'grid', gap: '0.8rem', marginTop: '1rem' }}>
                {[
                  { label: 'Full name', value: `${state.user?.profile?.firstName ?? ''} ${state.user?.profile?.lastName ?? ''}`.trim() || 'Unknown' },
                  { label: 'Email', value: state.user?.email ?? 'Unknown' },
                  { label: 'Role/title', value: recruiterRole },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'grid', gap: '0.35rem' }}>
                    <span style={{ color: 'var(--tp-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{item.label}</span>
                    <div style={{ padding: '0.85rem 0.95rem', borderRadius: '14px', background: '#f8fafc', border: '1px solid rgba(148,163,184,0.15)' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tp-card-soft" style={{ padding: '1.25rem' }}>
              <div className="tp-kicker">Company details</div>
              <div style={{ display: 'grid', gap: '0.8rem', marginTop: '1rem' }}>
                {[
                  { label: 'Website', value: companyWebsite },
                  { label: 'Industry', value: industry },
                  { label: 'Size', value: `${companySize} people` },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'grid', gap: '0.35rem' }}>
                    <span style={{ color: 'var(--tp-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{item.label}</span>
                    <div style={{ padding: '0.85rem 0.95rem', borderRadius: '14px', background: '#f8fafc', border: '1px solid rgba(148,163,184,0.15)' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tp-card-soft" style={{ padding: '1.25rem' }}>
              <div className="tp-kicker">Hiring focus</div>
              <p className="tp-lead" style={{ marginTop: '0.75rem' }}>{companyOverview}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                {memoPrimaryHiringNeeds.length > 0 ? memoPrimaryHiringNeeds.map((need) => (
                  <span key={need} className="tp-chip" style={{ background: '#dbeafe' }}>{need}</span>
                )) : (
                  <span className="tp-chip" style={{ background: '#f8fafc' }}>No hiring needs added yet</span>
                )}
              </div>
              <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '16px', background: 'rgba(29,78,216,0.06)' }}>
                {benefits}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployerDashboard;