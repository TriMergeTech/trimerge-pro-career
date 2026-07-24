"use client";

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { BriefcaseBusiness, Building2, ChevronLeft, ChevronRight, Pencil, Plus, Trash2, Users } from 'lucide-react';
import { useUser } from '@/contexts/userContext/userContext';
import useGetEmployer from '@/hooks/useGetEmployer';
import { useGetJobs } from '@/hooks/useGetJobs';
import { useUpdateEmployerProfile } from '@/hooks/useUpdateEmployerProfile';
import { useUpdateJob } from '@/hooks/useUpdateJob';
import { useDeleteJob } from '@/hooks/useDeleteJob';
import { useCreateJob } from '@/hooks/useCreateJob';
import { Select } from '../../components/ui/Select';
import { COMPANY_INDUSTRY_OPTIONS, COMPANY_SIZE_OPTIONS } from '../../(authentication)/(recruiterAuth)/recruiter-information/step-one/constants';
import CandidateOverviewClient from '../candidate-overview/CandidateOverviewClient';

type CountryInfo = { country: string; cities?: string[] }
const FALLBACK_COUNTRIES: CountryInfo[] = [
  { country: 'Nigeria', cities: ['Lagos', 'Abuja'] },
  { country: 'United States', cities: ['Austin', 'Miami', 'Remote'] },
]

type Tab = 'jobs' | 'applications' | 'company';
type JobRecord = {
  id?: number | string;
  _id?: string;
  title?: string;
  department?: string;
  location?: string;
  status?: string;
  description?: string;
  requirements?: string;
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  skills?: string[];
  employerId?: string;
};

