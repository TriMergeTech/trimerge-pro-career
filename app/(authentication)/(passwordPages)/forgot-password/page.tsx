import Image from 'next/image'
import React from 'react'

function Page() {
  return (
    <div style={{
        minHeight: '86vh',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingBottom: '2rem',
    }}>
        <div style={{
            height: '50vh',
            width: '90vw',            
            backgroundColor: '#0b1f3a',
            borderTopLeftRadius: '0.8rem',
            borderBottomLeftRadius: '0.8rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            justifyContent: 'center',
            paddingLeft: '3rem',
            position: 'relative',
        }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                Forgot Password?
            </h1>
            <div style={{ fontSize: '1.25rem', color: '#6B7280', marginTop: '3rem', width: '40%' }}>
                No worries, we will send you reset link. Please provide your email. 
            </div>
            <input type="email" placeholder="Email *" style={{
                padding: '0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                marginTop: '2rem',
                width: '40%',
                backgroundColor: 'white',
            }} />
            <hr style={{ border: '1px solid #f5a929', marginTop: '2rem', width: '40%' }} />
            <span style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '40%',
            }}>
                <button style={{
                    backgroundColor: '#1e3a8a',
                    color: 'white',
                    width: '45%',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '1rem'
                }}>
                    Send Reset Link
                </button>
                <button style={{
                    backgroundColor: '#1e3a8a',
                    color: 'white',
                    width: '45%',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '1rem'
                }}>
                    Cancel
                </button>

            </span>
            <Image
                src="forgot.svg"
                alt='Forgot Password Illustration'
                width={500}
                height={200}
                style={{
                    position: 'absolute',
                    bottom: '220px',
                    right: '225px',
                    zIndex: '0',
                }}
            />
        </div>

                
    </div>
  )
}

export default Page