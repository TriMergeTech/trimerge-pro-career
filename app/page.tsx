"use client"

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, MapPin, Briefcase, Code, Shield, Cloud, 
  Database, Network, Server, ChevronRight, Building2, 
  Clock, DollarSign, CheckCircle, Users, Award, 
  TrendingUp 
} from 'lucide-react';

const jobListings = [
  { id: 1, title: 'Senior Cloud Architect', category: 'Cloud', location: 'Tallahassee, FL', type: 'Full-time', salary: '$120k - $160k', client: 'Florida Dept. of Technology', clearance: 'Secret', posted: '2 days ago' },
  { id: 2, title: 'Cybersecurity Analyst', category: 'Security', location: 'Miami, FL', type: 'Contract', salary: '$95k - $125k', client: 'Enterprise Healthcare System', clearance: 'None', posted: '1 week ago' },
  { id: 3, title: 'DevOps Engineer', category: 'DevOps', location: 'Tampa, FL', type: 'Full-time', salary: '$105k - $140k', client: 'State Transportation Agency', clearance: 'Public Trust', posted: '3 days ago' },
  { id: 4, title: 'Full Stack Developer', category: 'Development', location: 'Orlando, FL', type: 'Contract-to-Hire', salary: '$85k - $115k', client: 'County Government', clearance: 'None', posted: '5 days ago' },
];

const categories = [
  { name: 'Cloud', icon: Cloud, count: 45, color: '#3b82f6' },
  { name: 'Security', icon: Shield, count: 38, color: '#ef4444' },
  { name: 'DevOps', icon: Server, count: 32, color: '#22c55e' },
  { name: 'Development', icon: Code, count: 56, color: '#a855f7' },
  { name: 'Database', icon: Database, count: 28, color: '#eab308' },
  { name: 'Network', icon: Network, count: 24, color: '#6366f1' },
];