const tabMeta: Array<{ id: Tab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = [
  { id: 'jobs', label: 'Jobs', icon: BriefcaseBusiness },
  { id: 'applications', label: 'Candidates', icon: Users },
  { id: 'company', label: 'Company', icon: Building2 },
];

export function EmployerDashboard() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as Tab | null) ?? 'jobs';
  const initialJobId = searchParams.get('jobId') ?? '';

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const { state } = useUser();
  const { data: userData, refetch } = useGetEmployer();
  const { fetchJobs } = useGetJobs();
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const { update: updateProfile, loading: updateLoading, error: updateError } = useUpdateEmployerProfile();
  const { updateJob, loading: updatingJob, error: updateJobError, setError: setUpdateJobError } = useUpdateJob();
  const { deleteJob, loading: deletingJob } = useDeleteJob();
  const [refreshKey, setRefreshKey] = useState(0);
  const [appCounts, setAppCounts] = useState<Record<string, number>>({});
  const { createJob, loading: creating, error: createError, setError: setCreateError } = useCreateJob();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '', description: '', requirements: '',
    employmentType: 'FULL_TIME', department: 'ENGINEERING',
    status: 'OPEN', salaryMin: '', salaryMax: '', skills: '',
  });
  const [locationCountry, setLocationCountry] = useState('');
  const [locationState, setLocationState] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [countriesData, setCountriesData] = useState<CountryInfo[] | null>(null);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [statesForCountry, setStatesForCountry] = useState<string[] | null>(null);
  const [citiesForState, setCitiesForState] = useState<string[] | null>(null);
  // Edit modal location
  const [editLocCountry, setEditLocCountry] = useState('');
  const [editLocState, setEditLocState] = useState('');
  const [editLocCity, setEditLocCity] = useState('');
  const [editStatesForCountry, setEditStatesForCountry] = useState<string[] | null>(null);
  const [editCitiesForState, setEditCitiesForState] = useState<string[] | null>(null);
  const [editingJob, setEditingJob] = useState<JobRecord | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editJobForm, setEditJobForm] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    employmentType: 'FULL_TIME',
    department: 'ENGINEERING',
    status: 'OPEN',
    salaryMin: '',
    salaryMax: '',
    skills: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    companyName: '',
    companyWebsite: '',
    industry: '',
    companySize: '',
    yourRole: '',
    companyOverview: '',
    benefitsAndOpportunities: '',
    primaryHiringNeeds: '',
  });

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
  }, [fetchJobs, refreshKey]);

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

  useEffect(() => {
    if (employerJobs.length === 0) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('tm_token') : null;
    Promise.all(
      employerJobs.map(async (job) => {
        const id = String(job.id ?? job._id ?? '');
        if (!id) return [id, 0] as const;
        try {
          const res = await fetch(
            `https://trimerge-pro-career.onrender.com/api/v1/applications/job/${encodeURIComponent(id)}?page=1&limit=100`,
            { headers: { Authorization: token ? `Bearer ${token}` : '' } }
          );
          if (!res.ok) return [id, 0] as const;
          const data = await res.json().catch(() => ({}));
          const count = data?.total ?? data?.pagination?.total ?? (Array.isArray(data?.applications) ? data.applications.length : 0);
          return [id, count] as const;
        } catch {
          return [id, 0] as const;
        }
      })
    ).then((entries) => setAppCounts(Object.fromEntries(entries)));
  }, [employerJobs]);

  useEffect(() => {
    if (!userData) return;
    const profile = (userData as Record<string, unknown>)?.['profile'] ?? {};
    const p = profile as Record<string, unknown>;
    setEditForm({
      companyName: String(p['companyName'] ?? ''),
      companyWebsite: String(p['companyWebsite'] ?? ''),
      industry: String(p['industry'] ?? ''),
      companySize: String(p['companySize'] ?? ''),
      yourRole: String(p['yourRole'] ?? p['role'] ?? ''),
      companyOverview: String(p['companyOverview'] ?? ''),
      benefitsAndOpportunities: String(p['benefitsAndOpportunities'] ?? ''),
      primaryHiringNeeds: Array.isArray(p['primaryHiringNeeds'])
        ? (p['primaryHiringNeeds'] as string[]).join(', ')
        : String(p['primaryHiringNeeds'] ?? ''),
    });
  }, [userData]);

  const handleEditOpen = (job: JobRecord) => {
    setEditJobForm({
      title: job.title ?? '',
      description: job.description ?? '',
      requirements: job.requirements ?? '',
      location: job.location ?? '',
      employmentType: job.employmentType ?? 'FULL_TIME',
      department: job.department ?? 'ENGINEERING',
      status: job.status ?? 'OPEN',
      salaryMin: job.salaryMin != null ? String(job.salaryMin) : '',
      salaryMax: job.salaryMax != null ? String(job.salaryMax) : '',
      skills: Array.isArray(job.skills) ? job.skills.join(', ') : '',
    });
    // Parse existing location string (e.g. "Lagos, Ondo, Nigeria") into parts
    const parts = (job.location ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    setEditLocCountry(parts[parts.length - 1] ?? '');
    setEditLocState(parts.length >= 3 ? parts[parts.length - 2] : '');
    setEditLocCity(parts.length >= 2 ? parts[0] : '');
    setEditStatesForCountry(null);
    setEditCitiesForState(null);
    setUpdateJobError(null);
    setEditingJob(job);
  };

  // Load states for edit modal when country changes
  useEffect(() => {
    if (!editingJob || !editLocCountry) return;
    setEditStatesForCountry(null);
    setEditCitiesForState(null);
    fetch('https://countriesnow.space/api/v0.1/countries/states', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: editLocCountry }),
    })
      .then((r) => r.json())
      .then((json) => {
        const states = json?.data?.states ?? json?.data ?? null;
        if (Array.isArray(states) && states.length > 0) {
          const names: string[] = states.map((s: unknown) => typeof s === 'string' ? s : (s as Record<string, string>).name || '');
          setEditStatesForCountry(names);
          if (!names.includes(editLocState)) setEditLocState(names[0] ?? '');
        } else {
          const entry = (countriesData ?? FALLBACK_COUNTRIES).find((c) => c.country === editLocCountry);
          setEditCitiesForState(entry?.cities ?? null);
          if (!editLocCity) setEditLocCity(entry?.cities?.[0] ?? '');
        }
      })
      .catch(() => {
        const entry = (countriesData ?? FALLBACK_COUNTRIES).find((c) => c.country === editLocCountry);
        setEditCitiesForState(entry?.cities ?? null);
      });
  }, [editLocCountry, editingJob, countriesData]);

  // Load cities for edit modal when state changes
  useEffect(() => {
    if (!editingJob || !editLocCountry || !editLocState) return;
    setEditCitiesForState(null);
    fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: editLocCountry, state: editLocState }),
    })
      .then((r) => r.json())
      .then((json) => {
        const cities = json?.data ?? null;
        if (Array.isArray(cities) && cities.length > 0) {
          setEditCitiesForState(cities);
          if (!cities.includes(editLocCity)) setEditLocCity(cities[0] ?? '');
        } else {
          const entry = (countriesData ?? FALLBACK_COUNTRIES).find((c) => c.country === editLocCountry);
          setEditCitiesForState(entry?.cities ?? null);
        }
      })
      .catch(() => {
        const entry = (countriesData ?? FALLBACK_COUNTRIES).find((c) => c.country === editLocCountry);
        setEditCitiesForState(entry?.cities ?? null);
      });
  }, [editLocState, editLocCountry, editingJob, countriesData]);

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    const id = String(editingJob.id ?? editingJob._id ?? '');
    const skills = editJobForm.skills.split(',').map((s) => s.trim()).filter(Boolean);
    const locationParts = [editLocCity, editLocState, editLocCountry].filter(Boolean);
    const location = locationParts.join(', ') || editJobForm.location;
    const ok = await updateJob(id, {
      ...(editJobForm.title && { title: editJobForm.title }),
      ...(editJobForm.description && { description: editJobForm.description }),
      ...(editJobForm.requirements && { requirements: editJobForm.requirements }),
      ...(location && { location }),
      employmentType: editJobForm.employmentType,
      department: editJobForm.department,
      status: editJobForm.status,
      ...(editJobForm.salaryMin && { salaryMin: Number(editJobForm.salaryMin) }),
      ...(editJobForm.salaryMax && { salaryMax: Number(editJobForm.salaryMax) }),
      ...(skills.length > 0 && { skills }),
    });
    if (ok) {
      setEditingJob(null);
      setRefreshKey((k) => k + 1);
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    const ok = await deleteJob(id);
    if (ok) {
      setConfirmDeleteId(null);
      setRefreshKey((k) => k + 1);
    }
  };

  const handleSave = async () => {
    const needs = editForm.primaryHiringNeeds
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const ok = await updateProfile({
      ...(editForm.companyName && { companyName: editForm.companyName }),
      ...(editForm.companyWebsite && { companyWebsite: editForm.companyWebsite }),
      ...(editForm.industry && { industry: editForm.industry }),
      ...(editForm.companySize && { companySize: editForm.companySize }),
      ...(editForm.yourRole && { yourRole: editForm.yourRole }),
      ...(editForm.companyOverview && { companyOverview: editForm.companyOverview }),
      ...(editForm.benefitsAndOpportunities && { benefitsAndOpportunities: editForm.benefitsAndOpportunities }),
      ...(needs.length > 0 && { primaryHiringNeeds: needs }),
    });
    if (ok) {
      setIsEditing(false);
      refetch();
    }
  };

  const handleCancel = () => {
    const profile = (userData as Record<string, unknown> | null)?.['profile'] ?? {};
    const p = profile as Record<string, unknown>;
    setEditForm({
      companyName: String(p['companyName'] ?? ''),
      companyWebsite: String(p['companyWebsite'] ?? ''),
      industry: String(p['industry'] ?? ''),
      companySize: String(p['companySize'] ?? ''),
      yourRole: String(p['yourRole'] ?? p['role'] ?? ''),
      companyOverview: String(p['companyOverview'] ?? ''),
      benefitsAndOpportunities: String(p['benefitsAndOpportunities'] ?? ''),
      primaryHiringNeeds: Array.isArray(p['primaryHiringNeeds'])
        ? (p['primaryHiringNeeds'] as string[]).join(', ')
        : String(p['primaryHiringNeeds'] ?? ''),
    });
    setIsEditing(false);
  };

  // Sync location string from country/state/city selections
  useEffect(() => {
    if (!locationCountry) return;
    const parts = [locationCity, locationState, locationCountry].filter(Boolean);
    // no-op — location is assembled at submit time from these three values
    void parts;
  }, [locationCountry, locationState, locationCity]);

  // Load countries list when modal opens
  useEffect(() => {
    if (!showCreateModal) return;
    if (countriesData || countriesLoading) return;
    setCountriesLoading(true);
    fetch('https://countriesnow.space/api/v0.1/countries')
      .then((r) => r.json())
      .then((json) => {
        const list = Array.isArray(json?.data) ? json.data as CountryInfo[] : null;
        const normalized = list ?? FALLBACK_COUNTRIES;
        setCountriesData(normalized);
        setLocationCountry(normalized[0]?.country ?? '');
        setLocationCity((normalized[0] as { cities?: string[] })?.cities?.[0] ?? '');
      })
      .catch(() => {
        setCountriesData(FALLBACK_COUNTRIES);
        setLocationCountry(FALLBACK_COUNTRIES[0].country);
        setLocationCity(FALLBACK_COUNTRIES[0].cities?.[0] ?? '');
      })
      .finally(() => setCountriesLoading(false));
  }, [showCreateModal, countriesData, countriesLoading]);

  // Load states when country changes
  useEffect(() => {
    if (!showCreateModal || !locationCountry) return;
    setStatesForCountry(null);
    setCitiesForState(null);
    setLocationState('');
    fetch('https://countriesnow.space/api/v0.1/countries/states', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: locationCountry }),
    })
      .then((r) => r.json())
      .then((json) => {
        const states = json?.data?.states ?? json?.data ?? null;
        if (Array.isArray(states) && states.length > 0) {
          const names: string[] = states.map((s: unknown) => typeof s === 'string' ? s : (s as Record<string, string>).name || '');
          setStatesForCountry(names);
          setLocationState(names[0] ?? '');
        } else {
          const entry = (countriesData ?? FALLBACK_COUNTRIES).find((c) => c.country === locationCountry);
          setCitiesForState(entry?.cities ?? null);
          setLocationCity(entry?.cities?.[0] ?? '');
        }
      })
      .catch(() => {
        const entry = (countriesData ?? FALLBACK_COUNTRIES).find((c) => c.country === locationCountry);
        setCitiesForState(entry?.cities ?? null);
        setLocationCity(entry?.cities?.[0] ?? '');
      });
  }, [locationCountry, showCreateModal, countriesData]);

  // Load cities when state changes
  useEffect(() => {
    if (!showCreateModal || !locationCountry || !locationState) return;
    setCitiesForState(null);
    fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: locationCountry, state: locationState }),
    })
      .then((r) => r.json())
      .then((json) => {
        const cities = json?.data ?? null;
        if (Array.isArray(cities) && cities.length > 0) {
          setCitiesForState(cities);
          setLocationCity(cities[0] ?? '');
        } else {
          const entry = (countriesData ?? FALLBACK_COUNTRIES).find((c) => c.country === locationCountry);
          setCitiesForState(entry?.cities ?? null);
          setLocationCity(entry?.cities?.[0] ?? '');
        }
      })
      .catch(() => {
        const entry = (countriesData ?? FALLBACK_COUNTRIES).find((c) => c.country === locationCountry);
        setCitiesForState(entry?.cities ?? null);
        setLocationCity(entry?.cities?.[0] ?? '');
      });
  }, [locationState, locationCountry, showCreateModal, countriesData]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const skills = createForm.skills.split(',').map((s) => s.trim()).filter(Boolean);
    const locationParts = [locationCity, locationState, locationCountry].filter(Boolean);
    const location = locationParts.join(', ');
    const res = await createJob({
      title: createForm.title,
      description: createForm.description,
      requirements: createForm.requirements,
      location,
      employmentType: createForm.employmentType,
      department: createForm.department,
      status: createForm.status,
      ...(createForm.salaryMin && { salaryMin: Number(createForm.salaryMin) }),
      ...(createForm.salaryMax && { salaryMax: Number(createForm.salaryMax) }),
      ...(skills.length > 0 && { skills }),
    });
    if (res) {
      setShowCreateModal(false);
      setCreateForm({ title: '', description: '', requirements: '', employmentType: 'FULL_TIME', department: 'ENGINEERING', status: 'OPEN', salaryMin: '', salaryMax: '', skills: '' });
      setLocationCountry(''); setLocationState(''); setLocationCity('');
      setStatesForCountry(null); setCitiesForState(null);
      setRefreshKey((k) => k + 1);
    }
  };

  return (
    <>
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex' }}>

        {/* Sidebar */}
        <aside style={{ width: sidebarCollapsed ? '60px' : '224px', flexShrink: 0, borderRight: '1px solid rgba(148,163,184,0.15)', background: 'white', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', transition: 'width 0.2s ease', overflow: 'hidden' }}>

          {/* Header row: company name + collapse toggle */}
          <div style={{ padding: sidebarCollapsed ? '1rem 0' : '1.1rem 1.1rem 0.9rem', borderBottom: '1px solid rgba(148,163,184,0.1)', display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'space-between', gap: '0.5rem', minHeight: '60px' }}>
            {!sidebarCollapsed && (
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{companyName}</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{recruiterRole}</div>
              </div>
            )}
            <button
              type="button"
              onClick={() => setSidebarCollapsed((c) => !c)}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{ padding: '0.35rem', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8', display: 'grid', placeItems: 'center', flexShrink: 0 }}
            >
              {sidebarCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
            </button>
          </div>

          {/* Nav */}
          <nav style={{ padding: sidebarCollapsed ? '0.65rem 0.5rem' : '0.65rem 0.6rem', flex: 1 }}>
            {tabMeta.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  title={sidebarCollapsed ? tab.label : undefined}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    gap: '0.55rem', width: '100%',
                    padding: sidebarCollapsed ? '0.65rem' : '0.6rem 0.75rem',
                    marginBottom: '0.15rem', borderRadius: '8px', border: 'none',
                    background: isActive ? '#eff6ff' : 'transparent',
                    color: isActive ? '#1d4ed8' : '#475569',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon size={15} />
                  {!sidebarCollapsed && tab.label}
                </button>
              );
            })}
          </nav>

        </aside>

        {/* Content */}
        <main style={{ flex: 1, minWidth: 0, padding: '2rem 2.5rem', overflowY: 'auto' }}>

          {/* Jobs tab */}
          {activeTab === 'jobs' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem', gap: '0.75rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Your job postings</h2>
                <button
                  type="button"
                  onClick={() => { setCreateError(null); setShowCreateModal(true); }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #07172e, #1d4ed8)', color: 'white', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', flexShrink: 0 }}
                >
                  <Plus size={14} />
                  Post a Job
                </button>
              </div>

              {loadingJobs ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading jobs...</div>
              ) : employerJobs.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', background: 'white', borderRadius: '14px', border: '1px solid rgba(148,163,184,0.15)' }}>No employer jobs found yet.</div>
              ) : (
                <div style={{ display: 'grid', gap: '0.55rem' }}>
                  {employerJobs.map((job, index) => {
                    const jobId = String(job.id ?? job._id ?? `${index}`);
                    const statusColors: Record<string, { bg: string; color: string }> = {
                      OPEN: { bg: '#dcfce7', color: '#166534' },
                      DRAFT: { bg: '#fef9c3', color: '#854d0e' },
                      CLOSED: { bg: '#fee2e2', color: '#991b1b' },
                    };
                    const statusStyle = statusColors[String(job.status ?? '').toUpperCase()] ?? { bg: '#f1f5f9', color: '#475569' };
                    const isConfirming = confirmDeleteId === jobId;

                    return (
                      <div key={jobId} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', padding: '0.85rem 1rem', background: 'white', borderRadius: '12px', border: '1px solid rgba(148,163,184,0.15)' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{job.title ?? 'Untitled job'}</span>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px', background: statusStyle.bg, color: statusStyle.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              {job.status ?? 'OPEN'}
                            </span>
                          </div>
                          <div style={{ color: '#94a3b8', marginTop: '0.2rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>{job.department ?? 'General'} · {job.location ?? 'Remote'}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <span style={{ width: '3px', height: '3px', borderRadius: '999px', background: '#cbd5e1', display: 'inline-block' }} />
                              <Users size={11} />
                              {appCounts[jobId] != null ? `${appCounts[jobId]} applicant${appCounts[jobId] === 1 ? '' : 's'}` : '—'}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                          {isConfirming ? (
                            <>
                              <span style={{ fontSize: '0.8rem', color: '#991b1b', fontWeight: 700, whiteSpace: 'nowrap' }}>Delete?</span>
                              <button type="button" onClick={() => setConfirmDeleteId(null)} style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.3)', background: 'transparent', cursor: 'pointer', fontWeight: 600 }}>
                                Cancel
                              </button>
                              <button type="button" onClick={() => handleDeleteConfirm(jobId)} disabled={deletingJob} style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem', borderRadius: '8px', border: 'none', background: '#991b1b', color: 'white', cursor: deletingJob ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
                                {deletingJob ? '…' : 'Delete'}
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                title="View applications"
                                onClick={() => { setSelectedJobId(jobId); setActiveTab('applications'); }}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 600, padding: '0.35rem 0.65rem', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.2)', background: '#f8fafc', color: '#64748b', cursor: 'pointer' }}
                              >
                                <Users size={12} />
                                Applications
                              </button>
                              <button
                                type="button"
                                title="Edit job"
                                onClick={() => handleEditOpen(job)}
                                style={{ padding: '0.38rem', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.2)', background: '#f8fafc', color: '#64748b', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                type="button"
                                title="Delete job"
                                onClick={() => setConfirmDeleteId(jobId)}
                                style={{ padding: '0.38rem', borderRadius: '8px', border: '1px solid rgba(254,202,202,0.5)', background: '#fff5f5', color: '#dc2626', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Applications tab */}
          {activeTab === 'applications' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(15rem, 18rem) 1fr', gap: '1.25rem', alignItems: 'start' }}>
              <div style={{ position: 'sticky', top: '1rem' }}>
                <p style={{ margin: '0 0 0.65rem', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Select a job</p>
                <div style={{ display: 'grid', gap: '0.45rem' }}>
                  {employerJobs.length === 0 ? (
                    <div style={{ color: '#94a3b8', fontSize: '0.88rem' }}>No jobs available yet.</div>
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
                          padding: '0.75rem 0.9rem',
                          borderRadius: '10px',
                          border: isActive ? '1px solid rgba(29,78,216,0.3)' : '1px solid rgba(148,163,184,0.15)',
                          background: isActive ? 'rgba(29,78,216,0.06)' : 'white',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>{job.title ?? 'Untitled job'}</div>
                        <div style={{ marginTop: '0.2rem', color: '#94a3b8', fontSize: '0.78rem' }}>{job.department ?? 'General'} · {job.location ?? 'Remote'}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                {selectedJob ? (
                  <CandidateOverviewClient jobId={String(selectedJob.id ?? selectedJob._id ?? '')} />
                ) : (
                  <div style={{ padding: '2rem', background: 'white', borderRadius: '14px', border: '1px solid rgba(148,163,184,0.15)', color: '#94a3b8', fontSize: '0.9rem' }}>
                    Select a job on the left to load applicants.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Company tab */}
          {activeTab === 'company' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                  {isEditing ? 'Edit company profile' : 'Company profile'}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  {updateError && <span style={{ color: '#b91c1c', fontWeight: 700, fontSize: '0.85rem' }}>{updateError}</span>}
                  {isEditing ? (
                    <>
                      <button type="button" onClick={handleCancel} className="tp-btn-secondary" style={{ cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
                      <button type="button" onClick={handleSave} disabled={updateLoading} className="tp-btn-primary" style={{ cursor: updateLoading ? 'not-allowed' : 'pointer', fontSize: '0.85rem' }}>
                        {updateLoading ? 'Saving…' : 'Save changes'}
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setIsEditing(true)} className="tp-btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                      <Pencil size={13} />
                      Edit
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
                {/* Left: identity + details */}
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ padding: '1.25rem', background: 'white', borderRadius: '16px', border: '1px solid rgba(148,163,184,0.15)' }}>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Identity</p>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      {[
                        { label: 'Company name', editKey: 'companyName' as const, viewVal: companyName, editable: true },
                        { label: 'Role / title', editKey: 'yourRole' as const, viewVal: recruiterRole, editable: true },
                      ].map(({ label, editKey, viewVal, editable }) => (
                        <div key={label} style={{ display: 'grid', gap: '0.25rem' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>{label}</label>
                          {isEditing && editable ? (
                            <input value={editForm[editKey]} onChange={(e) => setEditForm((p) => ({ ...p, [editKey]: e.target.value }))} placeholder={label} style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', fontSize: '0.92rem', fontFamily: 'inherit' }} />
                          ) : (
                            <div style={{ fontSize: '0.92rem', color: '#0f172a', fontWeight: 500 }}>{viewVal}</div>
                          )}
                        </div>
                      ))}
                      <div style={{ display: 'grid', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Full name</label>
                        <div style={{ fontSize: '0.92rem', color: '#475569' }}>{`${state.user?.profile?.firstName ?? ''} ${state.user?.profile?.lastName ?? ''}`.trim() || 'Unknown'}</div>
                      </div>
                      <div style={{ display: 'grid', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Email</label>
                        <div style={{ fontSize: '0.92rem', color: '#475569' }}>{state.user?.email ?? 'Unknown'}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '1.25rem', background: 'white', borderRadius: '16px', border: '1px solid rgba(148,163,184,0.15)' }}>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Details</p>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      <div style={{ display: 'grid', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Website</label>
                        {isEditing ? (
                          <input value={editForm.companyWebsite} onChange={(e) => setEditForm((p) => ({ ...p, companyWebsite: e.target.value }))} placeholder="https://www.company.com" style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', fontSize: '0.92rem', fontFamily: 'inherit' }} />
                        ) : (
                          <div style={{ fontSize: '0.92rem', color: '#475569' }}>{companyWebsite}</div>
                        )}
                      </div>
                      <div style={{ display: 'grid', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Industry</label>
                        {isEditing ? (
                          <Select value={editForm.industry} onValueChange={(v) => setEditForm((p) => ({ ...p, industry: v }))} ariaLabel="Industry" placeholder="Select industry" options={COMPANY_INDUSTRY_OPTIONS.map((v) => ({ value: v, label: v }))} triggerClassName="tp-card" triggerStyle={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)' }} />
                        ) : (
                          <div style={{ fontSize: '0.92rem', color: '#475569' }}>{industry}</div>
                        )}
                      </div>
                      <div style={{ display: 'grid', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Company size</label>
                        {isEditing ? (
                          <Select value={editForm.companySize} onValueChange={(v) => setEditForm((p) => ({ ...p, companySize: v }))} ariaLabel="Company size" placeholder="Select company size" options={COMPANY_SIZE_OPTIONS.map((v) => ({ value: v, label: `${v} employees` }))} triggerClassName="tp-card" triggerStyle={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)' }} />
                        ) : (
                          <div style={{ fontSize: '0.92rem', color: '#475569' }}>{`${companySize} people`}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: narrative */}
                <div style={{ padding: '1.25rem', background: 'white', borderRadius: '16px', border: '1px solid rgba(148,163,184,0.15)' }}>
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>About</p>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ display: 'grid', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Company overview</label>
                      {isEditing ? (
                        <textarea value={editForm.companyOverview} onChange={(e) => setEditForm((p) => ({ ...p, companyOverview: e.target.value }))} placeholder="Describe your company..." rows={4} style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.92rem' }} />
                      ) : (
                        <p style={{ margin: 0, color: '#475569', lineHeight: 1.65, fontSize: '0.92rem' }}>{companyOverview}</p>
                      )}
                    </div>
                    <div style={{ display: 'grid', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Primary hiring needs</label>
                      {isEditing ? (
                        <input value={editForm.primaryHiringNeeds} onChange={(e) => setEditForm((p) => ({ ...p, primaryHiringNeeds: e.target.value }))} placeholder="e.g. Engineering, Design, Sales (comma-separated)" style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', fontSize: '0.92rem', fontFamily: 'inherit' }} />
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {memoPrimaryHiringNeeds.length > 0 ? memoPrimaryHiringNeeds.map((need) => (
                            <span key={need} className="tp-chip" style={{ background: '#dbeafe', fontSize: '0.8rem' }}>{need}</span>
                          )) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>No hiring needs added yet.</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'grid', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Benefits & opportunities</label>
                      {isEditing ? (
                        <textarea value={editForm.benefitsAndOpportunities} onChange={(e) => setEditForm((p) => ({ ...p, benefitsAndOpportunities: e.target.value }))} placeholder="Describe benefits, perks, and what makes your company stand out..." rows={4} style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.92rem' }} />
                      ) : (
                        <p style={{ margin: 0, color: '#475569', lineHeight: 1.65, fontSize: '0.92rem' }}>{benefits}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Edit job modal */}
      {editingJob && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.48)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem', zIndex: 2000, overflowY: 'auto' }}>
          <div className="tp-card-soft" style={{ width: '100%', maxWidth: '640px', borderRadius: '20px', padding: '1.75rem', background: 'white', boxShadow: '0 40px 100px rgba(2,6,23,0.26)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <div className="tp-kicker">Editing</div>
                <h2 style={{ margin: '0.25rem 0 0', fontSize: '1.6rem', letterSpacing: '-0.04em' }}>{editingJob.title ?? 'Untitled job'}</h2>
              </div>
              <button type="button" onClick={() => setEditingJob(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--tp-muted)', padding: '0.25rem', borderRadius: '8px', display: 'grid', placeItems: 'center' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSave} style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--tp-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Job title</label>
                  <input required value={editJobForm.title} onChange={(e) => setEditJobForm((p) => ({ ...p, title: e.target.value }))} placeholder="Job title" className="tp-card" style={{ width: '100%', boxSizing: 'border-box', padding: '0.85rem 0.95rem', borderRadius: '12px', border: '1px solid rgba(148,163,184,0.2)' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--tp-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Department</label>
                  <select value={editJobForm.department} onChange={(e) => setEditJobForm((p) => ({ ...p, department: e.target.value }))} style={{ width: '100%', padding: '0.85rem 0.95rem', borderRadius: '12px', border: '1px solid rgba(148,163,184,0.2)', background: '#f8fafc', cursor: 'pointer', fontSize: '1rem' }}>
                    {['ENGINEERING', 'MARKETING', 'HR', 'SALES', 'DESIGN'].map((d) => (
                      <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--tp-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Employment type</label>
                  <select value={editJobForm.employmentType} onChange={(e) => setEditJobForm((p) => ({ ...p, employmentType: e.target.value }))} style={{ width: '100%', padding: '0.85rem 0.95rem', borderRadius: '12px', border: '1px solid rgba(148,163,184,0.2)', background: '#f8fafc', cursor: 'pointer', fontSize: '1rem' }}>
                    <option value="FULL_TIME">Full time</option>
                    <option value="PART_TIME">Part time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--tp-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</label>
                  <select value={editJobForm.status} onChange={(e) => setEditJobForm((p) => ({ ...p, status: e.target.value }))} style={{ width: '100%', padding: '0.85rem 0.95rem', borderRadius: '12px', border: '1px solid rgba(148,163,184,0.2)', background: '#f8fafc', cursor: 'pointer', fontSize: '1rem' }}>
                    <option value="OPEN">Open</option>
                    <option value="DRAFT">Draft</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                {/* Location: country → state → city */}
                <div style={{ gridColumn: '1 / span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ gridColumn: '1 / span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Country</label>
                    <select
                      value={editLocCountry}
                      onChange={(e) => { setEditLocCountry(e.target.value); setEditLocState(''); setEditCitiesForState(null); setEditLocCity(''); }}
                      disabled={countriesLoading}
                      style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', background: 'white', fontSize: '0.95rem', cursor: 'pointer' }}
                    >
                      {countriesLoading && <option>Loading countries…</option>}
                      {(countriesData ?? FALLBACK_COUNTRIES).map((c) => (
                        <option key={c.country} value={c.country}>{c.country}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>State / Province</label>
                    {editStatesForCountry ? (
                      <select value={editLocState} onChange={(e) => setEditLocState(e.target.value)} style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', background: 'white', fontSize: '0.95rem', cursor: 'pointer' }}>
                        {editStatesForCountry.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <select value={editLocCity} onChange={(e) => setEditLocCity(e.target.value)} style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', background: 'white', fontSize: '0.95rem', cursor: 'pointer' }}>
                        {((countriesData ?? FALLBACK_COUNTRIES).find((c) => c.country === editLocCountry)?.cities ?? []).map((ct) => (
                          <option key={ct} value={ct}>{ct}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {editStatesForCountry && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>City</label>
                      <select value={editLocCity} onChange={(e) => setEditLocCity(e.target.value)} style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', background: 'white', fontSize: '0.95rem', cursor: 'pointer' }}>
                        {(editCitiesForState ?? []).map((ct) => <option key={ct} value={ct}>{ct}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--tp-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Salary min</label>
                  <input type="number" value={editJobForm.salaryMin} onChange={(e) => setEditJobForm((p) => ({ ...p, salaryMin: e.target.value }))} placeholder="e.g. 60000" className="tp-card" style={{ width: '100%', boxSizing: 'border-box', padding: '0.85rem 0.95rem', borderRadius: '12px', border: '1px solid rgba(148,163,184,0.2)' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--tp-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Salary max</label>
                  <input type="number" value={editJobForm.salaryMax} onChange={(e) => setEditJobForm((p) => ({ ...p, salaryMax: e.target.value }))} placeholder="e.g. 90000" className="tp-card" style={{ width: '100%', boxSizing: 'border-box', padding: '0.85rem 0.95rem', borderRadius: '12px', border: '1px solid rgba(148,163,184,0.2)' }} />
                </div>

                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--tp-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Skills <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(comma-separated)</span></label>
                  <input value={editJobForm.skills} onChange={(e) => setEditJobForm((p) => ({ ...p, skills: e.target.value }))} placeholder="e.g. React, TypeScript, Node.js" className="tp-card" style={{ width: '100%', boxSizing: 'border-box', padding: '0.85rem 0.95rem', borderRadius: '12px', border: '1px solid rgba(148,163,184,0.2)' }} />
                </div>

                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--tp-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Description</label>
                  <textarea required value={editJobForm.description} onChange={(e) => setEditJobForm((p) => ({ ...p, description: e.target.value }))} placeholder="Job description..." rows={4} style={{ width: '100%', boxSizing: 'border-box', padding: '0.85rem 0.95rem', borderRadius: '12px', border: '1px solid rgba(148,163,184,0.2)', background: '#f8fafc', resize: 'vertical', fontFamily: 'inherit', fontSize: '1rem' }} />
                </div>

                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--tp-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Requirements</label>
                  <textarea value={editJobForm.requirements} onChange={(e) => setEditJobForm((p) => ({ ...p, requirements: e.target.value }))} placeholder="Requirements..." rows={3} style={{ width: '100%', boxSizing: 'border-box', padding: '0.85rem 0.95rem', borderRadius: '12px', border: '1px solid rgba(148,163,184,0.2)', background: '#f8fafc', resize: 'vertical', fontFamily: 'inherit', fontSize: '1rem' }} />
                </div>
              </div>

              {updateJobError && (
                <div style={{ color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem 1rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem' }}>{updateJobError}</div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
                <button type="button" onClick={() => setEditingJob(null)} className="tp-btn-secondary" style={{ cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={updatingJob} className="tp-btn-primary" style={{ cursor: updatingJob ? 'not-allowed' : 'pointer' }}>
                  {updatingJob ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create job modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.48)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem', zIndex: 2000, overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: '640px', borderRadius: '20px', padding: '1.75rem', background: 'white', boxShadow: '0 40px 100px rgba(2,6,23,0.26)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ margin: '0 0 0.2rem', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Post a job</h2>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>Fill in the details to publish a new listing.</p>
              </div>
              <button type="button" onClick={() => { setShowCreateModal(false); setLocationCountry(''); setLocationState(''); setLocationCity(''); setStatesForCountry(null); setCitiesForState(null); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8', fontSize: '1.1rem', padding: '0.2rem', borderRadius: '6px' }}>✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'grid', gap: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Job title *</label>
                  <input required value={createForm.title} onChange={(e) => setCreateForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Senior Software Engineer" style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', fontSize: '0.95rem', fontFamily: 'inherit' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Department</label>
                  <select value={createForm.department} onChange={(e) => setCreateForm((p) => ({ ...p, department: e.target.value }))} style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', background: 'white', fontSize: '0.95rem', cursor: 'pointer' }}>
                    {['ENGINEERING', 'MARKETING', 'HR', 'SALES', 'DESIGN', 'OPERATIONS'].map((d) => (
                      <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Employment type</label>
                  <select value={createForm.employmentType} onChange={(e) => setCreateForm((p) => ({ ...p, employmentType: e.target.value }))} style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', background: 'white', fontSize: '0.95rem', cursor: 'pointer' }}>
                    <option value="FULL_TIME">Full time</option>
                    <option value="PART_TIME">Part time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Status</label>
                  <select value={createForm.status} onChange={(e) => setCreateForm((p) => ({ ...p, status: e.target.value }))} style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', background: 'white', fontSize: '0.95rem', cursor: 'pointer' }}>
                    <option value="OPEN">Publish now</option>
                    <option value="DRAFT">Save as draft</option>
                  </select>
                </div>

                {/* Location: country → state → city */}
                <div style={{ gridColumn: '1 / span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ gridColumn: '1 / span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Country</label>
                    <select
                      value={locationCountry}
                      onChange={(e) => { setLocationCountry(e.target.value); setLocationState(''); setCitiesForState(null); setLocationCity(''); }}
                      disabled={countriesLoading}
                      style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', background: 'white', fontSize: '0.95rem', cursor: 'pointer' }}
                    >
                      {countriesLoading && <option>Loading countries…</option>}
                      {(countriesData ?? FALLBACK_COUNTRIES).map((c) => (
                        <option key={c.country} value={c.country}>{c.country}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>State / Province</label>
                    {statesForCountry ? (
                      <select value={locationState} onChange={(e) => setLocationState(e.target.value)} style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', background: 'white', fontSize: '0.95rem', cursor: 'pointer' }}>
                        {statesForCountry.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <select value={locationCity} onChange={(e) => setLocationCity(e.target.value)} style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', background: 'white', fontSize: '0.95rem', cursor: 'pointer' }}>
                        {((countriesData ?? FALLBACK_COUNTRIES).find((c) => c.country === locationCountry)?.cities ?? []).map((ct) => (
                          <option key={ct} value={ct}>{ct}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {statesForCountry && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>City</label>
                      <select value={locationCity} onChange={(e) => setLocationCity(e.target.value)} style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', background: 'white', fontSize: '0.95rem', cursor: 'pointer' }}>
                        {(citiesForState ?? []).map((ct) => <option key={ct} value={ct}>{ct}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Salary min</label>
                  <input type="number" value={createForm.salaryMin} onChange={(e) => setCreateForm((p) => ({ ...p, salaryMin: e.target.value }))} placeholder="e.g. 60000" style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', fontSize: '0.95rem', fontFamily: 'inherit' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Salary max</label>
                  <input type="number" value={createForm.salaryMax} onChange={(e) => setCreateForm((p) => ({ ...p, salaryMax: e.target.value }))} placeholder="e.g. 90000" style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', fontSize: '0.95rem', fontFamily: 'inherit' }} />
                </div>

                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Skills <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(comma-separated)</span></label>
                  <input value={createForm.skills} onChange={(e) => setCreateForm((p) => ({ ...p, skills: e.target.value }))} placeholder="e.g. React, TypeScript, Node.js" style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', fontSize: '0.95rem', fontFamily: 'inherit' }} />
                </div>

                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Description *</label>
                  <textarea required value={createForm.description} onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))} placeholder="Describe the role, responsibilities, and expectations..." rows={4} style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', background: '#f8fafc', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.95rem' }} />
                </div>

                <div style={{ gridColumn: '1 / span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Requirements</label>
                  <textarea value={createForm.requirements} onChange={(e) => setCreateForm((p) => ({ ...p, requirements: e.target.value }))} placeholder="List must-have qualifications and experience..." rows={3} style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.25)', background: '#f8fafc', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.95rem' }} />
                </div>
              </div>

              {createError && (
                <div style={{ color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem 1rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem' }}>{createError}</div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.25rem' }}>
                <button type="button" onClick={() => { setShowCreateModal(false); setLocationCountry(''); setLocationState(''); setLocationCity(''); setStatesForCountry(null); setCitiesForState(null); }} className="tp-btn-secondary" style={{ cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={creating} className="tp-btn-primary" style={{ cursor: creating ? 'not-allowed' : 'pointer' }}>
                  {creating ? 'Posting…' : createForm.status === 'DRAFT' ? 'Save draft' : 'Post job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default EmployerDashboard;