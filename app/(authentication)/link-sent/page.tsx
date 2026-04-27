import React from 'react'
import Image from 'next/image'

function Page() {
  return (
    <div style={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
    }}>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '50%',
            maxWidth: '50rem',
            rowGap: '3rem',
          }}
        >
            <Image
                src= "email_sent.svg"
                width={500}
                height={200}
                alt= "Email Sent Image"
                style={{
                  objectFit: 'contain',
                  height: '11rem',
                width: '300px',
                marginBottom: '1rem'
                }}
            />
            <p
             style={{ fontSize: '3rem', fontWeight: 'bold', color: '#111827', textAlign: 'center' }}>
                Check your Email!
            </p>
            <p
             style={{ fontSize: '1rem', fontWeight: 'bold', color: '#111827', textAlign: 'center' }}>
                If the email you provided is associated with a TriMergePRO account, we’ll send a password reset link shortly. Please follow the instructions in that email to reset your password.
            </p>
            <p
             style={{ fontSize: '1rem', fontWeight: 'bold', color: '#111827', textAlign: 'center' }}>
                If you don’t receive the email, verify that the address is correct or use the button below to resend the link.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                <button style={{
                    backgroundColor: '#1e3a8a',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginRight: '1rem'
                }}>
                    Resend Link
                </button>
                <button style={{
                    backgroundColor: '#1e3a8a   ',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}>
                    Back to Sign in
                </button>
            </div>
        </div>

    </div>
  )
}

export default Page