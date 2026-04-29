import Image from 'next/image'
import React from 'react'

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
                position: 'relative',
                width: '50%',
                maxWidth: '50rem',
            }}>
                <form style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    justifyContent: 'center',
                    width: '100%',
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '0.5rem',
                    border: '2px solid #f5a929',  
                    rowGap: '1rem',
                    paddingBottom: '7rem',
                    position: 'relative',
                    zIndex: 1
                }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#111827', textAlign: 'center' }}>
                    Reset Password
                </h1>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', rowGap: '1rem' }}>
                    <input type="password" placeholder="New Password *" style={{
                        padding: '0.75rem',
                        border: '1px solid #D1D5DB',
                        width: '50%'
                    }}/>
                    <input type="password" placeholder="Confirm New Password *" style={{
                        padding: '0.75rem',
                        border: '1px solid #D1D5DB',
                        width: '50%'
                    }}/>
                </div>
                <button style={{
                    backgroundColor: '#1e3a8a',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '1rem'
                }}>
                    Confirm New Password
                </button>
                </form>
                <Image
                    src= "reset_password.svg"
                    width={500}
                    height={200}
                    alt= "Email Sent Image"
                    style={{
                        objectFit: 'contain',
                        height: '15rem',
                    width: '350px',
                    marginBottom: '1rem',
                    position: 'absolute',
                    bottom: '-17%',
                    right: '-11%',
                    zIndex: 10,
                    pointerEvents: 'none',
                    userSelect: 'none',
                    }}
                />
            </div>
    </div>
  )
}

export default Page