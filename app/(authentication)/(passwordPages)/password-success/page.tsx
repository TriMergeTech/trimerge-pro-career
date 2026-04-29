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
            <Image
                src="success.svg"
                alt="Success Illustration"
                width={400}
                height={200}
                style={{ marginTop: '3rem' }}
            />
            <div style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: '2rem',
                width: '70%',
                textAlignLast: 'center',
            }}>
                Your password has been updated successfully. You’re all set—go ahead and log in with your new credentials.
            </div>
            <button style={{
                backgroundColor: '#1e3a8a',
                color: 'white',
                padding: '0.75rem 1.5rem', 
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                marginTop: '2rem',
            }}>
                Back to Sign in
            </button>   
        </div>
        

    </div>
  )
}

export default Page