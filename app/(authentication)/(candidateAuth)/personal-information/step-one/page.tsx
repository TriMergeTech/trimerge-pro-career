"use client"

import React from 'react'
import { useRouter } from 'next/navigation';
import { useCandidateOnboardingStepTwo } from '@/hooks/useCandidateOnboardingStepTwo';
import { AuthShell } from '../../../../components/ui/AuthShell';
import { ArrowRight, FileUp, Globe, MapPin, Phone, UserRound } from 'lucide-react';

function Page() {
    const router = useRouter();
    const { submit, loading, error } = useCandidateOnboardingStepTwo();

    // form fields
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [location, setLocation] = React.useState('');
    const [jobTitleOrDesiredRole, setJobTitleOrDesiredRole] = React.useState('');
    const [yearsOfExperience, setYearsOfExperience] = React.useState('');
    const [linkedinUrl, setLinkedinUrl] = React.useState('');
    const [resumeFile, setResumeFile] = React.useState<File | null>(null);
    const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});

    // derive payload and validation with useMemo (no setState in effects)
    const payload = React.useMemo(() => ({
        phoneNumber,
        location,
        jobTitleOrDesiredRole,
        yearsOfExperience: Number(yearsOfExperience) || 0,
        linkedinUrl,
    }), [phoneNumber, location, jobTitleOrDesiredRole, yearsOfExperience, linkedinUrl]);

    const isValid = React.useMemo(() => {
        return phoneNumber.trim() !== '' && location.trim() !== '' && jobTitleOrDesiredRole.trim() !== '' && Number(yearsOfExperience) > 0;
    }, [phoneNumber, location, jobTitleOrDesiredRole, yearsOfExperience]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // per-field validation
        const errors: Record<string, string> = {};
        if (phoneNumber.trim() === '') errors.phoneNumber = 'Phone number is required';
        if (location.trim() === '') errors.location = 'Location is required';
        if (jobTitleOrDesiredRole.trim() === '') errors.jobTitleOrDesiredRole = 'Job title or desired role is required';
        const yearsNum = Number(yearsOfExperience);
        if (!Number.isFinite(yearsNum) || yearsNum <= 0) errors.yearsOfExperience = 'Years of experience must be a number greater than 0';
        // optional: validate linkedin format if provided
        if (linkedinUrl.trim() !== '') {
            try {
                // simple validation
                new URL(linkedinUrl);
            } catch {
                errors.linkedinUrl = 'Please enter a valid URL';
            }
        }

        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        let result = null;
        if (resumeFile) {
            const fd = new FormData();
            fd.append('phoneNumber', payload.phoneNumber);
            fd.append('location', payload.location);
            fd.append('jobTitleOrDesiredRole', payload.jobTitleOrDesiredRole);
            fd.append('yearsOfExperience', String(payload.yearsOfExperience));
            fd.append('linkedinUrl', payload.linkedinUrl || '');
            fd.append('resume', resumeFile, resumeFile.name);
            result = await submit(fd);
        } else {
            result = await submit(payload);
        }
        if (result) {
            router.replace('/personal-information/step-two');
        }
    };

    return (
                <AuthShell
                    eyebrow="Candidate onboarding"
                    title="Shape the profile recruiters will actually see."
                    subtitle="This first onboarding step captures the essentials so the backend can build a strong candidate profile and move you to the next stage."
                    bullets={[
                        'Add your contact details, desired role, and location in one pass.',
                        'Upload your resume to keep the profile aligned with the backend flow.',
                        'We keep the journey focused on matching you with relevant jobs faster.',
                    ]}
                    footer={<span style={{ color: 'var(--tp-muted)' }}>Step 1 of 3</span>}
                >
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <div className="tp-kicker">Candidate profile</div>
                            <h2 style={{ margin: '0.35rem 0 0', fontSize: '2rem', letterSpacing: '-0.04em' }}>Tell us the basics.</h2>
                            <p className="tp-lead" style={{ marginTop: '0.6rem' }}>You can complete the whole profile in a couple of quick steps.</p>
                        </div>

                        <label style={{ display: 'grid', gap: '0.45rem' }}>
                            <span style={{ fontWeight: 800, color: 'var(--tp-ink)' }}>Phone number</span>
                            <div style={{ position: 'relative' }}>
                                <Phone size={16} color="var(--tp-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} type="text" placeholder="Phone number *" className="tp-card" style={{ width: '100%', boxSizing: 'border-box', padding: '0.95rem 1rem 0.95rem 2.5rem', borderRadius: '16px', border: '1px solid rgba(148,163,184,0.2)' }} />
                            </div>
                            {fieldErrors.phoneNumber && <div style={{ color: '#b91c1c', fontWeight: 700 }}>{fieldErrors.phoneNumber}</div>}
                        </label>

                        <label style={{ display: 'grid', gap: '0.45rem' }}>
                            <span style={{ fontWeight: 800, color: 'var(--tp-ink)' }}>Location</span>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={16} color="var(--tp-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" placeholder="Location *" className="tp-card" style={{ width: '100%', boxSizing: 'border-box', padding: '0.95rem 1rem 0.95rem 2.5rem', borderRadius: '16px', border: '1px solid rgba(148,163,184,0.2)' }} />
                            </div>
                            {fieldErrors.location && <div style={{ color: '#b91c1c', fontWeight: 700 }}>{fieldErrors.location}</div>}
                        </label>

                        <label style={{ display: 'grid', gap: '0.45rem' }}>
                            <span style={{ fontWeight: 800, color: 'var(--tp-ink)' }}>Desired role</span>
                            <div style={{ position: 'relative' }}>
                                <UserRound size={16} color="var(--tp-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <input value={jobTitleOrDesiredRole} onChange={(e) => setJobTitleOrDesiredRole(e.target.value)} type="text" placeholder="Job title / desired role *" className="tp-card" style={{ width: '100%', boxSizing: 'border-box', padding: '0.95rem 1rem 0.95rem 2.5rem', borderRadius: '16px', border: '1px solid rgba(148,163,184,0.2)' }} />
                            </div>
                            {fieldErrors.jobTitleOrDesiredRole && <div style={{ color: '#b91c1c', fontWeight: 700 }}>{fieldErrors.jobTitleOrDesiredRole}</div>}
                        </label>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.85rem' }}>
                            <label style={{ display: 'grid', gap: '0.45rem' }}>
                                <span style={{ fontWeight: 800, color: 'var(--tp-ink)' }}>Years of experience</span>
                                <input value={yearsOfExperience} onChange={(e) => setYearsOfExperience(e.target.value)} type="number" min={0} placeholder="Years of experience *" className="tp-card" style={{ width: '100%', boxSizing: 'border-box', padding: '0.95rem 1rem', borderRadius: '16px', border: '1px solid rgba(148,163,184,0.2)' }} />
                                {fieldErrors.yearsOfExperience && <div style={{ color: '#b91c1c', fontWeight: 700 }}>{fieldErrors.yearsOfExperience}</div>}
                            </label>

                            <label style={{ display: 'grid', gap: '0.45rem' }}>
                                <span style={{ fontWeight: 800, color: 'var(--tp-ink)' }}>LinkedIn URL</span>
                                <div style={{ position: 'relative' }}>
                                    <Globe size={16} color="var(--tp-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} type="text" placeholder="LinkedIn profile URL" className="tp-card" style={{ width: '100%', boxSizing: 'border-box', padding: '0.95rem 1rem 0.95rem 2.5rem', borderRadius: '16px', border: '1px solid rgba(148,163,184,0.2)' }} />
                                </div>
                                {fieldErrors.linkedinUrl && <div style={{ color: '#b91c1c', fontWeight: 700 }}>{fieldErrors.linkedinUrl}</div>}
                            </label>
                        </div>

                        <div style={{ display: 'grid', gap: '0.65rem' }}>
                            <span style={{ fontWeight: 800, color: 'var(--tp-ink)' }}>Resume</span>
                            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)} style={{ display: 'none' }} id="resume-upload" />
                            <label htmlFor="resume-upload" style={{ display: 'grid', gap: '0.75rem', padding: '1rem', borderRadius: '18px', border: '1px dashed rgba(29,78,216,0.35)', background: 'rgba(29,78,216,0.04)', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '16px', background: 'rgba(29,78,216,0.1)', color: 'var(--tp-primary)', display: 'grid', placeItems: 'center' }}>
                                        <FileUp size={16} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 800, color: 'var(--tp-ink)' }}>Upload your resume</div>
                                        <div style={{ color: 'var(--tp-muted)', fontSize: '0.92rem' }}>PDF, DOC, or DOCX</div>
                                    </div>
                                </div>
                                {resumeFile ? <div style={{ color: 'var(--tp-primary)', fontWeight: 800 }}>{resumeFile.name}</div> : <div style={{ color: 'var(--tp-muted)' }}>Click to choose a file</div>}
                            </label>
                        </div>

                        {error && <div style={{ color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca', padding: '0.85rem 1rem', borderRadius: '16px', fontWeight: 700 }}>{error}</div>}

                        <button type="submit" disabled={!isValid || loading} className="tp-btn-primary" style={{ width: '100%', cursor: loading ? 'not-allowed' : 'pointer' }}>
                            {loading ? 'Saving…' : 'Save and continue'}
                            {!loading && <ArrowRight size={16} />}
                        </button>
                    </form>
                </AuthShell>
    );
}

export default Page
