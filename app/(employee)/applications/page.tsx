"use client"

import { Calendar, Briefcase, MapPin, Clock, CheckCircle2, XCircle, AlertCircle, Download, MessageSquare } from 'lucide-react';

interface Application {
  id: number;
  jobTitle: string;
  department: string;
  location: string;
  appliedDate: string;
  status: 'under_review' | 'interview_scheduled' | 'rejected' | 'accepted';
  lastUpdate: string;
  interviewer?: string;
  interviewDate?: string;
}

const mockApplications: Application[] = [
  {
    id: 1,
    jobTitle: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    appliedDate: '2026-04-18',
    status: 'interview_scheduled',
    lastUpdate: '2 hours ago',
    interviewer: 'Sarah Chen',
    interviewDate: '2026-04-23 at 2:00 PM',
  },
  {
    id: 2,
    jobTitle: 'Product Marketing Manager',
    department: 'Marketing',
    location: 'Hybrid',
    appliedDate: '2026-04-15',
    status: 'under_review',
    lastUpdate: '1 day ago',
  },
  {
    id: 3,
    jobTitle: 'UX Designer',
    department: 'Design',
    location: 'On-site',
    appliedDate: '2026-04-10',
    status: 'rejected',
    lastUpdate: '3 days ago',
  },
  {
    id: 4,
    jobTitle: 'Data Analyst',
    department: 'Engineering',
    location: 'Remote',
    appliedDate: '2026-04-05',
    status: 'accepted',
    lastUpdate: '1 week ago',
  },
];

const statusConfig = {
  under_review: {
    label: 'Under Review',
    icon: Clock,
    color: 'bg-blue-100 text-blue-700',
    iconColor: 'text-blue-600',
  },
  interview_scheduled: {
    label: 'Interview Scheduled',
    icon: Calendar,
    color: 'bg-[#FF5F1F]/10 text-[#FF5F1F]',
    iconColor: 'text-[#FF5F1F]',
  },
  rejected: {
    label: 'Not Selected',
    icon: XCircle,
    color: 'bg-gray-100 text-gray-700',
    iconColor: 'text-gray-600',
  },
  accepted: {
    label: 'Offer Extended',
    icon: CheckCircle2,
    color: 'bg-green-100 text-green-700',
    iconColor: 'text-green-600',
  },
};

