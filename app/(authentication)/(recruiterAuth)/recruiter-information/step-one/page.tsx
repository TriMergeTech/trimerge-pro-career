"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRecruiterOnboardingStepTwo } from '@/hooks/useRecruiterOnboardingStepTwo'

function Page() {
  const router = useRouter()
  const { submit, loading, error } = useRecruiterOnboardingStepTwo()

  const [companyName, setCompanyName] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')
  const [industry, setIndustry] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [location, setLocation] = useState('')
  const [yourRole, setYourRole] = useState('')
  const [jobTitle, setJobTitle] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { companyName, companyWebsite, industry, companySize, location, yourRole, jobTitle }
    const result = await submit(payload)
    if (result) {
      // proceed to next step or dashboard
      router.push('/recruiter-information/step-two')
    }
  }

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
                <div style={{ color: 'white'}}>
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
                <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} type="text" placeholder="Company Name *" style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    width: '90%',
                    borderRadius: '0.375rem',
                    marginTop: '2rem',
                    backgroundColor: 'white',
                }}/>
                <input value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} type="text" placeholder="Company Website *" style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    width: '90%',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                }}/>
                <input value={industry} onChange={(e) => setIndustry(e.target.value)} type="text" placeholder="Industry *" style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    width: '90%',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                }}/>
                <input value={companySize} onChange={(e) => setCompanySize(e.target.value)} type="text" placeholder="Company Size" style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    width: '90%',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                }}/>
                <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" placeholder="Location *" style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    width: '90%',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                }}/>
                <input value={yourRole} onChange={(e) => setYourRole(e.target.value)} type="text" placeholder="Your Role *" style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    width: '90%',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                }}/>
                <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} type="text" placeholder="Job Title" style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    width: '90%',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                }}/>
            </span>
            <button disabled={loading} type="submit" style={{
                backgroundColor: '#1e3a8a',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                width: '60%',
                marginTop: '2rem',
                alignSelf: 'center',
            }}>
                {loading ? 'Saving...' : 'Save and Continue'}
            </button>
            {error && <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>}
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
                Create your recruiter account to post roles, manage candidates, and collaborate with your hiring team on TriMergePRO.
            </div>
            <Image
            style={{
                marginTop: '3rem',
                borderRadius: '0.5rem',
                width: '70%',
                height: '90%',
            }}
             src="/recruiter.svg"
             alt="Personal Info Illustration"
             width={500}
             height={300}
            />
        </div>
    </div>
  )
}

export default Page
