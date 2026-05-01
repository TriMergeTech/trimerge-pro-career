import Image from 'next/image'
import React from 'react'

function Page() {
  return (  
    <div style={{
        minHeight: '90vh',
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        backgroundColor: '#0b1f3a',
        padding: '2rem',
        rowGap: '1rem',
        alignItems: 'center',
        justifyContent: 'center',
    }}>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            top: '0%',
            paddingTop: '1rem',
            width: '80%',
            height: '90%',
            borderBottomLeftRadius: '0.5rem',
            borderBottomRightRadius: '0.5rem',
            border: '2px solid #f5a929',
            borderTop: 'none',
            alignItems: 'center',
            justifyContent: 'start ',
            backgroundColor: 'white',
        }}>
            <Image
                src="/pop.svg"
                alt="Success Illustration"
                width={200}
                height={200}
            />
            <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: '2rem',
                width: '70%',
                textAlignLast: 'center',
            }}>
                You are all Set!
            </div>
            <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: '2rem',
                width: '60%',
                textAlignLast: 'center',
            }}>
                Your recruiter profile is fully set up. You can now post roles, manage candidates, and streamline your hiring process with TriMergePRO.
            </div>
            <img 
                src="/Logo.png" 
                alt="TriMergePro Logo" 
                style={{ 
                    objectFit: 'contain', 
                    height: '6rem', 
                    width: '300px',
                    marginBottom: '1rem' 
                }} 
                />
            <button style={{
                backgroundColor: '#1e3a8a',
                color: 'white',
                padding: '0.75rem 1.5rem', 
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                marginTop: '2rem',
            }}>
                Back to Dashboard
            </button>   
        </div>
        

    </div>
  )
}

export default Page