export function MyApplications() {
  const activeApplications = mockApplications.filter(
    (app) => app.status !== 'rejected' && app.status !== 'accepted'
  );
  const pastApplications = mockApplications.filter(
    (app) => app.status === 'rejected' || app.status === 'accepted'
  );

  return (
    <div style={{ flex: 1, background: '#F4F4F9', overflowY: 'auto', maxHeight: '90vh' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: 24 }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <h1 style={{ marginBottom: 8 }}>My Applications</h1>
          <p style={{ color: '#64748B' }}>Track the status of your internal job applications</p>
        </div>
      </div>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 32 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(30,58,138,0.03)', border: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ padding: 12, background: 'rgba(255,95,31,0.08)', borderRadius: 12 }}>
                <Briefcase className="w-6 h-6 text-[#FF5F1F]" />
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>{activeApplications.length}</div>
            <div style={{ color: '#64748B', fontSize: 14 }}>Active Applications</div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(30,58,138,0.03)', border: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ padding: 12, background: '#D1FAE5', borderRadius: 12 }}>
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>
              {mockApplications.filter((a) => a.status === 'interview_scheduled').length}
            </div>
            <div style={{ color: '#64748B', fontSize: 14 }}>Interviews Scheduled</div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(30,58,138,0.03)', border: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ padding: 12, background: '#DBEAFE', borderRadius: 12 }}>
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>
              {mockApplications.filter((a) => a.status === 'under_review').length}
            </div>
            <div style={{ color: '#64748B', fontSize: 14 }}>Pending Review</div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h2 style={{ marginBottom: 16 }}>Active Applications</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {activeApplications.map((app) => {
              const status = statusConfig[app.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={app.id}
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    padding: 24,
                    boxShadow: '0 1px 4px rgba(30,58,138,0.03)',
                    border: '1px solid #F1F5F9',
                    transition: 'box-shadow 0.2s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,58,138,0.08)')}
                  onMouseOut={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(30,58,138,0.03)')}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ marginBottom: 8 }}>{app.jobTitle}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 15, color: '#64748B' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Briefcase className="w-4 h-4" />
                          <span>{app.department}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <MapPin className="w-4 h-4" />
                          <span>{app.location}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '8px 16px', borderRadius: 9999, display: 'flex', alignItems: 'center', gap: 8, background: status.color.includes('bg-[#FF5F1F]') ? 'rgba(255,95,31,0.10)' : status.color.includes('bg-blue-100') ? '#DBEAFE' : status.color.includes('bg-green-100') ? '#D1FAE5' : status.color.includes('bg-gray-100') ? '#F3F4F6' : '#fff', color: status.color.includes('text-[#FF5F1F]') ? '#FF5F1F' : status.color.includes('text-blue-700') ? '#1D4ED8' : status.color.includes('text-green-700') ? '#15803D' : status.color.includes('text-gray-700') ? '#374151' : '#374151' }}>
                      <StatusIcon className="w-4 h-4" />
                      <span style={{ fontSize: 14 }}>{status.label}</span>
                    </div>
                  </div>

                  {app.status === 'interview_scheduled' && (
                    <div style={{ background: 'rgba(255,95,31,0.05)', border: '1px solid rgba(255,95,31,0.20)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <Calendar className="w-5 h-5 text-[#FF5F1F]" style={{ marginTop: 2 }} />
                        <div>
                          <div style={{ fontWeight: 500, color: '#0F172A', marginBottom: 4 }}>Interview Details</div>
                          <div style={{ fontSize: 15, color: '#374151' }}>
                            Scheduled with {app.interviewer} on {app.interviewDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: 15, color: '#64748B' }}>
                      Applied on {app.appliedDate} · Updated {app.lastUpdate}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button style={{ padding: '8px 16px', color: '#374151', background: 'none', border: 'none', borderRadius: 8, transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, cursor: 'pointer' }} onMouseOver={e => (e.currentTarget.style.background = '#F4F4F9')} onMouseOut={e => (e.currentTarget.style.background = 'none')}>
                        <Download className="w-4 h-4" />
                        View Application
                      </button>
                      <button style={{ padding: '8px 16px', background: '#FF5F1F', color: '#fff', border: 'none', borderRadius: 8, transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 500, cursor: 'pointer' }} onMouseOver={e => (e.currentTarget.style.background = '#E55519')} onMouseOut={e => (e.currentTarget.style.background = '#FF5F1F')}>
                        <MessageSquare className="w-4 h-4" />
                        Contact HR
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {pastApplications.length > 0 && (
          <div>
            <h3 style={{ marginBottom: 16 }}>Past Applications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {pastApplications.map((app) => {
                const status = statusConfig[app.status];
                const StatusIcon = status.icon;

                return (
                  <div
                    key={app.id}
                    style={{
                      background: '#fff',
                      borderRadius: 16,
                      padding: 24,
                      boxShadow: '0 1px 4px rgba(30,58,138,0.03)',
                      border: '1px solid #F1F5F9',
                      opacity: 0.75,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ marginBottom: 8 }}>{app.jobTitle}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 15, color: '#64748B' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Briefcase className="w-4 h-4" />
                            <span>{app.department}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <MapPin className="w-4 h-4" />
                            <span>{app.location}</span>
                          </div>
                          <div style={{ fontSize: 13 }}>Applied {app.appliedDate}</div>
                        </div>
                      </div>
                      <div style={{ padding: '8px 16px', borderRadius: 9999, display: 'flex', alignItems: 'center', gap: 8, background: status.color.includes('bg-[#FF5F1F]') ? 'rgba(255,95,31,0.10)' : status.color.includes('bg-blue-100') ? '#DBEAFE' : status.color.includes('bg-green-100') ? '#D1FAE5' : status.color.includes('bg-gray-100') ? '#F3F4F6' : '#fff', color: status.color.includes('text-[#FF5F1F]') ? '#FF5F1F' : status.color.includes('text-blue-700') ? '#1D4ED8' : status.color.includes('text-green-700') ? '#15803D' : status.color.includes('text-gray-700') ? '#374151' : '#374151' }}>
                        <StatusIcon className="w-4 h-4" />
                        <span style={{ fontSize: 14 }}>{status.label}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyApplications