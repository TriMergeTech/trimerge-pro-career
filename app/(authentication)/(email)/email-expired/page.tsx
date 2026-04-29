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
            <Image src="warning.svg" alt="Warning Illustration"
                width={200}
                height={200}
                style={{ width: 'fit-content', height: '80px' }}/>
            <h1 style={{
                fontSize: '1rem',
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: '2rem',
                width: '40%',
                textAlignLast: 'center',
            }}>
                Invalid or Expired Verification Link
            </h1>
            <div style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                textAlign: 'center',
                width: '40%',
                textAlignLast: 'center',
                marginTop: '1rem',
            }}>
                This verification link has expired or is invalid. Click the button below to request a new one—we’ll send it to your email address.
            </div>
            <span style={{
                display: 'flex',
                width: '80%',
                justifyContent: 'space-around',
            }}
                >
                
                <button style={{
                    backgroundColor: '#1e3a8a',
                    color: 'white',
                    padding: '0.75rem 1.5rem', 
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    marginTop: '2rem',
                }}>
                    Resend Verification Link
                </button>   
                
                <button style={{
                    backgroundColor: '#1e3a8a',
                    color: 'white',
                    padding: '0.75rem 1.5rem', 
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    marginTop: '2rem',
                }}>
                    Back to Sign Up Page
                </button>   

            </span>
        </div>
        

    </div>
  )
}

export default Page