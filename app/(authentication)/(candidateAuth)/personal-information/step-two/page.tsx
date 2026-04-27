import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Page() {
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
                left: '10%',
                bottom: '0',
                position: 'absolute',
            }}
             src="/candidate.svg"
             alt="Candidate Illustration"
             width={300}
             height={200}
            />
        <form style={{
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
                    Tell Us About Your Skills & Experience
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
                <h1 style={{ marginTop: '3rem' }}>
                    Skills
                </h1>
                <textarea name='skills' placeholder="Search or add skills (e.g., Python, AutoCAD, Project Management)" style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    width: '90%',
                    height: '5rem',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                    resize: 'none',
                }}></textarea>

                <h1>
                    Professional Summary
                </h1>
                <textarea name='professionalSummary' placeholder="Professional Summary *" style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    width: '90%',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                    resize: 'none',
                    height: '10rem',
                }}></textarea>

             
            </span>
            <button style={{
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
                Save and Continue 
            </button>
        </form>
    </div>
  )
}

export default Page