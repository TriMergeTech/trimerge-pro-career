"use client"

import Link from 'next/link';
import React from 'react';

function SignupPage() {
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

      {/* Signup Form Container */}
      <form
        style={{
          width: '50%',
          maxWidth: '50rem',
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
          Sign Up
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
        {/* Username Field */}
        <div style={{ marginBottom: '1rem', width: '100%' }}>
          <label
            htmlFor="username"
            style={{
              display: 'block',
              color: colors.neutralText,
              fontSize: '0.875rem',
              fontWeight: 500,
              marginBottom: '0.5rem'
            }}
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Choose a username"
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
        <div style={{ marginBottom: '1rem', width: '100%' }}>
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
            type="password"
            id="password"
            placeholder="Create a password"
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
        {/* Confirm Password Field */}
        <div style={{ marginBottom: '1.5rem', width: '100%' }}>
          <label
            htmlFor="confirmPassword"
            style={{
              display: 'block',
              color: colors.neutralText,
              fontSize: '0.875rem',
              fontWeight: 500,
              marginBottom: '0.5rem'
            }}
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Re-enter your password"
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
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          Sign Up
        </button>
        <span style={{ marginTop: '1rem', width: '40%', textAlign: 'left', alignContent: 'center', color: colors.neutralText, display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          Already have an account?
          <Link href="/login" style={{ display: 'block', textAlign: 'left', color: colors.primary, textDecoration: 'underline', textDecorationColor: colors.formBorder }}>
            Log in
          </Link>
        </span>
      </form>
    </div>
  );
}

export default SignupPage;
