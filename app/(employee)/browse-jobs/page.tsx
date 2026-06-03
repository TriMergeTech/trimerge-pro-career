"use client"


import React, { useState, useEffect, useRef } from 'react';
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

  const SKILL_SUGGESTIONS = ['JavaScript','TypeScript','React','Node.js','Python','Django','AWS','Docker','Kubernetes','SQL','PostgreSQL','GraphQL','REST','CSS','HTML','Next.js','Tailwind CSS','Java','C#','Go']

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
  type CountryInfo = { country: string; cities?: string[] }
  const [countriesData, setCountriesData] = useState<CountryInfo[] | null>(null)
  const [countriesLoading, setCountriesLoading] = useState(false)
  const [country, setCountry] = useState('')
  const [statesForCountry, setStatesForCountry] = useState<string[] | null>(null)
  const [statesLoading, setStatesLoading] = useState(false)
  const [stateProvince, setStateProvince] = useState('')
  const [citiesForState, setCitiesForState] = useState<string[] | null>(null)
  const [citiesLoading, setCitiesLoading] = useState(false)
  const [city, setCity] = useState('')

  // Salary slider bounds (numbers in local currency units)
  const SALARY_MIN = 0
  const SALARY_MAX = 300000
  const SALARY_STEP = 500
  const [salaryMinNum, setSalaryMinNum] = useState(30000)
  const [salaryMaxNum, setSalaryMaxNum] = useState(120000)
  const [activeThumb, setActiveThumb] = useState<'min' | 'max' | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const activeThumbRef = useRef<'min' | 'max' | null>(null)
  const valueFromPointer = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return SALARY_MIN
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    const raw = SALARY_MIN + ratio * salaryRangeWidth
    const stepped = Math.round(raw / SALARY_STEP) * SALARY_STEP
    return Math.min(SALARY_MAX, Math.max(SALARY_MIN, stepped))
  }

  const onPointerMove = (e: PointerEvent) => {
    const thumb = activeThumbRef.current
    if (!thumb) return
    const val = valueFromPointer(e.clientX)
    if (thumb === 'min') {
      const newMin = Math.min(val, salaryMaxNum)
      setSalaryMinNum(newMin)
      setSalaryMin(String(newMin))
    } else {
      const newMax = Math.max(val, salaryMinNum)
      setSalaryMaxNum(newMax)
      setSalaryMax(String(newMax))
    }
  }

  const onPointerUp = () => {
    setActiveThumb(null)
    activeThumbRef.current = null
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }

  const onPointerDownTrack = (e: React.PointerEvent) => {
    const clientX = e.clientX
    const val = valueFromPointer(clientX)
    // choose nearest thumb
    const distMin = Math.abs(val - salaryMinNum)
    const distMax = Math.abs(val - salaryMaxNum)
    const thumb = distMin <= distMax ? 'min' : 'max'
    setActiveThumb(thumb)
    // set initial value
    if (thumb === 'min') {
      const newMin = Math.min(val, salaryMaxNum)
      setSalaryMinNum(newMin)
      setSalaryMin(String(newMin))
    } else {
      const newMax = Math.max(val, salaryMinNum)
      setSalaryMaxNum(newMax)
      setSalaryMax(String(newMax))
    }
    // attach global listeners
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  const startThumbDrag = (thumb: 'min' | 'max', e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // ignore capture errors in older browsers
    }

    const val = valueFromPointer(e.clientX)
    setActiveThumb(thumb)
    activeThumbRef.current = thumb

    if (thumb === 'min') {
      const newMin = Math.min(val, salaryMaxNum)
      setSalaryMinNum(newMin)
      setSalaryMin(String(newMin))
    } else {
      const newMax = Math.max(val, salaryMinNum)
      setSalaryMaxNum(newMax)
      setSalaryMax(String(newMax))
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  // Skill suggestion UI state
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [suggestionIndex, setSuggestionIndex] = useState(-1)
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false)

  // Basic fallback if remote load fails
  const FALLBACK_COUNTRIES = [{ country: 'Nigeria', cities: ['Lagos', 'Abuja'] }, { country: 'United States', cities: ['Austin', 'Miami', 'Remote'] }]

  useEffect(() => {
    // Sync the textual location used by the backend
    if (!country) return
    if (stateProvince) {
      setLocationInput(city ? `${city}, ${stateProvince}, ${country}` : `${stateProvince}, ${country}`)
    } else {
      setLocationInput(city ? `${city}, ${country}` : country)
    }
  }, [country, stateProvince, city])

  useEffect(() => {
    // Load countries list when the create modal opens
    if (!showCreateModal) return
    if (countriesData || countriesLoading) return
    setCountriesLoading(true)
    fetch('https://countriesnow.space/api/v0.1/countries')
      .then(res => res.json())
      .then((json) => {
        if (json && Array.isArray(json.data)) {
          const normalized = json.data.map((c: any) => ({ country: c.country, cities: Array.isArray(c.cities) ? c.cities : [] }))
          setCountriesData(normalized)
          if (normalized.length > 0) {
            setCountry(normalized[0].country)
            setCity(normalized[0].cities[0] ?? '')
          }
        } else {
          setCountriesData(FALLBACK_COUNTRIES)
          setCountry(FALLBACK_COUNTRIES[0].country)
          setCity(FALLBACK_COUNTRIES[0].cities[0])
        }
      })
      .catch(() => {
        setCountriesData(FALLBACK_COUNTRIES)
        setCountry(FALLBACK_COUNTRIES[0].country)
        setCity(FALLBACK_COUNTRIES[0].cities[0])
      })
      .finally(() => setCountriesLoading(false))
  }, [showCreateModal, countriesData, countriesLoading])

  // When country changes, attempt to load administrative states for that country.
  useEffect(() => {
    if (!showCreateModal || !country) return
    setStatesLoading(true)
    setStatesForCountry(null)
    setCitiesForState(null)
    setStateProvince('')

    fetch('https://countriesnow.space/api/v0.1/countries/states', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country }),
    })
      .then(res => res.json())
      .then((json) => {
        const states = json?.data?.states ?? json?.data ?? null
        if (Array.isArray(states) && states.length > 0) {
          const names = states.map((s: any) => (typeof s === 'string' ? s : s.name || s.state || ''))
          setStatesForCountry(names)
          setStateProvince(names[0] ?? '')
        } else {
          // No states available: fall back to country-level cities
          const cent = (countriesData ?? FALLBACK_COUNTRIES).find(c => c.country === country)
          setStatesForCountry(null)
          setCitiesForState(cent?.cities ?? null)
          setCity(cent?.cities?.[0] ?? '')
        }
      })
      .catch(() => {
        const cent = (countriesData ?? FALLBACK_COUNTRIES).find(c => c.country === country)
        setStatesForCountry(null)
        setCitiesForState(cent?.cities ?? null)
        setCity(cent?.cities?.[0] ?? '')
      })
      .finally(() => setStatesLoading(false))
  }, [country, showCreateModal, countriesData])

  // When state/province changes, attempt to load cities for that state
  useEffect(() => {
    if (!showCreateModal || !country) return
    if (!stateProvince) return
    setCitiesLoading(true)
    setCitiesForState(null)

    fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country, state: stateProvince }),
    })
      .then(res => res.json())
      .then((json) => {
        const cities = json?.data ?? json?.data?.cities ?? null
        if (Array.isArray(cities) && cities.length > 0) {
          setCitiesForState(cities)
          setCity(cities[0] ?? '')
        } else {
          // fallback to country-level cities
          const cent = (countriesData ?? FALLBACK_COUNTRIES).find(c => c.country === country)
          setCitiesForState(cent?.cities ?? null)
          setCity(cent?.cities?.[0] ?? '')
        }
      })
      .catch(() => {
        const cent = (countriesData ?? FALLBACK_COUNTRIES).find(c => c.country === country)
        setCitiesForState(cent?.cities ?? null)
        setCity(cent?.cities?.[0] ?? '')
      })
      .finally(() => setCitiesLoading(false))
  }, [stateProvince, country, showCreateModal, countriesData])

  const DEPARTMENTS = ['Engineering', 'Marketing', 'HR', 'Sales', 'Design', 'Operations']
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

  // Ensure activeThumb is cleared if mouseup happens outside the input
  useEffect(() => {
    const onUp = () => setActiveThumb(null)
    window.addEventListener('mouseup', onUp)
    return () => window.removeEventListener('mouseup', onUp)
  }, [])

  const closeCreateModal = () => {
    setShowCreateModal(false)
    // reset form
    setTitle('')
    setDescription('')
    setRequirements('')
    setLocationInput('')
    // reset country/city to first available (fallback if not loaded)
    const first = (countriesData && countriesData.length > 0) ? countriesData[0] : (FALLBACK_COUNTRIES[0] ?? null)
    if (first) { setCountry(first.country); setCity((first as any).cities?.[0] ?? '') }
    setDepartmentInput('')
    setEmploymentType('FULL_TIME')
    setSalaryMin('')
    setSalaryMax('')
    setSalaryMinNum(30000)
    setSalaryMaxNum(120000)
    setSuggestions([])
    setSuggestionIndex(-1)
    setShowSkillSuggestions(false)
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
      department: departmentInput.toUpperCase(),
      requirements,
      location: locationInput,
      employmentType,
      salaryMin: Number(salaryMinNum) || 0,
      salaryMax: Number(salaryMaxNum) || 0,
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

  // Salary slider positions (percent) for custom thumbs
  const salaryRangeWidth = SALARY_MAX - SALARY_MIN || 1
  const salaryMinPct = Math.round(((salaryMinNum - SALARY_MIN) / salaryRangeWidth) * 100)
  const salaryMaxPct = Math.round(((salaryMaxNum - SALARY_MIN) / salaryRangeWidth) * 100)

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
                    ? 'bg-[#3C64DC] text-white shadow-md'
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
                  boxShadow: '0 6px 18px rgba(60,100,220,0.08)',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: '#3C64DC', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
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
          <button onClick={() => setShowCreateModal(true)} className="tp-btn-primary" style={{ boxShadow: '0 18px 35px -20px rgba(60,100,220,0.95)' }}>
            Create Job Posting
          </button>
        </div>
      )}

      {showCreateModal && (
        <div style={{ position: 'fixed', top: '60px', inset: 0, background: 'rgba(2,6,23,0.48)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem', zIndex: 2000 }}>
          <div className="tp-card-soft" role="dialog" aria-modal="true" style={{ width: 820, background: 'linear-gradient(180deg, #ffffff, #fbfdff)', borderRadius: 20, padding: 28, maxHeight: '86vh', overflowY: 'auto', boxShadow: '0 40px 100px rgba(2,6,23,0.26)', border: '1px solid rgba(15,23,42,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div className="tp-chip" style={{ marginBottom: '0.6rem', background: 'linear-gradient(90deg,#E8F0FF,#F4F7FF)', color: '#1e3a8a', padding: '6px 10px', borderRadius: 999, fontWeight: 700, display: 'inline-block' }}>New listing</div>
                <h2 style={{ marginTop: 0, marginBottom: 6, fontSize: '1.9rem', letterSpacing: '-0.04em' }}>Create job posting</h2>
                <p className="tp-lead" style={{ marginTop: 0, marginBottom: 12, color: '#6b7280' }}>Keep the job data structured so it fits the backend contract and the new visual system.</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={closeCreateModal} aria-label="Close create job" style={{ border: 'none', background: 'transparent', padding: 8, borderRadius: 10, cursor: 'pointer' }}>✕</button>
              </div>
            </div>
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
                <div style={{ gridColumn: '1 / span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: '#4A5568', marginBottom: '0.25rem' }}>Country</label>
                    <select
                      value={country}
                      onChange={e => { const sel = e.target.value; setCountry(sel); setStateProvince(''); setCitiesForState(null); setCity('') }}
                      aria-label="Select country"
                      style={{ width: '100%', border: '1px solid #E2E8F0', padding: 10, borderRadius: 8, background: '#fff', cursor: 'pointer', appearance: 'none' }}
                    >
                      {(countriesData ?? FALLBACK_COUNTRIES).map(c => (
                        <option key={c.country} value={c.country}>{c.country}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: '#4A5568', marginBottom: '0.25rem' }}>State / Province</label>
                    {statesForCountry ? (
                      <select
                        value={stateProvince}
                        onChange={e => setStateProvince(e.target.value)}
                        aria-label="Select state or province"
                        style={{ width: '100%', border: '1px solid #E2E8F0', padding: 10, borderRadius: 8, background: '#fff', cursor: 'pointer', appearance: 'none' }}
                      >
                        {statesForCountry.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <select
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        aria-label="Select city or location"
                        style={{ width: '100%', border: '1px solid #E2E8F0', padding: 10, borderRadius: 8, background: '#fff', cursor: 'pointer', appearance: 'none' }}
                      >
                        {((countriesData ?? FALLBACK_COUNTRIES).find(c => c.country === country)?.cities ?? []).map(ct => (
                          <option key={ct} value={ct}>{ct}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* If states are present, render a city selector based on the selected state */}
                  {statesForCountry && (
                    <div style={{ gridColumn: '1 / span 2' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', color: '#4A5568', marginBottom: '0.25rem' }}>City / Location</label>
                      <select
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        aria-label="Select city or location"
                        style={{ width: '100%', border: '1px solid #E2E8F0', padding: 10, borderRadius: 8, background: '#fff', cursor: 'pointer', appearance: 'none' }}
                      >
                        {(citiesForState ?? []).map(ct => (
                          <option key={ct} value={ct}>{ct}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: '#4A5568', marginBottom: '0.25rem' }}>
                      Department
                    </label>
                    <select value={departmentInput} onChange={e => setDepartmentInput(e.target.value)} aria-label="Select department"
                      onFocus={e => (e.currentTarget.style.boxShadow = '0 6px 18px rgba(59,130,246,0.08)')}
                      onBlur={e => (e.currentTarget.style.boxShadow = 'none')}
                      style={{ background: '#f7f7fa', border: '1px solid #E2E8F0', padding: 10, width: '100%', borderRadius: 8, cursor: 'pointer' }}
                    >
                      <option value="">Select department...</option>
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ flex: '0 0 38%', position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: '#4A5568', marginBottom: '0.25rem' }}>Employment type</label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={employmentType}
                        onChange={e => setEmploymentType(e.target.value)}
                        aria-label="Employment Type"
                        onFocus={e => (e.currentTarget.style.boxShadow = '0 6px 18px rgba(59,130,246,0.12)')}
                        onBlur={e => (e.currentTarget.style.boxShadow = 'none')}
                        style={{
                          width: '100%',
                          border: '1px solid #E6EEF8',
                          padding: '10px 40px 10px 12px',
                          borderRadius: 10,
                          background: '#ffffff',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          outline: 'none',
                          cursor: 'pointer',
                          fontSize: 15,
                          boxShadow: '0 2px 6px rgba(2,6,23,0.04)'
                        }}
                      >
                        <option value='FULL_TIME'>Full time</option>
                        <option value='PART_TIME'>Part time</option>
                        <option value='CONTRACT'>Contract</option>
                        <option value='INTERNSHIP'>Internship</option>
                      </select>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#4A5568', marginBottom: '0.25rem' }}>
                    Salary Range
                  </label>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <input type="number" aria-label="Salary minimum" value={salaryMinNum} onChange={e => { const v = Number(e.target.value||0); setSalaryMinNum(Math.min(v, salaryMaxNum)); setSalaryMin(String(Math.min(v, salaryMaxNum))) }}
                        style={{ background: '#f7f7fa', border: '1px solid #E2E8F0', padding: 8, width: '30%', borderRadius: 6 }} />
                      <div style={{ flex: 1 }}>
                        <div ref={trackRef} onPointerDown={onPointerDownTrack} style={{ position: 'relative', height: 48, touchAction: 'none' }}>
                          <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)', height: 8, borderRadius: 8, background: '#F1F5F9' }} />
                          <div style={{ position: 'absolute', left: `${salaryMinPct}%`, right: `${100 - salaryMaxPct}%`, top: '50%', transform: 'translateY(-50%)', height: 8, borderRadius: 8, background: 'linear-gradient(90deg,#60A5FA,#3B82F6)' }} />
                          {/* Custom thumbs with larger hitboxes */}
                          <button
                            type="button"
                            aria-label="Drag minimum salary"
                            onPointerDown={(e) => {
                              if ((e as any).button !== 0) return
                              startThumbDrag('min', e)
                            }}
                            style={{
                              position: 'absolute',
                              left: `calc(${salaryMinPct}% - 26px)`,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: 52,
                              height: 52,
                              border: 'none',
                              background: 'transparent',
                              padding: 0,
                              margin: 0,
                              cursor: 'grab',
                              touchAction: 'none',
                              zIndex: activeThumb === 'min' ? 4 : 2,
                            }}
                          >
                            <span aria-hidden style={{ position: 'absolute', left: 16, top: 16, width: 20, height: 20, borderRadius: '999px', background: 'white', border: '3px solid #2563EB', boxShadow: '0 6px 18px rgba(37,99,235,0.18)', pointerEvents: 'none' }} />
                          </button>
                          <button
                            type="button"
                            aria-label="Drag maximum salary"
                            onPointerDown={(e) => {
                              if ((e as any).button !== 0) return
                              startThumbDrag('max', e)
                            }}
                            style={{
                              position: 'absolute',
                              left: `calc(${salaryMaxPct}% - 26px)`,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: 52,
                              height: 52,
                              border: 'none',
                              background: 'transparent',
                              padding: 0,
                              margin: 0,
                              cursor: 'grab',
                              touchAction: 'none',
                              zIndex: activeThumb === 'max' ? 4 : 2,
                            }}
                          >
                            <span aria-hidden style={{ position: 'absolute', left: 16, top: 16, width: 20, height: 20, borderRadius: '999px', background: 'white', border: '3px solid #2563EB', boxShadow: '0 6px 18px rgba(37,99,235,0.18)', pointerEvents: 'none' }} />
                          </button>
                        </div>
                      </div>
                      <input type="number" aria-label="Salary maximum" value={salaryMaxNum} onChange={e => { const v = Number(e.target.value||0); setSalaryMaxNum(Math.max(v, salaryMinNum)); setSalaryMax(String(Math.max(v, salaryMinNum))) }}
                        style={{ background: '#f7f7fa', border: '1px solid #E2E8F0', padding: 8, width: '30%', borderRadius: 6 }} />
                    </div>
                    <div style={{ color: 'var(--tp-muted)', fontSize: 13 }}>You can drag the handles or type exact values.</div>
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
                          <button type='button' onClick={() => removeSkill(s)} style={{ background: 'transparent', border: 'none', color: '#1343bd', cursor: 'pointer' }}>×</button>
                        </div>
                      ))}

                      {/* plus button to show inline input */}
                      {!showSkillInput && (
                        <button type='button' onClick={() => setShowSkillInput(true)} style={{ background: '#fff', border: '1px dashed #CBD5E1', padding: '6px 10px', borderRadius: 8, cursor: 'pointer' }}>+</button>
                      )}

                      {showSkillInput && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 260 }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <input autoFocus placeholder='New skill' value={newSkill} onChange={e => {
                                const v = e.target.value; setNewSkill(v);
                                const filtered = SKILL_SUGGESTIONS.filter(s => s.toLowerCase().includes(v.toLowerCase()) && !skills.includes(s)).slice(0,8);
                                setSuggestions(filtered); setSuggestionIndex(-1); setShowSkillSuggestions(filtered.length > 0);
                              }}
                              onKeyDown={e => {
                                if (e.key === 'Enter') { e.preventDefault(); if (showSkillSuggestions && suggestionIndex >= 0) { setNewSkill(suggestions[suggestionIndex]); addSkill(); } else { addSkill(); } }
                                if (e.key === 'ArrowDown') { e.preventDefault(); setSuggestionIndex(i => Math.min((i+1), suggestions.length-1)); }
                                if (e.key === 'ArrowUp') { e.preventDefault(); setSuggestionIndex(i => Math.max((i-1), 0)); }
                                if (e.key === 'Escape') { setShowSkillSuggestions(false); }
                              }}
                              style={{ padding: '6px 8px', borderRadius: 6, background: '#fff', border: '1px solid #E2E8F0', flex: 1 }}
                            />
                            <button type='button' onClick={addSkill} style={{ padding: '6px 10px', borderRadius: 6, background: '#1e3a8a', color: 'white' }}>Add</button>
                            <button type='button' onClick={() => { setShowSkillInput(false); setNewSkill(''); setShowSkillSuggestions(false); }} style={{ padding: '6px 8px', borderRadius: 6, background: 'transparent', border: '1px solid #e5e7eb' }}>Cancel</button>
                          </div>
                          {showSkillSuggestions && suggestions.length > 0 && (
                            <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, background: 'white', boxShadow: '0 6px 18px rgba(2,6,23,0.08)', maxHeight: 180, overflowY: 'auto' }}>
                              {suggestions.map((s, idx) => (
                                <div key={s} onMouseDown={e => { e.preventDefault(); setNewSkill(s); addSkill(); }}
                                  style={{ padding: '8px 10px', cursor: 'pointer', background: idx === suggestionIndex ? '#EEF2FF' : 'transparent' }}>
                                  {s}
                                </div>
                              ))}
                            </div>
                          )}
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