"use client";

import { useState } from 'react';
import { Briefcase, Users, FileText, Edit2, Trash2, Plus, TrendingUp, Copy, Archive, Eye, Send } from 'lucide-react';
import { ActionMenu } from '@/app/components/ui/ActionMenu';
import { CreateListingModal } from '@/app/components/ui/CreateListingModal';

interface JobListing {
  id: number;
  title: string;
  department: string;
  applicants: number;
  status: 'active' | 'draft';
  postedDate: string;
}

const mockListings: JobListing[] = [
  { id: 1, title: 'Senior Frontend Engineer', department: 'Engineering', applicants: 24, status: 'active', postedDate: '2026-04-20' },
  { id: 2, title: 'Product Marketing Manager', department: 'Marketing', applicants: 18, status: 'active', postedDate: '2026-04-19' },
  { id: 3, title: 'UX Designer', department: 'Design', applicants: 31, status: 'active', postedDate: '2026-04-17' },
  { id: 4, title: 'Data Scientist', department: 'Engineering', applicants: 0, status: 'draft', postedDate: '2026-04-15' },
  { id: 5, title: 'HR Business Partner', department: 'HR', applicants: 12, status: 'active', postedDate: '2026-04-15' },
];

export function EmployerDashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [listings, setListings] = useState(mockListings);

  const activeListings = listings.filter(l => l.status === 'active');
  const draftListings = listings.filter(l => l.status === 'draft');
  const totalApplicants = activeListings.reduce((sum, l) => sum + l.applicants, 0);
  const pendingReviews = Math.floor(totalApplicants * 0.4);

  const handleDeleteListing = (id: number) => {
    setListings(listings.filter(l => l.id !== id));
  };

  const handleDuplicateListing = (id: number) => {
    const listing = listings.find(l => l.id === id);
    if (listing) {
      const newListing = {
        ...listing,
        id: Math.max(...listings.map(l => l.id)) + 1,
        title: `${listing.title} (Copy)`,
        status: 'draft' as const,
        applicants: 0,
        postedDate: new Date().toISOString().split('T')[0],
      };
      setListings([...listings, newListing]);
    }
  };

  const handleArchiveListing = (id: number) => {
    console.log('Archiving listing:', id);
    handleDeleteListing(id);
  };

  const handleViewApplicants = (id: number) => {
    console.log('Viewing applicants for:', id);
  };

  const handlePublishDraft = (id: number) => {
    setListings(listings.map(l =>
      l.id === id ? { ...l, status: 'active' as const } : l
    ));
  };

  return (
    <div style={{ flex: '1 1 0%', backgroundColor: '#F4F4F9', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #E5E7EB', padding: '24px' }}>
        <div style={{ maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '1.875rem', lineHeight: '2.25rem', fontWeight: 700, color: '#111827' }}>Employer Dashboard</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{ 
              backgroundColor: '#FF5F1F', 
              color: '#ffffff', 
              paddingLeft: '24px', 
              paddingRight: '24px', 
              paddingTop: '12px', 
              paddingBottom: '12px', 
              borderRadius: '0.5rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Plus className="w-5 h-5" />
            Create New Listing
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto', padding: '24px' }}>
        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          
          {/* Active Listings Stat */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '24px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ padding: '12px', backgroundColor: 'rgba(255, 95, 31, 0.1)', borderRadius: '0.5rem' }}>
                <Briefcase style={{ width: '24px', height: '24px', color: '#FF5F1F' }} />
              </div>
              <TrendingUp style={{ width: '20px', height: '20px', color: '#10B981' }} />
            </div>
            <div style={{ fontSize: '1.875rem', lineHeight: '2.25rem', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{activeListings.length}</div>
            <div style={{ color: '#4B5563', fontSize: '0.875rem' }}>Active Listings</div>
          </div>

          {/* Total Applicants Stat */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '24px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ padding: '12px', backgroundColor: 'rgba(255, 95, 31, 0.1)', borderRadius: '0.5rem' }}>
                <Users style={{ width: '24px', height: '24px', color: '#FF5F1F' }} />
              </div>
              <TrendingUp style={{ width: '20px', height: '20px', color: '#10B981' }} />
            </div>
            <div style={{ fontSize: '1.875rem', lineHeight: '2.25rem', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{totalApplicants}</div>
            <div style={{ color: '#4B5563', fontSize: '0.875rem' }}>Total Applicants</div>
          </div>

          {/* Pending Reviews Stat */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '24px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ padding: '12px', backgroundColor: 'rgba(255, 95, 31, 0.1)', borderRadius: '0.5rem' }}>
                <FileText style={{ width: '24px', height: '24px', color: '#FF5F1F' }} />
              </div>
              <div style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '4px', paddingBottom: '4px', backgroundColor: '#FFEDD5', color: '#FF5F1F', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 500 }}>Urgent</div>
            </div>
            <div style={{ fontSize: '1.875rem', lineHeight: '2.25rem', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{pendingReviews}</div>
            <div style={{ color: '#4B5563', fontSize: '0.875rem' }}>Pending Reviews</div>
          </div>
        </div>

        {/* Table Section */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #F3F4F6', marginBottom: '24px', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #F3F4F6' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>Active Job Postings</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#F4F4F9' }}>
                <tr>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.875rem', color: '#4B5563', fontWeight: 500 }}>Job Title</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.875rem', color: '#4B5563', fontWeight: 500 }}>Department</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.875rem', color: '#4B5563', fontWeight: 500 }}>Applicants</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.875rem', color: '#4B5563', fontWeight: 500 }}>Posted Date</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.875rem', color: '#4B5563', fontWeight: 500 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeListings.map((listing) => (
                  <tr key={listing.id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                    <td style={{ padding: '16px 24px', color: '#111827', fontWeight: 500 }}>{listing.title}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ padding: '4px 12px', backgroundColor: 'rgba(255, 95, 31, 0.1)', color: '#FF5F1F', borderRadius: '9999px', fontSize: '0.875rem' }}>
                        {listing.department}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users style={{ width: '16px', height: '16px', color: '#9CA3AF' }} />
                        <span style={{ color: '#374151' }}>{listing.applicants}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', color: '#4B5563', fontSize: '0.875rem' }}>{listing.postedDate}</td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <ActionMenu
                        items={[
                          { label: 'View Applicants', icon: <Eye className="w-4 h-4" />, onClick: () => handleViewApplicants(listing.id) },
                          { label: 'Edit Listing', icon: <Edit2 className="w-4 h-4" />, onClick: () => console.log('Edit', listing.id) },
                          { label: 'Duplicate', icon: <Copy className="w-4 h-4" />, onClick: () => handleDuplicateListing(listing.id) },
                          { label: 'Archive', icon: <Archive className="w-4 h-4" />, onClick: () => handleArchiveListing(listing.id) },
                          { label: 'Delete', icon: <Trash2 className="w-4 h-4" />, onClick: () => handleDeleteListing(listing.id), variant: 'danger' },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drafts Section */}
        {draftListings.length > 0 && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #F3F4F6', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #F3F4F6' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>Drafts</h3>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {draftListings.map((listing) => (
                  <div key={listing.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#F4F4F9', borderRadius: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 500, color: '#111827' }}>{listing.title}</div>
                      <div style={{ fontSize: '0.875rem', color: '#4B5563' }}>{listing.department}</div>
                    </div>
                    <ActionMenu
                      items={[
                        { label: 'Continue Editing', icon: <Edit2 className="w-4 h-4" />, onClick: () => console.log('Continue editing', listing.id) },
                        { label: 'Publish Now', icon: <Send className="w-4 h-4" />, onClick: () => handlePublishDraft(listing.id) },
                        { label: 'Duplicate', icon: <Copy className="w-4 h-4" />, onClick: () => handleDuplicateListing(listing.id) },
                        { label: 'Delete Draft', icon: <Trash2 className="w-4 h-4" />, onClick: () => handleDeleteListing(listing.id), variant: 'danger' },
                      ]}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showCreateModal && <CreateListingModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}

export default EmployerDashboard;