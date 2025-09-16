"use client";

import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import Link from 'next/link';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    console.log('Signup attempt with:', { name, surname, email, password, confirmPassword });

    try {
      await axios.post('/api/auth', {
        path: 'signup',
        name,
        surname,
        email,
        password,
        confirmPassword,
      });
      console.log('Signup successful, redirecting to login');
      router.push('/login');
    } catch (err: any) {
      console.error('Signup error:', err.response?.data);
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError('');
    console.log('Google Sign-In token:', credentialResponse.credential);

    try {
      const response = await axios.post('/api/auth', {
        path: 'google-signin',
        token: credentialResponse.credential,
      });
      console.log('Google Sign-In response:', response.data);
      const { token } = response.data;
      localStorage.setItem('jwt', token);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Google Sign-In error:', err.response?.data);
      setError(err.response?.data?.error || 'Google Sign-In failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Sign-In failed');
    setError('Google Sign-In failed. Please try again.');
    setIsLoading(false);
  };

  return (
    <GoogleOAuthProvider clientId="271708094220-rfusl4se011i83q11uc18ephe5kog4ve.apps.googleusercontent.com">
      <form onSubmit={handleSignup} className="w-full max-w-md space-y-6 bg-white rounded-lg shadow-lg p-8 border-t-4 border-t-[#ffd215]">
        <div className="flex justify-center mb-6">
          <img src="/tmof logo.png" alt="TMOF Couriers Logo" className="h-12" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Sign Up</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="space-y-2">
          <Label htmlFor="name">First Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              id="name"
              type="text"
              placeholder="John"
              className="pl-10"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="surname">Last Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              id="surname"
              type="text"
              placeholder="Doe"
              className="pl-10"
              value={surname}
              onChange={e => setSurname(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="pl-10"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="pl-10 pr-10"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className="pl-10 pr-10"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-[#ffd215] hover:bg-[#e5bd13] text-black"
          disabled={isLoading}
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </Button>
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center my-2">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="mx-3 text-xs text-gray-400">or continue with</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            text="signup_with"
            shape="rectangular"
            width="400"
          />
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-tmof-red font-semibold hover:underline">Sign in</Link>
          </div>
        </div>
      </form>
    </GoogleOAuthProvider>
  );
}