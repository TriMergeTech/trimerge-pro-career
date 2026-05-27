import { useUser } from '@/contexts/userContext/userContext';
import { MapPin, Briefcase, ArrowRight } from 'lucide-react';

interface JobCardProps {
  id: number;
  title: string;
  department: string;
  location: string;
  isNew: boolean;
  description: string;
  onClick: () => void;
  fullWidth?: boolean;
}

export function JobCard({ title, department, location, isNew, description, onClick, fullWidth }: JobCardProps) {
  const { state } = useUser();

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100 group${fullWidth ? ' w-full' : ' max-w-[70rem]'}`}
      style={{
        padding: 24,
        position: 'relative',
        width: fullWidth ? '100%' : undefined,
        maxWidth: fullWidth ? 'none' : 1120,
        background: 'linear-gradient(135deg, #f8fafc 0%, #fff 100%)',
        border: '1.5px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(30,58,138,0.03)',
        borderRadius: "1rem"
      }}
    >
      {isNew && (
        <span
          style={{ background: '#FF5F1F', color: '#fff', borderRadius: 9999, fontSize: '0.75rem', paddingLeft: 12, paddingRight: 12, paddingTop: 4, paddingBottom: 4, position: 'absolute', top: 16, right: 16, boxShadow: '0 2px 8px rgba(255,95,31,0.10)' }}
        >
          New Posting
        </span>
      )}
      <h3
        style={{
          marginBottom: 12,
          paddingRight: 96,
          transition: 'color 0.2s',
          fontSize: 22,
          fontWeight: 700,
          color: '#1E293B',
          letterSpacing: '-0.5px',
          lineHeight: 1.2,
          textShadow: '0 1px 0 #f1f5f9',
        }}
        className="group-hover:text-[#FF5F1F]"
      >
        {title}
      </h3>
      <div
        style={{ color: '#4B5563', fontSize: '0.95rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Briefcase className="w-4 h-4" />
          <span>{department}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
      </div>
      <p style={{ color: '#64748B', fontSize: '0.97rem', marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 400 }}>{description}</p>
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          onClick();
        }}
        style={{ width: '100%', background: '#FF5F1F', color: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: 24, paddingRight: 24, paddingTop: 12, paddingBottom: 12, gap: 8, transition: 'background 0.2s', fontWeight: 600, fontSize: '1rem', boxShadow: '0 1px 4px rgba(255,95,31,0.07)' }}
        className="group-hover:bg-[#E55519]"
      >
        {state.user?.accountType === 'EMPLOYER' ?  'View Job Details' : 'Apply Now'}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
