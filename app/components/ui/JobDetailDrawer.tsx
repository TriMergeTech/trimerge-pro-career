import { X, MapPin, Briefcase, Calendar, DollarSign, Users } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  isNew: boolean;
  description: string;
  salary?: string;
  postedDate?: string;
  fullDescription?: string;
}

import React, { useEffect, useRef, useState } from 'react';

interface JobDetailDrawerProps {
  job: Job | null;
  onClose: () => void;
}

export function JobDetailDrawer({ job, onClose }: JobDetailDrawerProps) {
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(!!job);
  const drawerRef = useRef<HTMLDivElement>(null);

  // When job changes, show the drawer
  useEffect(() => {
    if (job) {
      setShouldRender(true);
      setTimeout(() => setVisible(true), 10); // allow mount before animating in
    } else {
      setVisible(false);
      // Wait for animation to finish before unmounting
      setTimeout(() => setShouldRender(false), 300);
    }
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
        {job.isNew && (
          <span style={{ display: 'inline-block', background: '#FF5F1F', color: '#fff', padding: '8px 16px', borderRadius: 9999, fontSize: '0.875rem', marginBottom: 16 }}>
            New Posting
          </span>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: '#F4F4F9', borderRadius: 12 }}>
            <Briefcase className="w-5 h-5 text-[#FF5F1F]" />
            <div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Department</div>
              <div>{job.department}</div>
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
              <div>{job.salary || '$80k - $120k'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: '#F4F4F9', borderRadius: 12 }}>
            <Calendar className="w-5 h-5 text-[#FF5F1F]" />
            <div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Posted</div>
              <div>{job.postedDate || '2 days ago'}</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Job Description</h3>
          <p style={{ color: '#374151', lineHeight: 1.6, marginBottom: 16 }}>{job.description}</p>
          <p style={{ color: '#374151', lineHeight: 1.6 }}>
            {job.fullDescription || 'We are looking for a talented individual to join our team and contribute to exciting projects. You will work closely with cross-functional teams to deliver high-quality results and drive innovation within the organization.'}
          </p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Key Responsibilities</h3>
          <ul style={{ color: '#374151', listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, background: '#FF5F1F', borderRadius: '50%', marginTop: 8 }} />
              <span>Lead and execute strategic initiatives aligned with company goals</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, background: '#FF5F1F', borderRadius: '50%', marginTop: 8 }} />
              <span>Collaborate with cross-functional teams to achieve project milestones</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, background: '#FF5F1F', borderRadius: '50%', marginTop: 8 }} />
              <span>Mentor and support junior team members</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, background: '#FF5F1F', borderRadius: '50%', marginTop: 8 }} />
              <span>Drive continuous improvement and innovation</span>
            </li>
          </ul>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 16 }}>Qualifications</h3>
          <ul style={{ color: '#374151', listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, background: '#FF5F1F', borderRadius: '50%', marginTop: 8 }} />
              <span>5+ years of relevant experience</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, background: '#FF5F1F', borderRadius: '50%', marginTop: 8 }} />
              <span>Strong communication and leadership skills</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, background: '#FF5F1F', borderRadius: '50%', marginTop: 8 }} />
              <span>Proven track record of successful project delivery</span>
            </li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ flex: 1, background: '#FF5F1F', color: '#fff', padding: '16px 24px', borderRadius: 12, transition: 'background 0.2s' }}>
            Apply for This Position
          </button>
          <button style={{ padding: '16px 24px', border: '2px solid #FF5F1F', color: '#FF5F1F', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}>
            <Users className="w-5 h-5" />
            Refer a Friend
          </button>
        </div>
      </div>
    </div>
  );
}
