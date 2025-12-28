'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PasswordGate({ children, projectTitle }: { children: React.ReactNode, projectTitle: string }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple hardcoded password for now
        if (password === '1234') {
            setIsAuthenticated(true);
            setError(false);
        } else {
            setError(true);
        }
    };

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            {/* Header */}
            <div className="fixed left-0 top-0 p-[48px] z-10">
                <div className="flex items-center gap-1 text-[16px]">
                    <Link href="/" className="underline hover:no-underline">
                        Projects
                    </Link>
                    <span>/</span>
                    <span>{projectTitle}</span>
                </div>
            </div>

            <div className="flex min-h-screen items-center justify-center">
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="relative flex justify-center">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (error) setError(false);
                            }}
                            placeholder="Password"
                            className={`w-full text-center text-[64px] md:text-[220px] leading-none tracking-[-4px] outline-none bg-transparent placeholder:text-zinc-300 ${error ? 'text-red-500' : (password.length > 0 ? 'text-black' : 'text-zinc-500')}`}
                            autoFocus
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
