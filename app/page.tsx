"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, BarChart3, BriefcaseBusiness, Calculator, CheckCircle2, ChevronRight, ClipboardList, Code2, Compass, HardHat, HeartPulse, Landmark, Siren, Star, Target, Users } from 'lucide-react'
import { useGetPublicJobs } from '@/hooks/useGetPublicJobs'



const careerAreas = [
  {
    title: 'Professional Services',
    description: 'Business, financial, and client-facing roles that keep organizations running smoothly.',
    examples: ['Business Analyst', 'Client Services Manager', 'Project Coordinator'],
    icon: BriefcaseBusiness,
    tone: 'rgba(29,78,216,0.12)',
  },
  {
    title: 'Government & Public Sector',
    description: 'Roles supporting federal, state, and local government missions and public programs.',
    examples: ['Contract Specialist', 'Program Analyst', 'Policy Advisor'],
    icon: Landmark,
    tone: 'rgba(124,58,237,0.12)',
  },
  {
    title: 'Technology & Digital Solutions',
    description: 'IT, software, and digital transformation roles supporting every industry we serve.',
    examples: ['Software Engineer', 'Systems Administrator', 'IT Support Specialist'],
    icon: Code2,
    tone: 'rgba(37,99,235,0.11)',
  },
  {
    title: 'Accounting & Finance',
    description: 'Accounting, audit, and financial management roles for public and private organizations.',
    examples: ['Staff Accountant', 'Financial Analyst', 'Auditor'],
    icon: Calculator,
    tone: 'rgba(16,185,129,0.12)',
  },
  {
    title: 'Engineering & Infrastructure',
    description: 'Civil, mechanical, and infrastructure roles building and maintaining critical systems.',
    examples: ['Civil Engineer', 'Project Engineer', 'Infrastructure Planner'],
    icon: HardHat,
    tone: 'rgba(245,166,35,0.14)',
  },
  {
    title: 'Healthcare',
    description: 'Clinical and administrative roles supporting patient care and health systems.',
    examples: ['Registered Nurse', 'Healthcare Administrator', 'Clinical Coordinator'],
    icon: HeartPulse,
    tone: 'rgba(239,68,68,0.12)',
  },
  {
    title: 'Emergency Management & Resiliency',
    description: 'Preparedness, response, and resiliency planning roles for agencies and communities.',
    examples: ['Emergency Management Specialist', 'Resiliency Planner', 'Continuity of Operations Analyst'],
    icon: Siren,
    tone: 'rgba(245,166,35,0.14)',
  },
  {
    title: 'Administrative & Operations',
    description: 'Administrative, operations, and support roles that keep teams and offices running.',
    examples: ['Executive Assistant', 'Operations Coordinator', 'Office Manager'],
    icon: ClipboardList,
    tone: 'rgba(234,179,8,0.14)',
  },
  {
    title: 'Data & Analytics',
    description: 'Data analysis, reporting, and business intelligence roles across sectors.',
    examples: ['Data Analyst', 'Business Intelligence Analyst', 'Research Analyst'],
    icon: BarChart3,
    tone: 'rgba(16,185,129,0.12)',
  },
  {
    title: 'Leadership & Consulting',
    description: 'Consulting, strategy, and leadership roles guiding organizations through change.',
    examples: ['Management Consultant', 'Program Director', 'Strategy Advisor'],
    icon: Compass,
    tone: 'rgba(37,99,235,0.11)',
  },
  {
    title: 'Human Resources',
    description: 'Talent acquisition, HR operations, and workforce management roles across every industry we serve.',
    examples: ['HR Generalist', 'Talent Acquisition Specialist', 'Benefits Administrator'],
    icon: Users,
    tone: 'rgba(124,58,237,0.12)',
  },
  {
    title: 'Nonprofit & Community Services',
    description: 'Roles supporting mission-driven organizations, community programs, and social impact initiatives.',
    examples: ['Program Coordinator', 'Grants Administrator', 'Community Outreach Specialist'],
    icon: Star,
    tone: 'rgba(239,68,68,0.12)',
  },
]

// featuredRoles will be populated from the public jobs API
type SimpleJob = { title?: string; company?: string; location?: string; salary?: string; tags?: string[], _id?: string }
const featuredRoles: SimpleJob[] = []

const steps = [
  {
    title: 'Create your account',
    text: 'Pick Candidate or Employer, confirm your email, and get ready to apply or post jobs.',
  },
  {
    title: 'Complete guided onboarding',
    text: 'Finish a short set of steps so your profile and applications match what employers expect.',
  },
  {
    title: 'Apply or hire with clarity',
    text: 'Search roles, apply quickly, and track your applications in one place.',
  },
]

export default function Home() {
  const { fetchJobs } = useGetPublicJobs()
  const [publicJobs, setPublicJobs] = useState<SimpleJob[] | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const res = await fetchJobs({ page: 1, limit: 3 })
      if (!mounted) return
      const r = res as unknown
      let payload: unknown = res
      if (r && typeof r === 'object') {
        const obj = r as Record<string, unknown>
        if (Array.isArray(obj.data)) payload = obj.data
        else if (Array.isArray(obj.jobs)) payload = obj.jobs
        else if (Array.isArray(obj.items)) payload = obj.items
      }
      if (Array.isArray(payload)) setPublicJobs(payload)
    }
    load()
    return () => { mounted = false }
  }, [fetchJobs])

  const displayed: SimpleJob[] = (publicJobs ?? featuredRoles)

  return (
    <div className="tp-shell" style={{ overflow: 'hidden' }}>
      <section style={{ padding: '3rem 0 5rem' }}>
        <div className="tp-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
          <div className="auth-span-7" style={{ position: 'relative' }}>
            <div className="tp-card-soft tp-fade-up" style={{ position: 'relative', overflow: 'hidden', padding: '2rem', background: 'linear-gradient(135deg, rgba(255,255,255,0.92), rgba(238,244,255,0.88))' }}>
              <div style={{ position: 'absolute', inset: 'auto -4rem -4rem auto', width: '16rem', height: '16rem', borderRadius: '999px', background: 'radial-gradient(circle, rgba(245,166,35,0.18), rgba(245,166,35,0) 70%)', filter: 'blur(10px)' }} />

              <div style={{ display: 'grid', gap: '1.5rem', position: 'relative', zIndex: 1, paddingTop: '2rem' }}>
                <div style={{ maxWidth: '46rem' }}>
                  <h1 className="tp-title" style={{ fontSize: 'clamp(3rem, 7vw, 5.25rem)', margin: 0 }}>
                    Find Your Next Career Opportunity
                  </h1>
                  <p className="tp-lead" style={{ fontSize: '1.08rem', marginTop: '1.2rem', maxWidth: '40rem' }}>
                    TriMergePRO Careers connects talented professionals with employers across government, commercial, nonprofit, healthcare, engineering, technology, and professional services through one workforce platform.
                  </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
                  <Link href="/browse-jobs" className="tp-btn-primary">
                    Browse Opportunities
                    <ArrowRight size={16} />
                  </Link>
                  <Link href="/join-now" className="tp-btn-secondary">
                    Create Profile
                  </Link>
                </div>

              </div>
            </div>
          </div>

          <div className="auth-span-5" style={{ display: 'grid', gap: '1rem' }}>
            <div className="tp-card tp-float" style={{ padding: '1.25rem', background: 'linear-gradient(180deg, rgba(7,23,46,0.98), rgba(15,23,42,0.95))', color: 'white' }}>
              {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <div className="tp-kicker" style={{ color: '#93c5fd' }}>Featured Role</div>
                  <h2 style={{ margin: '0.4rem 0 0', fontSize: '1.6rem', letterSpacing: '-0.04em' }}>Frontend Developer</h2>
                  <p style={{ margin: '0.55rem 0 0', color: 'rgba(255,255,255,0.76)', lineHeight: 1.65 }}>Build elegant interfaces for a platform that serves both candidates and the employers reviewing them.</p>
                </div>
                <div style={{ width: '3.8rem', height: '3.8rem', borderRadius: '22px', display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,0.08)' }}>
                  <BriefcaseBusiness size={20} />
                </div>
              </div> */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <div className="tp-kicker" style={{ color: '#93c5fd' }}>Featured Career Areas</div>
                  {/* <h2 style={{ margin: '0.4rem 0 0', fontSize: '1.6rem', letterSpacing: '-0.04em' }}>Frontend Developer</h2> */}
                 {/* <h2 style={{ margin: '0.4rem 0 0', fontSize: '1.6rem', letterSpacing: '-0.04em' }}> Talent & Employer Experience</h2> */}
                  {/* <p style={{ margin: '0.55rem 0 0', color: 'rgba(255,255,255,0.76)', lineHeight: 1.65 }}>Build elegant interfaces for a platform that serves both candidates and the employers reviewing them.</p> */}
                  {/* <p style={{ margin: '0.55rem 0 0', color: 'rgba(255,255,255,0.76)', lineHeight: 1.65 }}>Create impactful features that improve how talent presents their expertise and how employers identify top candidates.</p> */}
                </div>
                {/* <div style={{ width: '3.8rem', height: '3.8rem', borderRadius: '22px', display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,0.08)' }}>
                  <BriefcaseBusiness size={20} />
                </div> */}
              </div>

              <div style={{ display: 'grid', gap: '0.7rem', marginTop: '1.25rem' }}>
                {/* {['Remote-friendly setup', 'Modern React and TypeScript', 'Backend-aligned workflows'].map((line) => (
                  <div key={line} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.8rem 0.95rem', borderRadius: '16px', background: 'rgba(255,255,255,0.06)' }}>
                    <CheckCircle2 size={16} color="#93c5fd" />
                    <span style={{ fontWeight: 600 }}>{line}</span>
                  </div>
                ))} */}
                {['Accounting & Finance', 'Engineering', 'Healthcare', 'Program Management', 'Administrative Support', 'Government Contracting'].map((line) => (
                  <div key={line} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.8rem 0.95rem', borderRadius: '16px', background: 'rgba(255,255,255,0.06)' }}>
                    <CheckCircle2 size={16} color="#93c5fd" />
                    <span style={{ fontWeight: 600 }}>{line}</span>
                  </div>
                ))}
              </div>

              {/* <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
                {[
                  { label: 'Location', value: 'Remote' },
                  { label: 'Type', value: 'Full-time' },
                  { label: 'Salary', value: '$90k - $120k' },
                ].map((field) => (
                  <div key={field.label} style={{ padding: '0.85rem', borderRadius: '16px', background: 'rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.56)', fontWeight: 700 }}>{field.label}</div>
                    <div style={{ marginTop: '0.35rem', fontWeight: 800 }}>{field.value}</div>
                  </div>
                ))}
              </div> */}
            </div>

            <div className="tp-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.45rem', letterSpacing: '-0.04em' }}>
                Why Choose TriMergePRO Careers
                </h3>
              <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
                {[
                  'Trusted professional services firm',
                  'Opportunities across multiple industries',
                  'Secure candidate profiles',
                  'Easy application process',
                  'Employer and recruiter tools',
                  'Growing AI-enabled workforce platform'
                ].map((text) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', color: 'var(--tp-muted)', lineHeight: 1.6 }}>
                    <Target size={16} color="var(--tp-primary)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 5rem' }}>
        <div className="tp-container">
          <div className="tp-card-soft" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 className="tp-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: 0 }}>Why TriMerge?</h2>
            <p className="tp-lead" style={{ maxWidth: '42rem', margin: '1rem auto 0' }}>
              TriMerge Consulting Group is a consulting, accounting, staffing, and technology solutions firm serving government, nonprofit, and commercial clients.
            </p>
            <p className="tp-lead" style={{ maxWidth: '42rem', margin: '0.85rem auto 0' }}>
              For more than two decades we have helped organizations solve business challenges while connecting talented professionals with meaningful opportunities.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.85rem', marginTop: '1.5rem' }}>
              <Link href="/about" className="tp-btn-primary">
                About TriMerge
              </Link>
              <Link href="/about" className="tp-btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '1rem 0 5rem' }}>
        <div className="tp-container">
          <div style={{ marginBottom: '1.3rem' }}>
            <div className="tp-kicker">Career areas</div>
            <h2 className="tp-title" style={{ fontSize: 'clamp(2rem, 4vw, 3.1rem)', margin: '0.35rem 0 0' }}>Opportunities across every sector we serve.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(17rem, 1fr))', gap: '1rem' }}>
            {careerAreas.map((area) => {
              const Icon = area.icon
              return (
                <Link key={area.title} href="/browse-jobs" className="tp-card" style={{ padding: '1.25rem', display: 'block', color: 'inherit', textDecoration: 'none' }}>
                  <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '14px', background: area.tone, display: 'grid', placeItems: 'center' }}>
                    <Icon size={18} color="var(--tp-primary)" />
                  </div>
                  <h3 style={{ margin: '0.9rem 0 0', fontSize: '1.2rem', letterSpacing: '-0.03em' }}>{area.title}</h3>
                  <p style={{ margin: '0.5rem 0 0', color: 'var(--tp-muted)', lineHeight: 1.6, fontSize: '0.93rem' }}>{area.description}</p>
                  <div style={{ display: 'grid', gap: '0.5rem', marginTop: '1rem' }}>
                    {area.examples.map((job) => (
                      <div key={job} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: 'var(--tp-muted)', fontWeight: 600, fontSize: '0.85rem' }}>
                        <span style={{ width: '0.4rem', height: '0.4rem', borderRadius: '999px', background: 'var(--tp-primary)', flexShrink: 0 }} />
                        {job}
                      </div>
                    ))}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 5rem' }}>
        <div className="tp-container">
          <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.3rem' }}>
            <div>
              <h2 className="tp-title" style={{ fontSize: 'clamp(2rem, 4vw, 3.1rem)', margin: 0 }}>Featured Opportunities</h2>
            </div>
            <Link href="/browse-jobs" className="tp-btn-ghost">
              View all opportunities
              <ChevronRight size={16} />
            </Link>
          </div>

          {displayed.length === 0 ? (
            <div className="tp-card-soft" style={{ padding: '2rem', textAlign: 'center' }}>
              <p className="tp-lead" style={{ margin: 0 }}>No current opportunities available.</p>
              <p className="tp-lead" style={{ margin: '0.5rem 0 0' }}>Join our Talent Network to be notified when new positions become available.</p>
              <div style={{ marginTop: '1.2rem' }}>
                <Link href="/join-now" className="tp-btn-primary">
                  Join Talent Network
                </Link>
              </div>
            </div>
          ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {displayed.map((job) => (
              <article key={job.title} className="tp-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '3.2rem', height: '3.2rem', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(29,78,216,0.12), rgba(245,166,35,0.12))', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <BriefcaseBusiness size={18} color="var(--tp-primary)" />
                    </div>
                    <div>
                      <div className="tp-kicker">{job.company}</div>
                      <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.35rem', letterSpacing: '-0.03em' }}>{job.title}</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginTop: '0.65rem', color: 'var(--tp-muted)', fontSize: '0.93rem', fontWeight: 600 }}>
                        <span>{job.location}</span>
                        <span>{job.salary}</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.9rem' }}>
                        {(job.tags ?? []).map((tag: string) => (
                          <span key={tag} style={{ padding: '0.4rem 0.75rem', borderRadius: '999px', background: 'rgba(29,78,216,0.08)', color: 'var(--tp-primary)', fontWeight: 700, fontSize: '0.85rem' }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Link href={`/browse-jobs?details=${encodeURIComponent(String(job._id ?? ''))}`} className="tp-btn-secondary">
                    View details
                  </Link>
                </div>
              </article>
            ))}
          </div>
          )}
        </div>
      </section>

      <section id="for-employers" style={{ padding: '0 0 5rem' }}>
        <div className="tp-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: '1rem', alignItems: 'stretch' }}>
          <div className="auth-span-5">
            <div className="tp-card-soft" style={{ padding: '1.5rem' }}>
              <div className="tp-kicker">How it works</div>
              <h2 style={{ margin: '0.35rem 0 0', fontSize: 'clamp(1.8rem, 3vw, 2.7rem)', letterSpacing: '-0.04em' }}>A better portal should feel obvious from the first click.</h2>
              <div style={{ display: 'grid', gap: '0.95rem', marginTop: '1.25rem' }}>
                {steps.map((step, index) => (
                  <div key={step.title} style={{ display: 'flex', gap: '0.95rem', padding: '1rem', borderRadius: '18px', background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(148,163,184,0.14)' }}>
                    <div style={{ width: '2.3rem', height: '2.3rem', borderRadius: '999px', background: 'linear-gradient(135deg, var(--tp-primary), #0b3aa7)', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 800, flexShrink: 0 }}>{index + 1}</div>
                    <div>
                      <div style={{ fontWeight: 800 }}>{step.title}</div>
                      <div className="tp-lead" style={{ fontSize: '0.96rem', marginTop: '0.25rem' }}>{step.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="auth-span-7">
            <div className="tp-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(7,23,46,0.98), rgba(29,78,216,0.9))', color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 'auto -3rem -3rem auto', width: '14rem', height: '14rem', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', filter: 'blur(24px)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="tp-kicker" style={{ color: '#bfdbfe' }}>Employers</div>
                <h2 style={{ margin: '0.35rem 0 0', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', letterSpacing: '-0.04em' }}>For Employers</h2>
                <p style={{ margin: '0.9rem 0 0', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, maxWidth: '42rem' }}>
                  Post opportunities, manage applicants, review candidates, and streamline your recruiting process through one workforce platform.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))', gap: '0.85rem', marginTop: '1.2rem' }}>
                  {['Guided onboarding', 'Verified email confirmation', 'Candidate and employer paths', 'Job application tracking'].map((item) => (
                    <div key={item} style={{ padding: '0.95rem', borderRadius: '18px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', fontWeight: 700 }}>
                      {item}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginTop: '1.2rem' }}>
                  <Link href="/join-now?role=recruiter" className="tp-btn-secondary">
                    Post a Position
                  </Link>
                  <Link href="/login" className="tp-btn-ghost" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                    Employer Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="for-candidates" style={{ padding: '0 0 5rem' }}>
        <div className="tp-container">
          <div className="tp-card-soft" style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="tp-kicker">Candidates</div>
            <h2 className="tp-title" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', margin: '0.35rem 0 0' }}>For Candidates</h2>
            <p className="tp-lead" style={{ maxWidth: '42rem', margin: '0.9rem auto 0' }}>
              Create your profile, upload your resume, search opportunities, and manage your applications from one place.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.85rem', marginTop: '1.2rem' }}>
              <Link href="/join-now" className="tp-btn-primary">
                Create Profile
              </Link>
              <Link href="/browse-jobs" className="tp-btn-secondary">
                Browse Opportunities
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 5rem' }}>
        <div className="tp-container">
          <div className="tp-card-soft" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div className="tp-kicker">Ready to experience the TriMerge difference?</div>
            <h2 style={{ margin: '0.45rem 0 0', fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.04em' }}>A careers portal that feels polished from landing to onboarding.</h2>
            <p className="tp-lead" style={{ maxWidth: '42rem', margin: '0.9rem auto 0' }}>
              Join as a candidate or employer, complete onboarding, and explore opportunities across government, healthcare, finance, engineering, and professional services through a modern recruiting experience.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.85rem', marginTop: '1.25rem' }}>
              <Link href="/join-now" className="tp-btn-primary">
                Join now
              </Link>
              <Link href="/browse-jobs" className="tp-btn-secondary">
                Explore jobs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}