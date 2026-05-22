"use client"

import { useRegister } from '@/hooks/useRegister';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

function Page() {
    const { register, loading, error, setError } = useRegister();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [terms, setTerms] = useState(false);
    const [updates, setUpdates] = useState(false);
    const [role, setRole] = useState<'Candidate' | 'Recruiter'>('Candidate');

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = {
            name: username,
            email,
            password,
            confirmPassword,
            terms,
            updates,
            role,
        } as const;

        const result = await register(data);
        if (result) {
            router.replace('/email-sent?email=' + encodeURIComponent(email) + '&role=' + encodeURIComponent(role));
        }
    };

    useEffect(() => {
        if (!error) return;
        const t = setTimeout(() => setError(null), 3000);
        return () => clearTimeout(t);
    }, [error, setError]);

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
                        <Image
                            style={{
                                marginTop: '3rem',
                                borderRadius: '0.5rem',
                                width: '70%',
                                height: '90%',
                            }}
                            src='/sign_up.png'
                            alt='Welcome Illustration'
                            width={500}
                            height={300}
                        />
            </div>

            <form
                onSubmit={onSubmit}
                style={{
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
                    <div style={{ color: 'white' }}>Step 1/3</div>
                </span>

                <Link href='/login' style={{ color: 'white', textDecoration: 'underline', marginTop: '1rem' }}>
                    Already have an account? Log in
                </Link>

                <span style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'start',
                    rowGap: '1rem',
                    width: '80%',
                }}>
                    <input type='text' placeholder='Full Name *'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            padding: '0.75rem',
                            border: '1px solid #D1D5DB',
                            width: '90%',
                            borderRadius: '0.375rem',
                            marginTop: '2rem',
                            backgroundColor: 'white',
                        }} />

                    <input type='email' placeholder='Email *'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            padding: '0.75rem',
                            border: '1px solid #D1D5DB',
                            width: '90%',
                            borderRadius: '0.375rem',
                            backgroundColor: 'white',
                        }} />

                    <input type='password' placeholder='Password *'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            padding: '0.75rem',
                            border: '1px solid #D1D5DB',
                            width: '90%',
                            borderRadius: '0.375rem',
                            backgroundColor: 'white',
                        }} />

                    <input type='password' placeholder='Confirm Password *'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{
                            padding: '0.75rem',
                            border: '1px solid #D1D5DB',
                            width: '90%',
                            borderRadius: '0.375rem',
                            backgroundColor: 'white',
                        }} />
                </span>

                <div style={{ color: 'white', marginTop: '1rem', fontSize: '1rem' }}>
                    Are you a Candidate or a Recruiter?
                </div>

                <span style={{
                    marginTop: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '70%',
                }}>
                    <div
                        onClick={(e) => { e.preventDefault(); setRole('Candidate') }}
                        style={{
                            backgroundColor: `${role === 'Candidate' ? '#1e3a8a' : '#3b82f6'}`,
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                        }}>
                        Candidate
                    </div>

                    <div
                        onClick={(e) => { e.preventDefault(); setRole('Recruiter') }}
                        style={{
                            backgroundColor: `${role === 'Recruiter' ? '#1e3a8a' : '#3b82f6'}`,
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                        }}>
                        Recruiter
                    </div>
                </span>

                {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}

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
                        <input type='checkbox' id='terms' name='terms'
                            checked={terms}
                            onChange={(e) => setTerms(e.target.checked)}
                        />
                        <label htmlFor='terms' style={{ color: 'white' }}>
                            I agree to the Terms and Conditions
                        </label>
                    </span>

                    <span style={{
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'initial',
                        columnGap: '0.5rem',
                    }}>
                        <input type='checkbox' id='updates' name='updates'
                            checked={updates}
                            onChange={(e) => setUpdates(e.target.checked)}
                        />
                        <label htmlFor='updates' style={{ color: 'white' }}>
                            I’d like to receive updates, job opportunities, and news from TriMergePro
                        </label>
                    </span>
                </span>

                <button type='submit' disabled={loading} style={{
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
                    {loading ? 'Signing up...' : 'Sign up'}
                </button>
            </form>
        </div>
    )
}

export default Page