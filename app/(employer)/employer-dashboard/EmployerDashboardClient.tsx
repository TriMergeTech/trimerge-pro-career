"use client"

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@/contexts/userContext/userContext';
import useGetEmployer from '@/hooks/useGetEmployer';
import { useGetJobs } from '@/hooks/useGetJobs';

type JobRecord = {
  id?: number | string;
  _id?: string;
  title?: string;
  employerId?: string;
  status?: string;
};

export default function EmployerDashboardClient() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get('jobId') ?? '';

  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const { state } = useUser();
  const { data: userData } = useGetEmployer();
  const { fetchJobs } = useGetJobs();
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // userData shape is dynamic — coerce to a record for safe indexing
  const profile = (userData as Record<string, any> | null)?.profile ?? ({} as Record<string, any>);
  const companyName = String(profile['companyName'] ?? 'Your company');

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
      // avoid synchronous setState in effect
      setTimeout(() => setSelectedJobId(String(employerJobs[0].id ?? employerJobs[0]._id ?? '')), 0);
    }
  }, [employerJobs, selectedJobId]);

  const metrics = useMemo(() => ({
    totalJobs: employerJobs.length,
    openJobs: employerJobs.filter((job) => String(job.status ?? '').toUpperCase() === 'OPEN').length,
  }), [employerJobs]);

  return (
    <div style={{ minHeight: '80vh', background: 'linear-gradient(180deg, #f7faff 0%, #eef4fb 48%, #eaf1f9 100%)' }}>
      <div className="tp-container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="tp-card-soft" style={{ padding: '1.25rem' }}>
          <div className="tp-kicker">Employer dashboard</div>
          <h1 style={{ marginTop: '0.5rem' }}>{companyName}</h1>
          <div style={{ marginTop: 12 }}>Manage your jobs here.</div>
          <div style={{ marginTop: 12 }}>{loadingJobs ? 'Loading jobs...' : `${metrics.totalJobs} jobs`}</div>
        </div>
      </div>
    </div>
  );
}
