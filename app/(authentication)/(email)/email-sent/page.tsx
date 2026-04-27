import Image from 'next/image'
import React from 'react'

function Page() {
  return (  
    <div style={{
        minHeight: '90vh',
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        backgroundColor: 'white',
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
            paddingTop: '7rem',
            width: '80%',
            height: '90%',
            borderBottomLeftRadius: '0.5rem',
            borderBottomRightRadius: '0.5rem',
            border: '2px solid #f5a929',
            borderTop: 'none',
            alignItems: 'center',
            justifyContent: 'start ',
        }}>
            <img src="logo.png" alt="Email Sent Illustration" style={{ width: 'fit-content', height: '80px' }}/>
            <h1 style={{
                fontSize: '1rem',
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: '2rem',
                width: '40%',
                textAlignLast: 'center',
            }}>
                We’ve sent a verification link to your email. Check your inbox and follow the instructions to verify your account and complete your sign-up.
            </h1>
            <Image
                src="email.svg"
                alt="Email Sent Illustration"
                width={200}
                height={200}
                style={{ marginTop: '3rem' }}
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
                Home Page
            </button>   
        </div>
        

    </div>
  )
}

export default Page