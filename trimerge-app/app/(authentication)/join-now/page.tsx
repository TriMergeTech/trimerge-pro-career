import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Page() {
  return (
    <div style={{
        minHeight: '90vh',
        display: 'flex',
        paddingTop: '2rem',
        justifyContent: 'space-around',
        paddingBottom: '2rem',
    }}>
        <div style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'start',
            width: '50%',
            paddingLeft: '3rem',
        }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#111827', textAlign: 'center' }}>
                Welcome to TrimergePRO
            </h1>
            <div style={{ fontSize: '1.25rem', color: '#6B7280', textAlign: 'center', marginTop: '3rem' }}>
                Connecting top IT professionals with leading organizations across Florida and beyond. Create your account to get started.
            </div>
            <img
            style={{
                marginTop: '3rem',
                borderRadius: '0.5rem',
                width: '70%',
                height: '90%',
            }}
             src="sign_up.png"
             alt="Welcome Illustration"
             width={500}
             height={300}
            />
        </div>
        <form style={{
            maxHeight: '90vh',
            height: 'fit-content',
            paddingBottom: '2rem',
            display: 'flex',
            alignItems: 'start',
            flexDirection: 'column',
            justifyContent: 'start',
            width: '40%',
            backgroundColor: '#0b1f3a',
            marginRight: '3rem',
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
                    Create Account
                </h1>
                <div style={{ color: 'white'}}>
                    Step 1/3
                </div>
            </span>
            <Link href="/(authentication)/login" style={{ color: 'white', textDecoration: 'underline', marginTop: '1rem' }}>
                Already have an account? Log in
            </Link>
            <span style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'start',
                rowGap: '1rem',
                width: '80%',
            }}>
                <input type="text" placeholder="Full Name *" style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    width: '90%',
                    borderRadius: '0.375rem',
                    marginTop: '2rem',
                    backgroundColor: 'white',
                }}/>
                <input type="email" placeholder="Email *" style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    width: '90%',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                }}/>
                <input type="password" placeholder="Password *" style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    width: '90%',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                }}/>
                <input type="password" placeholder="Confirm Password *" style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    width: '90%',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                }}/>
            </span>
            <div style={{ color: 'white', marginTop: '1rem', fontSize: '1rem' }}>
                Are you a Candidate or a Recruiterd?
            </div>
            <span style={{
                marginTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                width: '70%',
            }}>
                <button style={{
                    backgroundColor: '#1e3a8a',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                }}>
                    Candidate
                </button>
                <button style={{
                    backgroundColor: '#1e3a8a',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                }}>
                    Recruiter
                </button>
            </span>
            <span style={{
                marginTop: '2rem',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'start',
                rowGap: '1rem',
            }}>
                <span style={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'initial',
                    columnGap: '0.5rem',
                }}>
                    <input type="checkbox" id="terms" name="terms" required />
                    <label htmlFor="terms" style={{ color: 'white' }}>
                        I agree to the Terms and Conditions
                    </label>
                </span>
                <span style={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'initial',
                    columnGap: '0.5rem',
                }}>
                    <input type="checkbox" id="terms" name="terms" required />
                    <label htmlFor="terms" style={{ color: 'white' }}>
                        I’d like to receive updates, job opportunities, and news from TriMergePro
                    </label>
                </span>
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
                Sign up
            </button>
        </form>
    </div>
  )
}

export default Page