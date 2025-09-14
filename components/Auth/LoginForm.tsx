"use client";

import React, { FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Replace with your login logic
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <form onSubmit={handleLogin} className="w-full max-w-md space-y-6 bg-white rounded-lg shadow-lg p-8 border-t-4 border-t-[#ffd215]">
      <div className="flex justify-center mb-6">
        <img src="/tmof logo.png" alt="TMOF Couriers Logo" className="h-12" />
      </div>
      <h2 className="text-2xl font-bold text-center mb-2">Sign In</h2>
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
      <Button
        type="submit"
        className="w-full bg-[#ffd215] hover:bg-[#e6bd13] text-black"
        disabled={isLoading}
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center my-2">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-3 text-xs text-gray-400">or continue with</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <Button type="button" className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-2">
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M24 9.5c3.54 0 6.72 1.22 9.22 3.22l6.88-6.88C35.62 2.06 30.13 0 24 0 14.61 0 6.27 5.61 1.82 13.78l8.46 6.58C12.36 13.36 17.74 9.5 24 9.5z" fill="#EA4335"/><path d="M46.09 24.5c0-1.54-.14-3.03-.41-4.47H24v8.47h12.44c-.54 2.91-2.18 5.38-4.65 7.04l7.23 5.62C43.98 37.13 46.09 31.29 46.09 24.5z" fill="#4285F4"/><path d="M10.28 28.36c-1.13-3.36-1.13-6.96 0-10.32l-8.46-6.58C.64 15.61 0 19.7 0 24c0 4.3.64 8.39 1.82 12.54l8.46-6.58z" fill="#FBBC05"/><path d="M24 48c6.13 0 11.62-2.02 15.95-5.5l-7.23-5.62c-2.01 1.35-4.59 2.13-8.72 2.13-6.26 0-11.64-3.86-13.72-9.36l-8.46 6.58C6.27 42.39 14.61 48 24 48z" fill="#34A853"/><path d="M46.09 24.5c0-1.54-.14-3.03-.41-4.47H24v8.47h12.44c-.54 2.91-2.18 5.38-4.65 7.04l7.23 5.62C43.98 37.13 46.09 31.29 46.09 24.5z" fill="#4285F4"/></g></svg>
          Login with Google
        </Button>
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-tmof-red font-semibold hover:underline">Sign up</Link>
        </div>
      </div>
    </form>
  );
}