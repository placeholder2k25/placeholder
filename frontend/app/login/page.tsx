'use client';

import React, { useEffect, useState } from 'react';
import { LoginDialog } from '@/components/signup/LoginDialog';

export default function LoginPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsDialogOpen(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LoginDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}