export default function Home() {
  return (
    <div style={{ minHeight: '100 screen', backgroundColor: 'white', color: '#111827', WebkitFontSmoothing: 'antialiased' }}>
      {/* Hero Section */}
      <section style={{ position: 'relative', overflow: 'hidden', paddingTop: '6rem', paddingBottom: '6rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#e0e7ff', zIndex: 0 }}></div>
        <div style={{ maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto', position: 'relative', zIndex: 10 }}>
          <div className="grid md:grid-cols-2 gap-12 items-center" style={{ margin: 0 }}>
            <div style={{ margin: 0 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', marginBottom: '1.5rem', backgroundColor: '#dbeafe', color: '#1d4ed8', borderRadius: '9999px', fontSize: '0.875rem' }}>
                <Award style={{ width: '1rem', height: '1rem' }} />
                <span style={{ fontWeight: 500 }}>25+ Years of Excellence in IT Staffing</span>
              </div>
              <h1 style={{ fontSize: '3.75rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-0.025em', color: '#111827' }}>
                Elite IT Talent for <span style={{ color: '#2563eb' }}>Florida's Government</span> & Enterprise
              </h1>
              <p style={{ fontSize: '1.25rem', color: '#4b5563', lineHeight: 1.625, marginBottom: '2rem' }}>
                Connecting qualified IT professionals with critical technology initiatives across Florida's public sector and enterprise organizations.
              </p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <Link
                  href="/browse-jobs"
                  style={{ 
                    padding: '1rem 2rem', 
                    background: 'linear-gradient(to right, #2563eb, #1d4ed8)', 
                    color: 'white', 
                    fontWeight: 600, 
                    borderRadius: '0.5rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    textDecoration: 'none',
                    boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)'
                  }}
                >
                  <Search style={{ width: '1.25rem', height: '1.25rem' }} />
                  Browse Jobs
                </Link>
                <Link
                  href="/employers"
                  style={{ 
                    padding: '1rem 2rem', 
                    backgroundColor: 'white', 
                    border: '2px solid #e5e7eb', 
                    color: '#374151', 
                    fontWeight: 600, 
                    borderRadius: '0.5rem',
                    textDecoration: 'none'
                  }}
                >
                  For Employers
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.5rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
                {[
                  { label: 'Placements', val: '500+' },
                  { label: 'Success Rate', val: '95%' },
                  { label: 'Years Experience', val: '25+' }
                ].map((stat) => (
                  <div key={stat.label} style={{ margin: 0 }}>
                    <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#2563eb', marginBottom: '0.25rem' }}>{stat.val}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Card Visual */}
            <div className="hidden md:block" style={{ position: 'relative', margin: 0 }}>
              <div style={{ position: 'absolute', inset: '-1rem', backgroundColor: '#2563eb', borderRadius: '1rem', opacity: 0.2, filter: 'blur(48px)' }}></div>
              <div style={{ position: 'relative', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', border: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '3rem', height: '3rem', background: '#2563eb', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Briefcase style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                  </div>
                  <div style={{ margin: 0 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Featured Position</div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>Senior Cloud Architect</div>
                  </div>
                </div>
                <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4b5563' }}>
                    <Building2 style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Florida Dept. of Technology</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4b5563' }}>
                    <MapPin style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Tallahassee, FL</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4b5563' }}>
                    <DollarSign style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>$120k - $160k</span>
                  </div>
                </div>
                <Link
                  href="/browse-jobs"
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    backgroundColor: '#2563eb', 
                    color: 'white', 
                    fontWeight: 700, 
                    borderRadius: '0.5rem', 
                    display: 'block', 
                    textAlign: 'center',
                    textDecoration: 'none'
                  }}
                >
                  Apply Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section style={{ paddingTop: '6rem', paddingBottom: '6rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '70rem', marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#111827', letterSpacing: '-0.025em', marginBottom: '1rem' }}>Explore by Category</h2>
            <p style={{ fontSize: '1.125rem', color: '#4b5563' }}>Specialized staffing for high-impact technology sectors</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6" style={{ margin: 0, gap: '3%' }}>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href="/jobs"
                style={{ 
                  padding: '2rem', 
                  textAlign: 'center', 
                  backgroundColor: 'white', 
                  border: '1px solid #f3f4f6', 
                  borderRadius: '1rem', 
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ 
                  width: '4rem', 
                  height: '4rem', 
                  backgroundColor: cat.color, 
                  borderRadius: '1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginBottom: '1.5rem', 
                  marginLeft: 'auto', 
                  marginRight: 'auto',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}>
                  <cat.icon style={{ width: '2rem', height: '2rem', color: 'white' }} />
                </div>
                <div style={{ fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>{cat.name}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#9ca3af' }}>{cat.count} jobs</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Preview */}
      <section style={{ paddingTop: '6rem', paddingBottom: '6rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Featured Opportunities</h2>
            <Link
              href="/jobs"
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                color: '#2563eb', 
                fontWeight: 700, 
                textDecoration: 'none' 
              }}
            >
              View All Openings <ChevronRight style={{ width: '1.25rem', height: '1.25rem' }} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {jobListings.map((job) => (
              <div
                key={job.id}
                style={{ 
                  padding: '1.5rem', 
                  backgroundColor: 'white', 
                  borderRadius: '1rem', 
                  border: '1px solid #e5e7eb',
                  transition: 'border-color 0.2s'
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <div style={{ 
                      width: '3.5rem', 
                      height: '3.5rem', 
                      backgroundColor: '#eff6ff', 
                      color: '#2563eb', 
                      borderRadius: '0.75rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0 
                    }}>
                      <Briefcase style={{ width: '1.75rem', height: '1.75rem' }} />
                    </div>
                    <div style={{ margin: 0 }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>{job.title}</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Building2 style={{ width: '1rem', height: '1rem' }} />{job.client}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><MapPin style={{ width: '1rem', height: '1rem' }} />{job.location}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><DollarSign style={{ width: '1rem', height: '1rem' }} />{job.salary}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Clock style={{ width: '1rem', height: '1rem' }} />{job.posted}</div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{ padding: '0.25rem 0.75rem', backgroundColor: '#eff6ff', color: '#1d4ed8', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>{job.category}</span>
                        <span style={{ padding: '0.25rem 0.75rem', backgroundColor: '#f0fdf4', color: '#15803d', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>{job.type}</span>
                        {job.clearance !== 'None' && (
                          <span style={{ padding: '0.25rem 0.75rem', backgroundColor: '#faf5ff', color: '#7e22ce', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>{job.clearance} Clearance</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/jobs"
                    style={{ 
                      padding: '0.75rem 2rem', 
                      backgroundColor: '#111827', 
                      color: 'white', 
                      fontWeight: 700, 
                      borderRadius: '0.5rem',
                      textDecoration: 'none'
                    }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ paddingTop: '6rem', paddingBottom: '6rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ 
          maxWidth: '64rem', 
          marginLeft: 'auto', 
          marginRight: 'auto', 
          backgroundColor: '#2563eb', 
          borderRadius: '1.5rem', 
          padding: '3rem', 
          textAlign: 'center', 
          color: 'white', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
          position: 'relative', 
          overflow: 'hidden' 
        }}>
          <div style={{ position: 'absolute', top: 0, right: 0, transform: 'translate(3rem, -3rem)', width: '16rem', height: '16rem', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '9999px', filter: 'blur(48px)' }}></div>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', color: 'white' }}>Ready to Advance Your Career?</h2>
            <p style={{ fontSize: '1.25rem', color: '#dbeafe', marginBottom: '2.5rem', maxWidth: '42rem', marginLeft: 'auto', marginRight: 'auto' }}>
              Join Florida's premier network of IT professionals and get matched with agencies that value your expertise.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              <Link
                href="/submit-resume"
                style={{ 
                  padding: '1rem 2.5rem', 
                  backgroundColor: 'white', 
                  color: '#2563eb', 
                  fontWeight: 700, 
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                Submit Your Resume
              </Link>
              <Link
                href="/employer-dashboard"
                style={{ 
                  padding: '1rem 2.5rem', 
                  backgroundColor: 'rgba(30, 64, 175, 0.4)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  color: 'white', 
                  fontWeight: 700, 
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  backdropFilter: 'blur(4px)'
                }}
              >
                Hire IT Talent
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}