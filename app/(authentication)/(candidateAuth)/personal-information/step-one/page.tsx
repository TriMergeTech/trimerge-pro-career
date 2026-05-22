"use client"

import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation';
import { useCandidateOnboardingStepTwo } from '@/hooks/useCandidateOnboardingStepTwo';

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
        <div style={{
            minHeight: '90vh',
            display: 'flex',
            paddingTop: '2rem',
            justifyContent: 'space-around',
            paddingBottom: '2rem',
        }}>
            <form onSubmit={handleSubmit} style={{
                maxHeight: '100vh',
                height: 'fit-content',
                paddingBottom: '2rem',
                display: 'flex',
                alignItems: 'start',
                flexDirection: 'column',
                justifyContent: 'start',
                width: '40%',
                backgroundColor: '#0b1f3a',
                marginLeft: '3rem',
                borderRadius: '0.8rem',
                paddingLeft: '2rem',
                paddingRight: '2rem',
            }}>
                <span style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'end',
                    width: '100%',
                    height: 'fit-content',
                    paddingTop: '0.6rem',
                }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                        Personal Information
                    </h1>
                    <div style={{ color: 'white' }}>
                        Step 2/3
                    </div>
                </span>
                <span style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'start',
                    rowGap: '1rem',
                    width: '80%',
                }}>
                    <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} type="text" placeholder="Phone Number *" style={{
                        padding: '0.75rem',
                        border: '1px solid #D1D5DB',
                        width: '90%',
                        borderRadius: '0.375rem',
                        marginTop: '2rem',
                        backgroundColor: 'white',
                    }} />
                        {fieldErrors.phoneNumber && <div style={{ color: '#fecaca', marginTop: 6 }}>{fieldErrors.phoneNumber}</div>}
                    <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" placeholder="Location *" style={{
                        padding: '0.75rem',
                        border: '1px solid #D1D5DB',
                        width: '90%',
                        borderRadius: '0.375rem',
                        backgroundColor: 'white',
                    }} />
                        {fieldErrors.location && <div style={{ color: '#fecaca', marginTop: 6 }}>{fieldErrors.location}</div>}
                    <input value={jobTitleOrDesiredRole} onChange={(e) => setJobTitleOrDesiredRole(e.target.value)} type="text" placeholder="Job Title / Desired Role *" style={{
                        padding: '0.75rem',
                        border: '1px solid #D1D5DB',
                        width: '90%',
                        borderRadius: '0.375rem',
                        backgroundColor: 'white',
                    }} />
                        {fieldErrors.jobTitleOrDesiredRole && <div style={{ color: '#fecaca', marginTop: 6 }}>{fieldErrors.jobTitleOrDesiredRole}</div>}
                        <input value={yearsOfExperience} onChange={(e) => setYearsOfExperience(e.target.value)} type="number" min={0} placeholder="Years of Experience *" style={{
                        padding: '0.75rem',
                        border: '1px solid #D1D5DB',
                        width: '90%',
                        borderRadius: '0.375rem',
                        backgroundColor: 'white',
                    }} />
                        {fieldErrors.yearsOfExperience && <div style={{ color: '#fecaca', marginTop: 6 }}>{fieldErrors.yearsOfExperience}</div>}
                    <input value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} type="text" placeholder="LinkedIn URL *" style={{
                        padding: '0.75rem',
                        border: '1px solid #D1D5DB',
                        width: '90%',
                        borderRadius: '0.375rem',
                        backgroundColor: 'white',
                    }} />
                        {fieldErrors.linkedinUrl && <div style={{ color: '#fecaca', marginTop: 6 }}>{fieldErrors.linkedinUrl}</div>}
                </span>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '.2rem', width: '100%', color: 'white' }}>
                    Please upload your resume below. We accept PDF and Word (.doc, .docx) formats.
                </div>
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e)=>{
                    const f = e.target.files?.[0] ?? null;
                    setResumeFile(f);
                }} style={{ display: 'none' }} id="resume-upload" />
                <Image
                    src="/upload.svg"
                    alt='Upload Resume Illustration'
                    width={200}
                    height={100}
                    style={{ cursor: 'pointer' }}
                    onClick={() => document.getElementById('resume-upload')?.click()}
                />
                {resumeFile && <div style={{ color: 'white', marginTop: 8 }}>{resumeFile.name}</div>}

                <div style={{ height: 8 }} />
                {error && <div style={{ color: '#fecaca', marginBottom: '0.5rem' }}>{error}</div>}
                <button type="submit" disabled={!isValid || loading} style={{
                    backgroundColor: '#1e3a8a',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    width: '60%',
                    marginTop: '2rem',
                    alignSelf: 'center',
                }}>
                    {loading ? 'Saving…' : 'Save and Continue'}
                </button>
            </form>
            <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'start',
                width: '50%',
                paddingRight: '3rem',
            }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#111827', textAlign: 'center' }}>
                    Welcome Username
                </h1>
                <div style={{ fontSize: '1.25rem', color: '#6B7280', textAlign: 'right', marginTop: '3rem' }}>
                    Complete your personal information to continue your application and get matched with top IT opportunities.
                </div>
                <Image
                    style={{
                        marginTop: '3rem',
                        borderRadius: '0.5rem',
                        width: '70%',
                        height: '90%',
                    }}
                    src="/personal_info.svg"
                    alt="Personal Info Illustration"
                    width={500}
                    height={300}
                />
            </div>
        </div>
    );
}

export default Page
