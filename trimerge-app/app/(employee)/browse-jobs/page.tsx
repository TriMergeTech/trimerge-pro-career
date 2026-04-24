"use client"


import React, { useState } from 'react';
import { JobCard } from '@/app/components/ui/JobCard';
import { JobDetailDrawer } from '@/app/components/ui/JobDetailDrawer';
import { Tag } from 'lucide-react';

function BrowseJobs() {
  interface Job {
    id: number;
    title: string;
    department: string;
    location: string;
    isNew: boolean;
    description: string;
    salary?: string;
    postedDate?: string;
  }

  const mockJobs: Job[] = [
    {
      id: 1,
      title: 'Senior Frontend Engineer',
      department: 'Engineering',
      location: 'Remote',
      isNew: true,
      description: 'Build beautiful user interfaces using React and TypeScript. Work with a talented team to create exceptional user experiences.',
      salary: '$120k - $160k',
      postedDate: 'Today',
    },
    {
      id: 2,
      title: 'Product Marketing Manager',
      department: 'Marketing',
      location: 'Hybrid',
      isNew: true,
      description: 'Drive product launches and market strategy. Collaborate with product and sales teams to achieve business goals.',
      salary: '$100k - $140k',
      postedDate: '1 day ago',
    },
    {
      id: 3,
      title: 'UX Designer',
      department: 'Design',
      location: 'On-site',
      isNew: false,
      description: 'Create intuitive and delightful user experiences. Conduct user research and translate insights into compelling designs.',
      salary: '$90k - $130k',
      postedDate: '3 days ago',
    },
    {
      id: 4,
      title: 'HR Business Partner',
      department: 'HR',
      location: 'On-site',
      isNew: false,
      description: 'Partner with business leaders to develop and execute people strategies that drive organizational success.',
      salary: '$85k - $115k',
      postedDate: '5 days ago',
    },
    {
      id: 5,
      title: 'Data Analyst',
      department: 'Engineering',
      location: 'Remote',
      isNew: false,
      description: 'Transform data into actionable insights. Build dashboards and reports to support data-driven decision making.',
      salary: '$95k - $125k',
      postedDate: '1 week ago',
    },
    {
      id: 6,
      title: 'Sales Development Rep',
      department: 'Sales',
      location: 'Hybrid',
      isNew: false,
      description: 'Generate new business opportunities and build relationships with potential customers.',
      salary: '$60k - $80k + commission',
      postedDate: '1 week ago',
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Engineering', 'Marketing', 'HR', 'Sales', 'Design', 'Operations'];

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All Departments' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'All Locations' || job.location === selectedLocation;
    const matchesCategory = activeCategory === 'All' || job.department === activeCategory;

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
            {filteredJobs.map((job) => (
              <JobCard key={job.id} {...job} onClick={() => setSelectedJob(job)} fullWidth />
            ))}
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
            <JobDetailDrawer job={selectedJob} onClose={() => setSelectedJob(null)} />
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowseJobs;