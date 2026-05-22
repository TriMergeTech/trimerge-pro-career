"use client"
import Image from 'next/image'
// Link removed (unused)
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRecruiterOnboardingStepThree } from '@/hooks/useRecruiterOnboardingStepThree'

function Page() {
    const router = useRouter()
        const { submit, loading, error } = useRecruiterOnboardingStepThree()
    const [companyOverview, setCompanyOverview] = useState('')
    const [benefitsAndOpportunities, setBenefitsAndOpportunities] = useState('')
    const [primaryHiringNeeds, setPrimaryHiringNeeds] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const payload = { companyOverview, benefitsAndOpportunities, primaryHiringNeeds }
        const result = await submit(payload)
        if (result) {
            router.push('/')
        }
    }

    return (
        <div style={{
        minHeight: '90vh',
        display: 'flex',
        paddingTop: '2rem',
        justifyContent: 'end',
        paddingBottom: '2rem',
        position: 'relative',
    }}>
        
            <Image
            style={{
                marginTop: '3rem',
                borderRadius: '0.5rem',
                width: '70%',
                height: '80%',
                left: '-5%',
                bottom: '0',
                position: 'absolute',
            }}
             src="/recruiterInfo.svg"
             alt="Candidate Illustration"
             width={300}
             height={200}
            />
        <form onSubmit={handleSubmit} style={{
            height: '83vh',
            paddingBottom: '2rem',
            display: 'flex',
            alignItems: 'start',
            flexDirection: 'column',
            justifyContent: 'start',
            width: '40%',
            backgroundColor: '#f8fafc',
            marginRight: '3rem',
            borderRadius: '0.8rem',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            border: '2px solid #f5a929',
        }}>
            <span style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'end',
                width: '100%',
                height: 'fit-content',
                paddingTop: '0.6rem',
            }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center' }}>
                    Tell Us More About Your Company & Hiring Goals
                </h1>
                <div style={{ color: 'white'}}>
                    Step 3/3
                </div>
            </span>
            <span style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'start',
                rowGap: '1rem',
                width: '80%',
            }}>
                                <h1 style={{ marginTop: '3rem' }}>Company Overview</h1>
                                <textarea
                                    value={companyOverview}
                                    onChange={(e) => setCompanyOverview(e.target.value)}
                                    name='companyOverview'
                                    placeholder='Briefly describe your company, mission, and workplace culture (max 800 characters).'
                                    style={{
                                        padding: '0.75rem',
                                        border: '1px solid #D1D5DB',
                                        width: '90%',
                                        height: '6rem',
                                        borderRadius: '0.375rem',
                                        backgroundColor: 'white',
                                        resize: 'vertical',
                                    }}
                                />

                                <h1>Benefits & Opportunities</h1>
                                <textarea
                                    value={benefitsAndOpportunities}
                                    onChange={(e) => setBenefitsAndOpportunities(e.target.value)}
                                    name='benefitsAndOpportunities'
                                    placeholder='e.g. Flexible PTO, Health benefits, Remote options, Career growth'
                                    style={{
                                        padding: '0.75rem',
                                        border: '1px solid #D1D5DB',
                                        width: '90%',
                                        height: '5rem',
                                        borderRadius: '0.375rem',
                                        backgroundColor: 'white',
                                        resize: 'vertical',
                                    }}
                                />

                                <h1>Primary Hiring Needs</h1>
                                <textarea
                                    value={primaryHiringNeeds}
                                    onChange={(e) => setPrimaryHiringNeeds(e.target.value)}
                                    name='primaryHiringNeeds'
                                    placeholder='Search or add skills (e.g., Python, AutoCAD, Project Management)'
                                    style={{
                                        padding: '0.75rem',
                                        border: '1px solid #D1D5DB',
                                        width: '90%',
                                        height: '5rem',
                                        borderRadius: '0.375rem',
                                        backgroundColor: 'white',
                                        resize: 'vertical',
                                    }}
                                />
             
            </span>
                        <button disabled={loading} style={{
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
    </div>
  )
}

export default Page