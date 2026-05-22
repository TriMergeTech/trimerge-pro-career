"use client"

import { useUser } from '@/contexts/userContext/userContext';
import { useLogin } from '@/hooks/useLogin';
import  Link  from 'next/link';
import React, { useEffect, useState } from 'react';

function LoginPage() {
  const { login, loading, error, setError } = useLogin(); 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {state} = useUser()
  useEffect(()=>{
    console.log(state)
  }, [])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = await login({ email, password });

    if(!error){
      alert("You have logged in")
      console.log(state)
    }
  }
  // Colors from your colors.json reference
  const colors = {
    primary: '#3B82F6',
    accentGreen: '#10B981',
    accentGreenHover: '#059669',
    neutralBorder: '#E5E7EB',
    neutralText: '#111827',
    background: '#F8FAFC',
    darkHeader: '#0b1f3a',
    formBorder: '#F59E0B'
  };
  

  return (
    <div style={{ 
      minHeight: '90vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: colors.background, 
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Curved Section */}
      <div
        style={{
          position: 'absolute',
          width: '100vw',
          height: '75%',
          backgroundColor: colors.darkHeader,
          top: 0,
          left: 0,
          zIndex: 0,
          borderBottomRightRadius: '10% 12%',
          borderBottomLeftRadius: '10% 12%',
        }}
      />

      {/* Login Form Container */}
      <form 
      onSubmit={onSubmit}
        style={{
          width: '50%',
          maxWidth: '50rem', // max-w-sm
          minHeight: '50vh',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: `2px solid ${colors.formBorder}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '15px',
          paddingBottom: '15px',
          zIndex: 2,
          backgroundColor: 'white',
          borderRadius: '0.75rem'
        }}
      >
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
        
        <h2 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          marginBottom: '1.5rem', 
          color: 'black', 
          textAlign: 'center' 
        }}>
          Log In
        </h2>

        {/* Email Field */}
        <div style={{ marginBottom: '1rem', width: '100%' }}>
          <label 
            htmlFor="email"
            style={{ 
              display: 'block', 
              color: colors.neutralText, 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              marginBottom: '0.5rem' 
            }}
          >
            Email
          </label>
          <input
          onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            placeholder="you@email.com"
            required
            style={{
              width: '100%',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              border: `1px solid ${colors.neutralBorder}`,
              borderRadius: '0.375rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: '1.5rem', width: '100%' }}>
          <label 
            htmlFor="password"
            style={{ 
              display: 'block', 
              color: colors.neutralText, 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              marginBottom: '0.5rem' 
            }}
          >
            Password
          </label>
          <input
          onChange={(e)=>{setPassword(e.target.value)}}
            type="password"
            id="password"
            placeholder="••••••••"
            required
            style={{
              width: '100%',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              border: `1px solid ${colors.neutralBorder}`,
              borderRadius: '0.375rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
          {error && (
            <div style={{ color: 'red', marginBottom: '1rem' }}>
              {error}
            </div>
          )}
        {/* Submit Button */}
        <button
          type="submit"
          style={{
            width: '100%',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            marginTop: '1.25rem',
            backgroundColor: colors.darkHeader,
            color: 'white',
            fontWeight: 600,
            borderRadius: '0.375rem',
            border: 'none',
            cursor: `${loading ? 'not-allowed' : 'pointer'}`,
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        <Link href="/forgot-password" style={{ marginTop: '1rem',width: '40%', display: 'block', textAlign: 'left', color: colors.primary, textDecoration: 'underline', textDecorationColor: colors.formBorder }}>
          Forgot Password?
        </Link>
        <span  style={{ marginTop: '1rem', width: '40%', textAlign: 'left', alignContent: 'center', color: colors.neutralText, display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
           Don't have an account?
          <Link href="/signup" style={{ display: 'block', textAlign: 'left', color: colors.primary, textDecoration: 'underline', textDecorationColor: colors.formBorder }}>
            Join now
          </Link>
        </span>
      </form>
    </div>
  );
}

export default LoginPage;