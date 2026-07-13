"use client"

import { X, MapPin, Briefcase, Calendar, DollarSign } from 'lucide-react';

interface Job {
  // support both server _id and client id
  _id?: string;
  id?: string;
  employerId?: string;
  title?: string;
  department?: string;
  location?: string;
  status?: string; // OPEN/CLOSED/DRAFT
  description?: string;
  requirements?: string;
  employmentType?: string;
  salary?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  skills?: string[];
  createdAt?: string;
  updatedAt?: string;
}

import React, { useEffect, useRef, useState } from 'react';
import useApplyForJob from '../../../hooks/useApplyForJob';
import useApplicationAIMatch from '../../../hooks/useApplicationAIMatch';
import { useUser } from '@/contexts/userContext/userContext';
import Link from 'next/link';

interface JobDetailDrawerProps {
  job: Job | null;
  onClose: () => void;
}

export function JobDetailDrawer({ job, onClose }: JobDetailDrawerProps) {
  const { state } = useUser();
  // Note: we can't call hooks conditionally; we'll use a simple window.location fallback for now.
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(!!job);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [coverType, setCoverType] = useState<'file' | 'text'>('file');
  const [coverText, setCoverText] = useState<string>('');
  const { apply, loading: applying, error: applyError } = useApplyForJob();
  const { runMatch, loading: aiLoading, data: aiData, error: aiError } = useApplicationAIMatch();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const candidateSkills = Array.isArray(state.user?.profile?.skills)
    ? state.user?.profile?.skills
        .map((skill) => String(skill).trim())
        .filter(Boolean)
    : typeof state.user?.profile?.skills === 'string'
      ? String(state.user.profile.skills)
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean)
      : [];

  const jobSkills = Array.isArray(job?.skills)
    ? job.skills.map((skill) => String(skill).trim()).filter(Boolean)
    : [];

  const matchedSkills = jobSkills.filter((skill) =>
    candidateSkills.some((candidateSkill) => candidateSkill.toLowerCase() === skill.toLowerCase())
  );

  const missingSkills = jobSkills.filter((skill) =>
    !candidateSkills.some((candidateSkill) => candidateSkill.toLowerCase() === skill.toLowerCase())
  );

  const matchScore = jobSkills.length > 0
    ? Math.round((matchedSkills.length / jobSkills.length) * 100)
    : 0;

  // Submission logic separated from UI
  async function onSubmit() {
    setSuccessMessage(null);
    setCoverError(null);
    if (!job) {
      setCoverError('Missing job id');
      return;
    }

    const jobId = String(job._id ?? job.id ?? '');
    if (!jobId) {
      setCoverError('Missing job id');
      return;
    }

    try {
      if (coverType === 'file') {
        if (!coverFile) {
          setCoverError('Please upload a PDF cover letter');
          return;
        }
        await apply({ jobId, file: coverFile });
      } else {
        if (!coverText.trim()) {
          setCoverError('Please write a cover letter');
          return;
        }
        await apply({ jobId, coverLetter: coverText.trim() });
      }

      setSuccessMessage('Application submitted successfully');
      setCoverFile(null);
      setCoverText('');
    } catch (err) {
      // Hook exposes error via applyError; additional handling can be added here if desired
      console.error('Apply error', err);
    }
  }

  // When job changes, show the drawer
  useEffect(() => {
    if (job) {
      // Defer setting shouldRender to avoid synchronous state update warnings
      setTimeout(() => setShouldRender(true), 0);
      setTimeout(() => setVisible(true), 10); // allow mount before animating in
    } else {
      // Defer visibility change to avoid synchronous setState in effect
      setTimeout(() => setVisible(false), 0);
      // Wait for animation to finish before unmounting
      setTimeout(() => setShouldRender(false), 300);
    }
    console.log(job)
  }, [job]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 350);
  }

  if (!shouldRender || !job) return null;

  const department = job.department ?? 'General';
  const isNew = job.status === 'OPEN';
  const salaryDisplay = job.salary ?? ((job.salaryMin || job.salaryMax) ? `$${job.salaryMin ?? 0} - $${job.salaryMax ?? 0} ${job.currency ?? ''}`.trim() : undefined);
  const posted = job.createdAt ?? job.updatedAt;

  // prettify employment type enums like FULL_TIME -> "Full time"
  const formatEmploymentType = (raw?: string): string | undefined => {
    if (!raw) return undefined;
    const map: Record<string, string> = {
      FULL_TIME: 'Full time',
      PART_TIME: 'Part time',
      CONTRACT: 'Contract',
      INTERNSHIP: 'Internship',
      TEMPORARY: 'Temporary',
      REMOTE: 'Remote',
    };
    const key = String(raw).toUpperCase();
    if (map[key]) return map[key];
    // fallback: convert snake_case or kebab-case or uppercase words into Title Case
    return String(raw)
      .toLowerCase()
      .replace(/[_-]+/g, ' ')
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <div
      ref={drawerRef}
      className={`hide-scrollbar ${visible ? 'animate-slideMenu' : 'close-slideMenu'}`}
      style={{
        width: '100%',
        maxWidth: '40rem',
        background: 'linear-gradient(180deg, #ffffff 0%, #fffdfb 100%)',
        height: '83vh',
        overflowY: 'auto',
        boxShadow: '0 24px 50px rgba(15,23,42,0.10)',
        borderRadius: 24,
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'relative',
        transition: 'box-shadow 0.2s, transform 0.2s',
        display: 'block',
        animationDuration: '0.4s',
        animationFillMode: 'forwards',
        border: '1px solid rgba(229,231,235,0.9)',
      }}
    >
      <div style={{ position: 'sticky', top: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 100%)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(229,231,235,0.9)', padding: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, zIndex: 10, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
        <div style={{ display: 'grid', gap: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', width: 'fit-content', background: 'rgba(37,99,235,0.10)', color: '#2563EB', padding: '6px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Job details
          </span>
          <span style={{fontSize: 'clamp(1.75rem, 3vw, 2.15rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#0F172A'}}>{job.title}</span>
        </div>
        <button
          onClick={handleClose}
          style={{ padding: 10, borderRadius: 9999, transition: 'background 0.2s, transform 0.2s', background: '#F8FAFC', border: '1px solid #E2E8F0' }}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div style={{ padding: 24 }}>
        {isNew && (
          <span style={{ display: 'inline-block', background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)', color: '#fff', padding: '8px 16px', borderRadius: 9999, fontSize: '0.875rem', marginBottom: 16, boxShadow: '0 10px 20px rgba(59,130,246,0.16)' }}>
            New Posting
          </span>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0' }}>
            <Briefcase className="w-5 h-5 text-[#2563EB]" />
            <div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Department</div>
              <div style={{ fontWeight: 600, color: '#0F172A' }}>{department}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0' }}>
            <MapPin className="w-5 h-5 text-[#2563EB]" />
            <div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Location</div>
              <div style={{ fontWeight: 600, color: '#0F172A' }}>{job.location}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0' }}>
            <DollarSign className="w-5 h-5 text-[#2563EB]" />
            <div>
              <div className="text-xs text-gray-500">Salary Range</div>
              <div style={{ fontWeight: 600, color: '#0F172A' }}>{salaryDisplay ?? '$0 - $0'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0' }}>
            <Calendar className="w-5 h-5 text-[#2563EB]" />
            <div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Posted</div>
              <div style={{ fontWeight: 600, color: '#0F172A' }}>{posted ? new Date(posted).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) : 'Unknown'}</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24, padding: 20, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.04)' }}>
          <h3 style={{ marginBottom: 14, fontSize: 18, fontWeight: 700, color: '#0F172A' }}>Job Description</h3>
          <p style={{ color: '#374151', lineHeight: 1.75, marginBottom: 0 }}>{job.description}</p>
        </div>

        {job.requirements && (
          <div style={{ marginBottom: 24, padding: 20, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20 }}>
            <h3 style={{ marginBottom: 14, fontSize: 18, fontWeight: 700, color: '#0F172A' }}>Requirements</h3>
            <p style={{ color: '#374151', lineHeight: 1.7, marginBottom: 0 }}>{job.requirements}</p>
          </div>
        )}

        {Array.isArray(job.skills) && job.skills.length > 0 && (
          <div style={{ marginBottom: 24, padding: 20, background: 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%)', border: '1px solid #E2E8F0', borderRadius: 20 }}>
            <h3 style={{ marginBottom: 12, fontSize: 18, fontWeight: 700, color: '#0F172A' }}>Skills</h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {job.skills.map((s, idx) => (
                <span key={idx} style={{ background: '#EEF6FF', padding: '8px 12px', borderRadius: 9999, color: '#1D4ED8', fontSize: 12, fontWeight: 600, border: '1px solid #DBEAFE' }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 24, padding: 20, background: '#F8FAFC', borderRadius: 20, border: '1px solid #E2E8F0' }}>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: '#0F172A' }}>Meta</h3>
          <div style={{ color: '#374151', display: 'grid', gap: 8 }}>
            <div><strong>Employment Type:</strong> {job.employmentType ? formatEmploymentType(job.employmentType) : 'N/A'}</div>
            <div><strong>Status:</strong> {job.status ?? 'N/A'}</div>
          </div>
        </div>


        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>

          {state.user?.accountType === "TALENT" && (
            <>
              <div style={{ marginBottom: 12 }}>
                <h4 style={{ margin: 0, marginBottom: 8 }}>Cover Letter</h4>

                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <button
                    type="button"
                    onClick={() => { setCoverType('file'); setCoverText(''); setCoverError(null); }}
                    style={{ padding: '8px 12px', borderRadius: 8, border: coverType === 'file' ? '2px solid #2563EB' : '1px solid #E5E7EB', background: coverType === 'file' ? '#EEF6FF' : '#fff' }}
                  >
                    Upload PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCoverType('text'); setCoverFile(null); setCoverError(null); }}
                    style={{ padding: '8px 12px', borderRadius: 8, border: coverType === 'text' ? '2px solid #2563EB' : '1px solid #E5E7EB', background: coverType === 'text' ? '#EEF6FF' : '#fff' }}
                  >
                    Write cover letter
                  </button>
                </div>

                {coverType === 'file' && (
                  <div>
                    <input
                      id="cover-letter-upload"
                      type="file"
                      accept="application/pdf"
                      style={{ display: 'none'}}
                      onChange={(e) => {
                        const f = (e.target as HTMLInputElement).files?.[0] ?? null;
                        if (!f) {
                          setCoverFile(null);
                          setCoverError(null);
                          return;
                        }
                        // basic PDF validation
                        const isPdf = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
                        if (!isPdf) {
                          setCoverFile(null);
                          setCoverError('Please upload a PDF file');
                          (e.target as HTMLInputElement).value = '';
                          return;
                        }
                        setCoverFile(f);
                        setCoverError(null);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('cover-letter-upload')?.click()}
                      style={{ padding: '10px 16px', borderRadius: 8, border: '1px dashed #CBD5E1', background: '#fff',  cursor: 'pointer' }}
                    >
                      {coverFile ? 'Replace cover letter' : 'Upload cover letter (PDF)'}
                    </button>
                    {coverFile && <div style={{ marginTop: 8 }}>{coverFile.name}</div>}
                    {coverError && <div style={{ color: '#fecaca', marginTop: 8 }}>{coverError}</div>}
                  </div>
                )}

                {coverType === 'text' && (
                  <div>
                    <textarea
                      value={coverText}
                      onChange={(e) => { setCoverText(e.target.value); if (e.target.value.trim().length > 0) setCoverError(null); }}
                      placeholder="Write your cover letter here..."
                      rows={8}
                      style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #E5E7EB', resize: 'vertical' }}
                    />
                    <div style={{ fontSize: 12, color: '#6B7280', marginTop: 6 }}>You can paste plain text; we will send it as part of your application.</div>
                    {coverError && <div style={{ color: '#fecaca', marginTop: 8 }}>{coverError}</div>}
                  </div>
                )}
              </div>
              <button
                disabled={applying || !(coverType === 'file' ? !!coverFile : coverText.trim().length > 0)}
                style={{
                  width: '100%',
                  background: (coverType === 'file' ? !!coverFile : coverText.trim().length > 0) ? '#2563EB' : '#93C5FD',
                  color: '#fff',
                  padding: '16px 24px',
                  borderRadius: 12,
                  transition: 'background 0.2s',
                  cursor: applying ? 'wait' : (coverType === 'file' ? !!coverFile : coverText.trim().length > 0) ? 'pointer' : 'not-allowed',
                  border: 'none',
                  opacity: (coverType === 'file' ? !!coverFile : coverText.trim().length > 0) ? 1 : 0.7,
                }}
                onClick={onSubmit}
              >
                {applying ? 'Applying...' : 'Apply for This Position'}
              </button>
              {/* "new ai check" */}
              {/* "new ai check" */}
            </>
          )}
          {!state.user && (
            <div style={{ marginTop: 12 }}>
              {/* When not logged in, offer to go to login. Temporarry function below logs out and redirects. */}
              <button
                onClick={() => {
                  // Temporarry function: clear client-side auth/local storage and redirect to /login
                  // NOTE: Replace this with real auth sign-out once auth context is available.
                  try {
                    // Example cleanup: remove token/local state used by the app
                    localStorage.removeItem('auth_token')
                    localStorage.removeItem('user')
                  } catch (e) {
                    // ignore (server environments won't have localStorage)
                  }
                  // Navigate to login page
                  if (typeof window !== 'undefined') window.location.href = '/login'
                }}
                style={{ marginTop: 8, padding: '10px 12px', borderRadius: 8, background: '#fff', border: '1px solid #E2E8F0', cursor: 'pointer' }}
              >
                Go to login page
              </button>
            </div>
          )}
            {applyError && <div style={{ color: '#fecaca', marginTop: 8 }}>{applyError}</div>}
            {successMessage && <div style={{ color: '#16A34A', marginTop: 8 }}>{successMessage}</div>}
            
            {/* Link to employer candidate overview for this job (includes jobId query param) */}
            {job && state.user?.accountType !== 'TALENT' && (
              <div style={{ marginTop: 12 }}>
                <Link
                  href={`/candidate-overview?jobId=${encodeURIComponent(String(job._id ?? job.id ?? ''))}`}
                  style={{ color: '#2563EB', textDecoration: 'underline', fontWeight: 600 }}
                >
                  View applicants for this job
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
