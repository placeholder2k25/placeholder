'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/globalStore';
import { SignUpDialog } from '@/components/signup/SignUpDialog';

export default function SignUpPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { authenticated, loading } = useAuth();

  useEffect(() => {
    setIsDialogOpen(true);
  },[])

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (!loading && authenticated === true) {
      router.replace('/dashboard');
    }
  }, [authenticated, loading, router]);

  if (authenticated === true) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SignUpDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}