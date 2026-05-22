'use client'

import { useResendEmail } from '@/hooks/useResendEmail';
import { useVerifyEmail } from '@/hooks/useVerifyEmail';
import Image from 'next/image'
import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/contexts/userContext/userContext';

function Page() {
        const [code, setCode] = React.useState(['', '', '', '', '', '']);
        const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);
        const {setUser } = useUser()
    const { resend, loading: resendLoading, error: resendError } = useResendEmail();
    const {verify, loading: verifying, error: verifyError, setError} = useVerifyEmail();
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromQuery = searchParams?.get('email') || '';
    const roleFromQuery = searchParams?.get('role') || '';
    const [message, setMessage] = React.useState<string | null>(null);

    const callVerify = async () => {
        // assemble otp
        const otp = code.join('');
        if (otp.length !== code.length) {
            setMessage('Please enter the complete verification code.');
            return;
        }
        setMessage(null);
        const result = await verify({ email: emailFromQuery, otp });
        setUser(result)

        if (result) {
            if(roleFromQuery.toLocaleLowerCase() === 'candidate') {
                router.replace('/personal-information/step-one');
                return;
            }else if(roleFromQuery.toLocaleLowerCase() === 'recruiter') {
                router.replace('/recruiter-information/step-one');
                return;
            }
        }
    }


    useEffect(()=>{
        setTimeout(() => {
            if(verifyError) {
                setError(null);
            }
        }, 3000);
    }, [verifyError]);

    useEffect(() => {
        setTimeout(() => {
            if (resendError) {
                setError(null);
            }
        }, 3000);
    }, [resendError]);

    useEffect(() => {
        setTimeout(() => {
            if (message) {
                setMessage(null);
            }
        }, 3000);
    }, [message]);

        const focusInput = (idx: number) => {
            const el = inputsRef.current[idx];
            if (el) el.focus();
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
            const val = e.target.value.replace(/\D/g, ''); // only digits
            if (!val) {
                const newCode = [...code];
                newCode[idx] = '';
                setCode(newCode);
                return;
            }

            // if user typed/pasted multiple digits into one box, take first and distribute via paste handler
            const char = val[0];
            const newCode = [...code];
            newCode[idx] = char;
            setCode(newCode);
            // move focus to next
            if (idx < inputsRef.current.length - 1) {
                focusInput(idx + 1);
            }
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
            if (e.key === 'Backspace') {
                if (code[idx]) {
                    // clear current value
                    const newCode = [...code];
                    newCode[idx] = '';
                    setCode(newCode);
                } else if (idx > 0) {
                    // move back
                    focusInput(idx - 1);
                    const newCode = [...code];
                    newCode[idx - 1] = '';
                    setCode(newCode);
                }
            } else if (e.key === 'ArrowLeft' && idx > 0) {
                focusInput(idx - 1);
            } else if (e.key === 'ArrowRight' && idx < inputsRef.current.length - 1) {
                focusInput(idx + 1);
            }
        };

        const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
            e.preventDefault();
            const paste = e.clipboardData.getData('text') || '';
            const digits = paste.replace(/\D/g, '').slice(0, code.length);
            if (!digits) return;
            const newCode = [...code];
            for (let i = 0; i < digits.length; i++) {
                newCode[i] = digits[i];
            }
            setCode(newCode);
            // focus the next empty or last filled
            const nextIndex = Math.min(digits.length, code.length - 1);
            focusInput(nextIndex);
        };

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
            <Image src="/logo.png" alt="Email Sent Illustration" width={120} height={80} />
            <h1 style={{
                fontSize: '1rem',
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: '2rem',
                width: '40%',
                textAlignLast: 'center',
            }}>
                We’ve sent a verification code to your email. Check your inbox and enter the code to verify your account and complete your sign-up.
            </h1>
                        <span style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '40%',
                                marginTop: '3rem',
                        }} onPaste={handlePaste}>
                                {code.map((c, i) => (
                                                        <input
                                                            key={i}
                                                            ref={((el: HTMLInputElement | null) => {
                                                                (inputsRef.current as Array<HTMLInputElement | null>)[i] = el;
                                                                return undefined;
                                                            }) as React.LegacyRef<HTMLInputElement>}
                                        inputMode="numeric"
                                        pattern="\d*"
                                        maxLength={1}
                                        aria-label={`digit-${i + 1}`}
                                        value={c}
                                        onChange={(e) => handleChange(e, i)}
                                        onKeyDown={(e) => handleKeyDown(e, i)}
                                        style={{
                                            width: '3rem',
                                            height: '3rem',
                                            textAlign: 'center',
                                            fontSize: '1.25rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #d1d5db',
                                            boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.03)',
                                            outline: 'none',
                                        }}
                                    />
                                ))}
                        </span>
         
                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: '0.5rem' }}>
                            {verifyError && <div style={{ color: '#fda4af', marginBottom: '0.5rem' }}>{verifyError}</div>}
                            {message && <div style={{ color: '#bbf7d0', marginBottom: '0.5rem' }}>{message}</div>}
                            <button
                                onClick={callVerify}
                                disabled={verifying}
                                style={{
                                    backgroundColor: '#1e3a8a',
                                    color: 'white',
                                    padding: '0.75rem 1.5rem',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    cursor: verifying ? 'not-allowed' : 'pointer',
                                    marginTop: '0',
                                    justifySelf: 'center',
                                }}
                            >
                                {verifying ? 'Verifying…' : 'Verify'}
                            </button>
                        </div>
                        <h2>
                                Didn’t receive the email?{' '}
                                <button
                                    onClick={async () => {
                                        setMessage(null);
                                        if (!emailFromQuery) {
                                            setMessage('No email available to resend to.');
                                            return;
                                        }
                                        const res = await resend({ email: emailFromQuery });
                                        if (res) {
                                            setMessage('Verification email resent. Check your inbox.');
                                        }
                                    }}
                                    disabled={resendLoading}
                                    style={{ background: 'none', border: 'none', padding: 0, color: '#1e40af', textDecoration: 'underline', cursor: resendLoading ? 'not-allowed' : 'pointer' }}
                                >
                                    {resendLoading ? 'Resending…' : 'Resend Code'}
                                </button>
                        </h2>
                        {resendError && <div style={{ color: '#fecaca' }}>{resendError}</div>}
        </div>
        

    </div>
  )
}

export default Page