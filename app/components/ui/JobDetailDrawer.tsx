import { X, MapPin, Briefcase, Calendar, DollarSign } from 'lucide-react';

interface Job {
  // support both server _id and client id
  _id?: string;
  id?: number | string;
  employerId?: string;
  title?: string;
  department?: string;
  location?: string;
  status?: string; // OPEN/CLOSED
  description?: string;
  fullDescription?: string;
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

interface JobDetailDrawerProps {
  job: Job | null;
  onClose: () => void;
}

export function JobDetailDrawer({ job, onClose }: JobDetailDrawerProps) {
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(!!job);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [coverType, setCoverType] = useState<'file' | 'text'>('file');
  const [coverText, setCoverText] = useState<string>('');
  const { apply, loading: applying, error: applyError } = useApplyForJob();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
        background: '#fff',
        height: '83vh',
        overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        borderRadius: 16,
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'relative',
        transition: 'box-shadow 0.2s',
        display: 'block',
        animationDuration: '0.4s',
        animationFillMode: 'forwards',
      }}
    >
      <div style={{ position: 'sticky', top: 0, background: '#fff', borderBottom: '1px solid #E5E7EB', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
        <span style={{fontSize: '30px', fontWeight: 'bold'}}>{job.title}</span>
        <button
          onClick={handleClose}
          style={{ padding: 8, borderRadius: 8, transition: 'background 0.2s' }}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div style={{ padding: 24 }}>
        {isNew && (
          <span style={{ display: 'inline-block', background: '#FF5F1F', color: '#fff', padding: '8px 16px', borderRadius: 9999, fontSize: '0.875rem', marginBottom: 16 }}>
            New Posting
          </span>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: '#F4F4F9', borderRadius: 12 }}>
            <Briefcase className="w-5 h-5 text-[#FF5F1F]" />
            <div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Department</div>
              <div>{department}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: '#F4F4F9', borderRadius: 12 }}>
            <MapPin className="w-5 h-5 text-[#FF5F1F]" />
            <div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Location</div>
              <div>{job.location}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: '#F4F4F9', borderRadius: 12 }}>
            <DollarSign className="w-5 h-5 text-[#FF5F1F]" />
            <div>
              <div className="text-xs text-gray-500">Salary Range</div>
              <div>{salaryDisplay ?? '$0 - $0'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: '#F4F4F9', borderRadius: 12 }}>
            <Calendar className="w-5 h-5 text-[#FF5F1F]" />
            <div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Posted</div>
              <div>{posted ? new Date(posted).toLocaleString() : 'Unknown'}</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Job Description</h3>
          <p style={{ color: '#374151', lineHeight: 1.6, marginBottom: 16 }}>{job.description}</p>
        </div>

        {job.requirements && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Requirements</h3>
            <p style={{ color: '#374151' }}>{job.requirements}</p>
          </div>
        )}

        {Array.isArray(job.skills) && job.skills.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 12 }}>Skills</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {job.skills.map((s, idx) => (
                <span key={idx} style={{ background: '#F1F5F9', padding: '6px 10px', borderRadius: 8, color: '#1F2937', fontSize: 12 }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 8 }}>Meta</h3>
          <div style={{ color: '#374151' }}>
            <div><strong>Employment Type:</strong> {job.employmentType ? formatEmploymentType(job.employmentType) : 'N/A'}</div>
            <div><strong>Status:</strong> {job.status ?? 'N/A'}</div>
          </div>
        </div>


        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 12 }}>
              <h4 style={{ margin: 0, marginBottom: 8 }}>Cover Letter</h4>

              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button
                  type="button"
                  onClick={() => { setCoverType('file'); setCoverText(''); setCoverError(null); }}
                  style={{ padding: '8px 12px', borderRadius: 8, border: coverType === 'file' ? '2px solid #FF5F1F' : '1px solid #E5E7EB', background: coverType === 'file' ? '#FFF7F5' : '#fff' }}
                >
                  Upload PDF
                </button>
                <button
                  type="button"
                  onClick={() => { setCoverType('text'); setCoverFile(null); setCoverError(null); }}
                  style={{ padding: '8px 12px', borderRadius: 8, border: coverType === 'text' ? '2px solid #FF5F1F' : '1px solid #E5E7EB', background: coverType === 'text' ? '#FFF7F5' : '#fff' }}
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
                background: (coverType === 'file' ? !!coverFile : coverText.trim().length > 0) ? '#FF5F1F' : '#FFB4A4',
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
            {applyError && <div style={{ color: '#fecaca', marginTop: 8 }}>{applyError}</div>}
            {successMessage && <div style={{ color: '#16A34A', marginTop: 8 }}>{successMessage}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
