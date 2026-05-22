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
      if (!res) return

      // backend may return array or { data: [...] } or { jobs: [...] }
      console.log(res.jobs)
      const payload = res.jobs
      if (Array.isArray(payload)) setJobs(payload as Job[])
      setLoadingJobs(false)
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

  const filteredJobs = (jobs ?? []).filter((job) => {
    const matchesSearch = (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = true; // department filter not wired yet
    const matchesLocation = true; // location filter not wired yet
    const matchesCategory = activeCategory === 'All' || (job.department ?? 'General') === activeCategory;

    return matchesSearch && matchesDepartment && matchesLocation && matchesCategory;
  });

  return (
    <div className="flex-1 bg-[#F4F4F9] overflow-hidden h-[90vh]">
      <div className="max-w-7xl" style={{ marginLeft: 'auto', marginRight: 'auto', padding: 24, display: 'flex', flexDirection: 'row', gap: 32, alignItems: 'flex-start', height: '80vh' }}>
        {/* Left: Job List */}
  <div style={{ flex: '0 0 52%', minWidth: 0, maxWidth: '52%' }}>
          {/* Simple Search Bar */}
          <div className="flex items-center gap-3" style={{ marginBottom: 24 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(30,41,59,0.07)',
              border: '1px solid #e5e7eb',
              padding: '0.5rem 1rem',
              width: '100%',
              transition: 'box-shadow 0.2s',
            }}>
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

          <div className="flex items-center gap-3 overflow-x-hidden pb-2" style={{ marginBottom: 24, columnGap: 10 }}>
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
            {loadingJobs ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#64748B' }}>Loading jobs...</div>
            ) : filteredJobs.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#64748B' }}>No jobs found</div>
            ) : (
              filteredJobs.map((job) => (
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
                />
              ))
            )}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center" style={{ paddingTop: 64, paddingBottom: 64 }}>
              <p className="text-gray-500">No jobs found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Right: Job Details Placeholder or Drawer */}
  <div className="hide-scrollbar" style={{ flex: '0 0 48%', minWidth: 0, maxWidth: '48%', borderRadius: 16, minHeight: 400, padding: 32, overflowY: 'auto', maxHeight: '70vh', display: selectedJob ? 'none' : 'block' }}>
          {!selectedJob && (
            <div style={{ textAlign: 'center', color: '#64748B', marginTop: 80 }}>
              <div style={{ fontSize: 32, fontWeight: 600, marginBottom: 16 }}>Select a job to view details</div>
              <div style={{ fontSize: 18 }}>Job details will appear here.</div>
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
      {state.user?.accountType === "EMPLOYER" && (
        <div style={{ position: 'fixed', right: 32, bottom: 32 }}>
          <button onClick={() => setShowCreateModal(true)} style={{ background: '#FF5F1F', color: 'white', padding: '12px 18px', borderRadius: 8 }}>
            Create Job Posting
          </button>
        </div>
      )}

      {showCreateModal && (
        <div style={{ position: 'fixed', top: '80px', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid gray' }}>
          <div style={{ width: 720, background: 'white', borderRadius: 8, padding: 32, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0 }}>Create Job Posting</h2>
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
                <textarea placeholder='Requirements' value={requirements} onChange={e => setRequirements(e.target.value)} style={{ width: '100%', minHeight: 80, border: '1px solid #E2E8F0', padding: 8, borderRadius: 6 }} />
              </div>

              {createError && <div style={{ color: 'red' }}>{createError}</div>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                <button type='button' onClick={closeCreateModal}>Cancel</button>
                <button type='submit' style={{ background: '#1e3a8a', color: 'white', padding: '8px 12px', borderRadius: 6 }}>{creating ? 'Creating...' : 'Create Job'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrowseJobs;