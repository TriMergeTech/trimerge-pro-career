"use client"

import Link from 'next/link';
import { 
  Search,  Briefcase, 
   DollarSign, CheckCircle, Users, Award, 
  Heart, Lightbulb, Trophy,
  GraduationCap,  
} from 'lucide-react';

const jobListings = [
  { id: 1, title: 'Senior Cloud Architect', category: 'Cloud', location: 'Tallahassee, FL', type: 'Full-time', salary: '$120k - $160k', client: 'Florida Dept. of Technology', clearance: 'Secret', posted: '2 days ago' },
  { id: 2, title: 'Cybersecurity Analyst', category: 'Security', location: 'Miami, FL', type: 'Contract', salary: '$95k - $125k', client: 'Enterprise Healthcare System', clearance: 'None', posted: '1 week ago' },
];

const coreValues = [
  { icon: Heart, title: 'People First', description: 'We prioritize the well-being and growth of our team members above all else.', color: '#fee2e2', textColor: '#dc2626' },
  { icon: Lightbulb, title: 'Innovation Driven', description: 'We encourage creative thinking and bold ideas that push boundaries.', color: '#fef9c3', textColor: '#ca8a04' },
  { icon: Users, title: 'Collaborative Spirit', description: 'We believe the best work happens when we work together as one team.', color: '#dbeafe', textColor: '#2563eb' },
];

const benefits = [
  { icon: DollarSign, title: 'Competitive Compensation', items: ['Market-leading salaries', 'Annual performance bonuses', 'Equity packages'] },
  { icon: GraduationCap, title: 'Learning & Development', items: ['$3,000 annual learning budget', 'Internal mentorship', 'Conference attendance'] },
  { icon: Briefcase, title: 'Work-Life Balance', items: ['Flexible work arrangements', 'Unlimited PTO policy', 'Remote-first culture'] },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-900">

      {/* About Section (The Second Page Content) */}
      <section id="about" style={{ paddingTop: '5rem', paddingBottom: '5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', background: 'linear-gradient(to bottom right, #f9fafb, #eff6ff)' }}>
        <div style={{ maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto' }}>
          <div className="grid md:grid-cols-2 gap-12 items-center" style={{ margin: 0 }}>
            <div style={{ margin: 0 }}>
              <h2 style={{ fontSize: '2.25rem', color: '#111827', marginBottom: '1.5rem' }}>Florida's Premier IT Staffing Partner</h2>
              <p style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '1.5rem', lineHeight: 1.625 }}>
                Trimerge specializes in providing qualified IT professionals for critical government and enterprise technology initiatives. With over 25 years of combined leadership experience, we understand the unique requirements of Florida's public sector.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { title: 'Rigorous Vetting Process', desc: 'Every candidate undergoes comprehensive technical and security screenings' },
                  { title: 'Rapid Placement', desc: 'Average time-to-placement of 14 days for critical positions' },
                  { title: 'Long-term Support', desc: 'Ongoing candidate support and client communication throughout engagements' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <CheckCircle style={{ width: '1.5rem', height: '1.5rem', color: '#16a34a', flexShrink: 0, marginTop: '0.25rem' }} />
                    <div style={{ margin: 0 }}>
                      <h4 style={{ color: '#111827', marginBottom: '0.25rem', fontWeight: 600 }}>{item.title}</h4>
                      <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative', margin: 0 }}>
              <div style={{ position: 'absolute', inset: '-1rem', background: 'linear-gradient(to right, #2563eb, #4f46e5)', borderRadius: '1rem', opacity: 0.2, filter: 'blur(48px)', }}></div>
              <div style={{ position: 'relative', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', border: '1px solid #e5e7eb',   marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', color: '#111827', marginBottom: '1.5rem' }}>By the Numbers</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {[
                    { label: 'Client Satisfaction', val: '98%', color: 'linear-gradient(to right, #2563eb, #4f46e5)', text: '#2563eb' },
                    { label: 'Placement Success Rate', val: '95%', color: 'linear-gradient(to right, #16a34a, #10b981)', text: '#16a34a' },
                    { label: 'Candidate Retention (1yr)', val: '92%', color: 'linear-gradient(to right, #9333ea, #db2777)', text: '#9333ea' }
                  ].map((stat) => (
                    <div key={stat.label} style={{ margin: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#4b5563', fontSize: '0.875rem' }}>{stat.label}</span>
                        <span style={{ color: stat.text, fontWeight: 700 }}>{stat.val}</span>
                      </div>
                      <div style={{ height: '0.5rem', backgroundColor: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: stat.color, width: stat.val }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section (First Page Content) */}
      <section style={{ paddingTop: '5rem', paddingBottom: '5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: '#2563eb', borderRadius: '0.5rem' }}>
              <Heart style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
            </div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Core Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6" style={{ margin: 0 }}>
            {coreValues.map((value) => (
              <div key={value.title} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' ,  marginBottom: '2rem'}}>
                <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: value.color, color: value.textColor, borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <value.icon style={{ width: '1.75rem', height: '1.75rem' }} />
                </div>
                <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>{value.title}</h3>
                <p style={{ color: '#4b5563', fontSize: '0.875rem', lineHeight: 1.5 }}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ paddingTop: '5rem', paddingBottom: '5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: '#2563eb', borderRadius: '0.5rem' }}>
              <Trophy style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
            </div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Benefits & Perks</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6" style={{ margin: 0 }}>
            {benefits.map((benefit) => (
              <div key={benefit.title} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb',  marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.5rem', backgroundColor: 'rgba(37, 99, 235, 0.1)', borderRadius: '0.5rem' }}>
                    <benefit.icon style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }} />
                  </div>
                  <h3 style={{ fontWeight: 600 }}>{benefit.title}</h3>
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {benefit.items.map((item) => (
                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#374151', fontSize: '0.875rem' }}>
                      <div style={{ width: '0.375rem', height: '0.375rem', backgroundColor: '#2563eb', borderRadius: '50%' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '64rem', marginLeft: 'auto', marginRight: 'auto', background: 'linear-gradient(to right, #2563eb, #4338ca)', borderRadius: '1.5rem', padding: '3rem', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>Ready to Advance Your Career?</h2>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem', opacity: 0.9 }}>Join Florida's premier network of IT professionals.</p>
          <Link href="/browse-jobs" style={{ padding: '1rem 2.5rem', backgroundColor: 'white', color: '#2563eb', fontWeight: 700, borderRadius: '0.75rem', border: 'none', cursor: 'pointer' }}>
            View Open Positions
          </Link>
        </div>
      </section>
    </div>
  );
}