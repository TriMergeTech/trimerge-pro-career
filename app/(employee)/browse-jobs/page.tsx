"use client"


import React, { useState, useEffect } from 'react';
import { JobCard } from '@/app/components/ui/JobCard';
import { JobDetailDrawer } from '@/app/components/ui/JobDetailDrawer';
import { Tag } from 'lucide-react';
import { useGetJobs } from '@/hooks/useGetJobs';
import { useCreateJob } from '@/hooks/useCreateJob';
import { useUser } from '@/contexts/userContext/userContext';

function BrowseJobs() {
  const {state} = useUser()



  // Job shape coming from the API - using the fields you specified
  interface Job {
    id: number | string;
    title: string;
    description: string;
    requirements?: string;
    location?: string;
    employmentType?: string;
    salaryMin?: number;
    salaryMax?: number;
    currency?: string;
    skills?: string[];
    status?: string;
    // department will be shown with a default for now
    department?: string;
    // Optional display fields used by the detail drawer
    isNew?: boolean;
    salary?: string;
    postedDate?: string;
    fullDescription?: string;
  }

  // Type for the detail drawer (subset/overlap of API job)
  type DrawerJob = {
    _id?: string;
    id?: number | string;
    employerId?: string;
    title?: string;
    department?: string;
    location?: string;
    status?: string;
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
  };

  type RankedJob = Job & {
    matchScore?: number;
    isTopMatch?: boolean;
  };

  const extractCandidateSkills = (profile: unknown): string[] => {
    if (!profile || typeof profile !== 'object') return [];
    const record = profile as Record<string, unknown>;
    const rawSkills = record.skills ?? record.skillset ?? record.stack;

    if (Array.isArray(rawSkills)) {
      return rawSkills
        .map((skill) => String(skill).trim())
        .filter(Boolean);
    }

    if (typeof rawSkills === 'string') {
      return rawSkills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    return [];
  };

  const normalizeSkill = (value: string) => value.trim().toLowerCase();

  const calculateMatchScore = (job: Job, candidateSkills: string[]) => {
    const jobSkills = Array.isArray(job.skills) ? job.skills : [];
    if (candidateSkills.length === 0 || jobSkills.length === 0) return 0;

    const candidateSet = new Set(candidateSkills.map(normalizeSkill));
    const matchedSkills = jobSkills.filter((skill) => candidateSet.has(normalizeSkill(String(skill))));
    const uniqueJobSkills = new Set(jobSkills.map((skill) => normalizeSkill(String(skill))));

    if (uniqueJobSkills.size === 0) return 0;

    return Math.round((matchedSkills.length / uniqueJobSkills.size) * 100);
  };

  const [searchTerm, setSearchTerm] = useState('');
  // department/location filters reserved for later
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const { fetchJobs } = useGetJobs()

  const [jobs, setJobs] = useState<Job[] | null>(null)
  const [loadingJobs, setLoadingJobs] = useState(true)
  const { createJob, loading: creating, error: createError, setError: setCreateError } = useCreateJob()
  const [showCreateModal, setShowCreateModal] = useState(false)

  // form state for create job
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [locationInput, setLocationInput] = useState('')
  const [employmentType, setEmploymentType] = useState<'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | string>('FULL_TIME')
  const [salaryMin, setSalaryMin] = useState<string>('')
  const [salaryMax, setSalaryMax] = useState<string>('')
  const [currency, setCurrency] = useState('USD')
  const [departmentInput, setDepartmentInput] = useState('')
  // skillsInput removed; using managed skills array instead
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [showSkillInput, setShowSkillInput] = useState(false)
  const [statusInput, setStatusInput] = useState<'OPEN' | 'CLOSED' | 'DRAFT' | string>('OPEN')

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const res = await fetchJobs({ page: 1, limit: 50 })
      if (!mounted) return

      // Be defensive about response shape. Backend may return array directly
      // or an envelope like { data: [...] }, { jobs: [...] }, { items: [...] }
      try {
        if (!res) {
          setJobs([])
          return
        }

        let payload: unknown = null
        if (Array.isArray(res)) payload = res
        else if (Array.isArray((res as any).data)) payload = (res as any).data
        else if (Array.isArray((res as any).jobs)) payload = (res as any).jobs
        else if (Array.isArray((res as any).items)) payload = (res as any).items
        else if (Array.isArray((res as any).results)) payload = (res as any).results

        if (Array.isArray(payload)) {
          setJobs(payload as Job[])
        } else {
          const maybeArray = (res as any).data?.jobs ?? (res as any).data?.items ?? null
          if (Array.isArray(maybeArray)) setJobs(maybeArray as Job[])
          else setJobs([])
        }
      } finally {
        setLoadingJobs(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const closeCreateModal = () => {
    setShowCreateModal(false)
    // reset form
    setTitle('')
    setDescription('')
    setRequirements('')
    setLocationInput('')
  setDepartmentInput('')
    setEmploymentType('FULL_TIME')
    setSalaryMin('')
    setSalaryMax('')
    setCurrency('USD')
    setSkills([])
    setNewSkill('')
    setStatusInput('OPEN')
    setCreateError(null)
  }

  const addSkill = () => {
    const s = newSkill.trim();
    if (!s) return;
    if (skills.includes(s)) {
      setNewSkill('');
      setShowSkillInput(false);
      return;
    }
    // prepend so newest appears first
    setSkills(prev => [s, ...prev]);
    setNewSkill('');
    setShowSkillInput(false);
  }

  const removeSkill = (s: string) => {
    setSkills(prev => prev.filter(x => x !== s));
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  const skillsArray = skills.map(s => String(s).trim()).filter(Boolean)
    const payload = {
      title,
      description,
      department: departmentInput,
      requirements,
      location: locationInput,
      employmentType,
      salaryMin: typeof salaryMin === 'number' ? salaryMin : Number(salaryMin) || 0,
      salaryMax: typeof salaryMax === 'number' ? salaryMax : Number(salaryMax) || 0,
      currency,
      skills: skillsArray,
      status: statusInput,
    }

    const res = await createJob(payload)
    if (res) {
      // refresh jobs
      const refreshed = await fetchJobs({ page: 1, limit: 50 })
      const payloadJobs = refreshed?.data ?? refreshed?.jobs ?? refreshed?.items ?? refreshed
      if (Array.isArray(payloadJobs)) setJobs(payloadJobs as Job[])
      closeCreateModal()
    }
  }

  const categories = ['All', 'Engineering', 'Marketing', 'HR', 'Sales', 'Design', 'Operations'];

  const candidateSkills = extractCandidateSkills(state.user?.profile);

  const rankedJobs: RankedJob[] = (jobs ?? []).map((job) => ({
    ...job,
    matchScore: calculateMatchScore(job, candidateSkills),
  }));

  const filteredJobs = rankedJobs.filter((job) => {
    const matchesSearch = (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = true; // department filter not wired yet
    const matchesLocation = true; // location filter not wired yet
    const matchesCategory = activeCategory === 'All' || (job.department ?? 'General') === activeCategory;

    return matchesSearch && matchesDepartment && matchesLocation && matchesCategory;
  });

  const topMatchIndex = candidateSkills.length > 0
    ? filteredJobs.reduce<{ index: number; score: number }>((best, job, index) => {
        const score = job.matchScore ?? 0;
        if (index === 0 || score > best.score) return { index, score };
        return best;
      }, { index: -1, score: -1 }).index
    : -1;

  const displayedJobs = topMatchIndex > -1
    ? [filteredJobs[topMatchIndex], ...filteredJobs.filter((_, index) => index !== topMatchIndex)]
    : filteredJobs;

  const topMatch = displayedJobs[0];

  return (
    <div className="flex-1 overflow-hidden" style={{ background: 'linear-gradient(180deg, #f8fbff 0%, #f4f7fb 42%, #eef4fb 100%)', minHeight: '90vh' }}>
      <div className="tp-container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="tp-card-soft tp-fade-up" style={{ marginBottom: '1.25rem', padding: '1.5rem', background: 'linear-gradient(135deg, rgba(7,23,46,0.98) 0%, rgba(29,78,216,0.96) 100%)', color: 'white', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 'auto -5rem -5rem auto', width: '16rem', height: '16rem', borderRadius: '999px', background: 'rgba(255,255,255,0.07)', filter: 'blur(32px)' }} />
          <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ maxWidth: '42rem' }}>
              <div className="tp-chip" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', borderColor: 'rgba(255,255,255,0.14)' }}>Career marketplace</div>
              <h1 style={{ margin: '0.85rem 0 0.55rem', fontSize: 'clamp(2.25rem, 5vw, 3.4rem)', lineHeight: 1, letterSpacing: '-0.05em' }}>
                Find roles that match the way you actually work.
              </h1>
              <p style={{ margin: 0, maxWidth: '38rem', color: 'rgba(255,255,255,0.84)', lineHeight: 1.75 }}>
                Search openings, compare your best matches, and keep the job hunt focused on roles that fit your skills and location.
              </p>
            </div>
            <div style={{ display: 'grid', gap: '0.75rem', minWidth: '18rem' }}>
              <div style={{ padding: '0.95rem 1rem', borderRadius: '18px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.68)' }}>Matched jobs</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{filteredJobs.length}</div>
              </div>
              <div style={{ padding: '0.95rem 1rem', borderRadius: '18px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.68)' }}>Best match</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.5 }}>{topMatch ? topMatch.title : 'No match yet'}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', gap: 32, alignItems: 'flex-start', height: '80vh' }}>
        {/* Left: Job List */}
  <div style={{ flex: '0 0 52%', minWidth: 0, maxWidth: '52%' }}>
          {/* Simple Search Bar */}
          <div className="flex items-center gap-3" style={{ marginBottom: 24 }}>
            <div className="tp-card" style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: 18, border: '1px solid rgba(148,163,184,0.18)', padding: '0.65rem 1rem', width: '100%', boxShadow: '0 16px 40px -28px rgba(15,23,42,0.3)' }}>
              <svg style={{ width: 20, height: 20, color: '#94a3b8', marginRight: 8 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: 16,
                  color: '#0f172a',
                  padding: '0.5rem 0',
                }}
                onFocus={e => (e.currentTarget.parentElement!.style.boxShadow = '0 4px 16px rgba(59,130,246,0.15)')}
                onBlur={e => (e.currentTarget.parentElement!.style.boxShadow = '0 2px 8px rgba(30,41,59,0.07)')}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 overflow-x-hidden pb-2" style={{ marginBottom: 24, columnGap: 10, flexWrap: 'wrap' }}>
            <Tag className="w-5 h-5 text-gray-600 shrink-0 "  />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeCategory === category
                    ? 'bg-[#FF5F1F] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                style={{paddingInline: 30, paddingBlock: 5}}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex gap-10 flex-col overflow-y-scroll max-h-[70vh] hide-scrollbar" style={{ rowGap: 20 }}>
            {candidateSkills.length > 0 && topMatch && typeof topMatch.matchScore === 'number' && (
              <div
                style={{
                  background: 'linear-gradient(135deg, #fff7f2 0%, #ffffff 100%)',
                  border: '1px solid #fed7c3',
                  borderRadius: 16,
                  padding: '16px 18px',
                  marginBottom: 4,
                  boxShadow: '0 6px 18px rgba(255,95,31,0.08)',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: '#FF5F1F', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                  Best match for you
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                  {topMatch.title}
                </div>
                <div style={{ color: '#475569', fontSize: 14 }}>
                  You have a {topMatch.matchScore}% match based on your saved skills.
                </div>
              </div>
            )}
            {loadingJobs ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#64748B' }}>Loading jobs...</div>
            ) : filteredJobs.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#64748B' }}>No jobs found</div>
            ) : (
              displayedJobs.map((job, index) => (
                // Map the API job object to the JobCard props. JobCard expects a few fields; ensure defaults.
                <JobCard
                  key={String(job.id)}
                  id={Number(job.id) || 0}
                  title={job.title}
                  department={job.department ?? 'General'}
                  location={job.location ?? 'Remote'}
                  isNew={job.status === 'OPEN'}
                  description={job.description}
                  onClick={() => setSelectedJob(job as Job)}
                  fullWidth
                  matchScore={index === 0 && candidateSkills.length > 0 ? (job.matchScore ?? 0) : undefined}
                  isTopMatch={index === 0 && candidateSkills.length > 0}
                />
              ))
            )}
          </div>

          
        </div>

        {/* Right: Job Details Placeholder or Drawer */}
  <div className="hide-scrollbar" style={{ flex: '0 0 48%', minWidth: 0, maxWidth: '48%', borderRadius: 24, minHeight: 400, padding: 0, overflowY: 'auto', maxHeight: '70vh', display: selectedJob ? 'none' : 'block' }}>
          {!selectedJob && (
            <div className="tp-card-soft" style={{ textAlign: 'center', color: '#64748B', marginTop: 0, minHeight: 420, display: 'grid', placeItems: 'center', padding: '2rem' }}>
              <div>
                <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, color: '#0f172a' }}>Select a job to view details</div>
                <div style={{ fontSize: 18, lineHeight: 1.7 }}>Open a listing to see the full description, skills, and actions in a cleaner drawer.</div>
              </div>
            </div>
          )}
        </div>

        {/* If a job is selected, show the details in a floating drawer (for now, you can later refactor to show inline) */}
        {selectedJob && (
          <div className="hide-scrollbar" style={{ flex: '0 0 48%', minWidth: 0, maxWidth: '48%', overflowY: 'auto', height: '83vh' }}>
            {
              // Map the selected job into the shape expected by JobDetailDrawer
            }
            <JobDetailDrawer
              job={selectedJob as DrawerJob}
              onClose={() => setSelectedJob(null)}
            />
          </div>
        )}
        </div>
      </div>
      {state.user?.accountType === "EMPLOYER" && (
        <div style={{ position: 'fixed', right: 32, bottom: 32 }}>
          <button onClick={() => setShowCreateModal(true)} className="tp-btn-primary" style={{ boxShadow: '0 18px 35px -20px rgba(255,95,31,0.95)' }}>
            Create Job Posting
          </button>
        </div>
      )}

      {showCreateModal && (
        <div style={{ position: 'fixed', top: '80px', inset: 0, background: 'rgba(2,6,23,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(148,163,184,0.2)', padding: '1rem', zIndex: 2000 }}>
          <div className="tp-card-soft" style={{ width: 760, background: 'white', borderRadius: 24, padding: 32, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 80px -30px rgba(15,23,42,0.45)' }}>
            <div className="tp-chip" style={{ marginBottom: '0.75rem' }}>New listing</div>
            <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: '2rem', letterSpacing: '-0.04em' }}>Create job posting</h2>
            <p className="tp-lead" style={{ marginTop: 0, marginBottom: 24 }}>Keep the job data structured so it fits the backend contract and the new visual system.</p>
            <form onSubmit={handleCreateSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {/* shared styles for unfocused inputs */}
                {/** We'll inline focus handlers to switch background color */}
                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#4A5568', marginBottom: '0.25rem' }}>
                    Job Title
                  </label>
                  <input required placeholder=' Job Title' value={title} onChange={e => setTitle(e.target.value)}
                    onFocus={e => (e.currentTarget.style.background = '#fff')}
                    onBlur={e => (e.currentTarget.style.background = '#f7f7fa')}
                    style={{ background: '#f7f7fa', border: '1px solid #E2E8F0', padding: 8, width: '100%', borderRadius: 6 }}
                  />
                </div>
                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#4A5568', marginBottom: '0.25rem' }}>
                    Location
                  </label>
                  <input required placeholder='Location' value={locationInput} onChange={e => setLocationInput(e.target.value)}
                    onFocus={e => (e.currentTarget.style.background = '#fff')}
                    onBlur={e => (e.currentTarget.style.background = '#f7f7fa')}
                    style={{ background: '#f7f7fa', border: '1px solid #E2E8F0', padding: 8, width: '100%', borderRadius: 6 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                  <div style={{ gridColumn: '1 / span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: '#4A5568', marginBottom: '0.25rem' }}>
                      Department
                    </label>
                    <input placeholder='Department' value={departmentInput} onChange={e => setDepartmentInput(e.target.value)}
                      onFocus={e => (e.currentTarget.style.background = '#fff')}
                      onBlur={e => (e.currentTarget.style.background = '#f7f7fa')}
                      style={{ background: '#f7f7fa', border: '1px solid #E2E8F0', padding: 8, width: '100%', borderRadius: 6 }}
                    />
                  </div>
                  <select value={employmentType} onChange={e => setEmploymentType(e.target.value)} style={{ border: '1px solid #E2E8F0', padding: 8, width: '100%', borderRadius: 6, background: '#f7f7fa' }}>
                    <option value='FULL_TIME'>Full time</option>
                    <option value='PART_TIME'>Part time</option>
                    <option value='CONTRACT'>Contract</option>
                    <option value='INTERNSHIP'>Internship</option>
                  </select>
                </div>
                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#4A5568', marginBottom: '0.25rem' }}>
                    Salary Range
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input placeholder='Salary min' value={salaryMin} onChange={e => setSalaryMin(e.target.value)}
                      onFocus={e => (e.currentTarget.style.background = '#fff')}
                      onBlur={e => (e.currentTarget.style.background = '#f7f7fa')}
                      style={{ marginRight: 8, background: '#f7f7fa', border: '1px solid #E2E8F0', padding: 8, width: '100%', borderRadius: 6 }}
                    />
                    <input placeholder='Salary max' value={salaryMax} onChange={e => setSalaryMax(e.target.value)}
                      onFocus={e => (e.currentTarget.style.background = '#fff')}
                      onBlur={e => (e.currentTarget.style.background = '#f7f7fa')}
                      style={{ background: '#f7f7fa', border: '1px solid #E2E8F0', padding: 8, width: '100%', borderRadius: 6 }}
                    />
                  </div>
                </div>
                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#4A5568', marginBottom: '0.25rem' }}>
                    Job Description
                  </label>
                  <input required placeholder='Job Description' value={description} onChange={e => setDescription(e.target.value)}
                    onFocus={e => (e.currentTarget.style.background = '#fff')}
                    onBlur={e => (e.currentTarget.style.background = '#f7f7fa')}
                    style={{ background: '#f7f7fa', border: '1px solid #E2E8F0', padding: 8, width: '100%', borderRadius: 6 }}
                  />
                </div>
                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#4A5568', marginBottom: '0.25rem' }}>Skills</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      {skills.map((s) => (
                        <div key={s} style={{ background: '#F1F5F9', padding: '6px 10px', borderRadius: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ fontSize: 13 }}>{s}</span>
                          <button type='button' onClick={() => removeSkill(s)} style={{ background: 'transparent', border: 'none', color: '#ff5f1f', cursor: 'pointer' }}>×</button>
                        </div>
                      ))}

                      {/* plus button to show inline input */}
                      {!showSkillInput && (
                        <button type='button' onClick={() => setShowSkillInput(true)} style={{ background: '#fff', border: '1px dashed #CBD5E1', padding: '6px 10px', borderRadius: 8, cursor: 'pointer' }}>+</button>
                      )}

                      {showSkillInput && (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <input autoFocus placeholder='New skill' value={newSkill} onChange={e => setNewSkill(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                            style={{ padding: '6px 8px', borderRadius: 6, background: '#fff', border: '1px solid #E2E8F0' }}
                          />
                          <button type='button' onClick={addSkill} style={{ padding: '6px 10px', borderRadius: 6, background: '#1e3a8a', color: 'white' }}>Add</button>
                          <button type='button' onClick={() => { setShowSkillInput(false); setNewSkill(''); }} style={{ padding: '6px 8px', borderRadius: 6, background: 'transparent', border: '1px solid #e5e7eb' }}>Cancel</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>


              <div style={{ marginTop: 12 }}>
                <textarea placeholder='Requirements' value={requirements} onChange={e => setRequirements(e.target.value)} style={{ width: '100%', minHeight: 110, border: '1px solid #E2E8F0', padding: 12, borderRadius: 14, background: '#f8fafc' }} />
              </div>

              {createError && <div style={{ color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca', padding: '0.85rem 1rem', borderRadius: 14, fontWeight: 700 }}>{createError}</div>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                <button type='button' onClick={closeCreateModal} className="tp-btn-secondary">Cancel</button>
                <button type='submit' className="tp-btn-primary">{creating ? 'Creating...' : 'Create Job'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrowseJobs;