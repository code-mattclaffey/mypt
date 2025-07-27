'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  title?: string;
}

export default function AppLayout({ children, showBackButton = false, title }: AppLayoutProps) {
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('healthAssistant_profile');
    setHasProfile(!!savedProfile);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <header className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔄</span>
            <h1 className="text-xl font-black tracking-tight text-slate-100 font-sans">
              HealthSync
            </h1>
            {title && <span className="text-slate-400 ml-2">• {title}</span>}
          </div>
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={() => router.back()}
                className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-all duration-200 font-medium cursor-pointer"
              >
                Back
              </button>
            )}
            <button
              onClick={() => router.push(hasProfile ? "/dashboard" : "/sign-up")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium cursor-pointer"
            >
              {hasProfile ? 'Dashboard' : 'Get Started'}
            </button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}