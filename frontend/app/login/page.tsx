'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/globalStore';
import { LoginDialog } from '@/components/signup/LoginDialog';

export default function LoginPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { authenticated, loading } = useAuth();

  useEffect(() => {
    setIsDialogOpen(true);
  }, []);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (!loading && authenticated === true) {
      router.replace('/dashboard');
    }
  }, [authenticated, loading, router]);

  if (authenticated === true) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LoginDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}