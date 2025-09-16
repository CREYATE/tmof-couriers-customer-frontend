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
        console.log('Login attempt with:', { emailOrUsername: email, password });

        try {
            const response = await axios.post('/api/auth', {
                path: 'login',
                emailOrUsername: email,
                password,
            });
            console.log('Login response:', response.data);
            const { token } = response.data;
            localStorage.setItem('jwt', token);
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Login error:', err.response?.data);
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
        setError('Google Sign-In failed. Please try again or contact support.');
        setIsLoading(false);
    };

    return (
        <GoogleOAuthProvider clientId="271708094220-rfusl4se011i83q11uc18ephe5kog4ve.apps.googleusercontent.com">
            <form onSubmit={handleLogin} className="w-full max-w-md space-y-6 bg-white rounded-lg shadow-lg p-8 border-t-4 border-t-[#ffd215]">
                <div className="flex justify-center mb-6">
                    <img src="/tmof logo.png" alt="TMOF Couriers Logo" className="h-12" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">Sign In</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
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
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme="outline"
                        size="large"
                        text="signin_with"
                        shape="rectangular"
                        width="400"
                    />
                    <div className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-tmof-red font-semibold hover:underline">Sign up</Link>
                    </div>
                </div>
            </form>
        </GoogleOAuthProvider>
    );
}