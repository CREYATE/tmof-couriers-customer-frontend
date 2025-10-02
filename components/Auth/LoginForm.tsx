"use client";

import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        // console.log('Login attempt with:', { emailOrUsername: email, password });

        try {
            const response = await axios.post('/api/auth', {
                path: 'login',
                emailOrUsername: email,
                password,
            });
            // console.log('Login response:', response.data);
            const { token } = response.data;
            localStorage.setItem('jwt', token);
            router.push('/dashboard');
        } catch (err: any) {
            // console.error('Login error:', err.response?.data);
            const errorMessage = err.response?.data?.error || 'Login failed. Please check your email and password.';
            setError(errorMessage);
            if (errorMessage.includes('This account uses Google Sign-In')) {
                setError('This account uses Google Sign-In. Please use the Google Sign-In button.');
            } else if (errorMessage.includes('Invalid credentials')) {
                setError('Incorrect email or password. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setIsLoading(true);
        setError('');
        // console.log('Google Sign-In token:', credentialResponse.credential);

        try {
            const response = await axios.post('/api/auth', {
                path: 'google-signin',
                token: credentialResponse.credential,
            });
            // console.log('Google Sign-In response:', response.data);
            const { token } = response.data;
            localStorage.setItem('jwt', token);
            router.push('/dashboard');
        } catch (err: any) {
            // console.error('Google Sign-In error:', err.response?.data);
            setError(err.response?.data?.error || 'Google Sign-In failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        // console.error('Google Sign-In failed');
        setError('Google Sign-In failed. Please try again or contact support.');
        setIsLoading(false);
    };

    return (
        <GoogleOAuthProvider clientId="271708094220-rfusl4se011i83q11uc18ephe5kog4ve.apps.googleusercontent.com">
            <form onSubmit={handleLogin} className="w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6 bg-white rounded-xl shadow-xl p-6 sm:p-8 border-t-4 border-t-[#ffd215] mx-auto">
                <div className="flex justify-center mb-4 sm:mb-6">
                    <img src="/tmof logo.png" alt="TMOF Couriers Logo" className="h-10 sm:h-12" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 text-[#0C0E29]">Sign In</h2>
                {error && <p className="text-red-500 text-center text-sm sm:text-base bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm sm:text-base font-semibold text-[#0C0E29]">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 sm:top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            className="pl-10 sm:pl-10 py-3 sm:py-2.5 text-base sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent touch-manipulation"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm sm:text-base font-semibold text-[#0C0E29]">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 sm:top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className="pl-10 pr-12 py-3 sm:py-2.5 text-base sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd215] focus:border-transparent touch-manipulation"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 sm:top-2.5 text-gray-400 hover:text-gray-600 touch-manipulation p-1"
                        >
                            {showPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                        </button>
                    </div>
                </div>
                <Button
                    type="submit"
                    className="w-full bg-[#ffd215] hover:bg-[#e6bd13] text-black font-semibold py-3 sm:py-2.5 text-base sm:text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation"
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
                <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center my-2">
                        <div className="flex-grow h-px bg-gray-200" />
                        <span className="mx-3 text-xs sm:text-sm text-gray-400">or continue with</span>
                        <div className="flex-grow h-px bg-gray-200" />
                    </div>
                    <div className="w-full">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            theme="outline"
                            size="large"
                            text="signin_with"
                            shape="rectangular"
                            width="100%"
                        />
                    </div>
                    <div className="text-center text-sm sm:text-base text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-[#0C0E29] font-semibold hover:underline hover:text-[#ffd215] transition-colors">Sign up</Link>
                    </div>
                </div>
            </form>
        </GoogleOAuthProvider>
    );
}