'use client';

import React, { useEffect, useState } from 'react';
import { SignUpDialog } from '@/components/signup/SignUpDialog';

export default function SignUpPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsDialogOpen(true);
  },[])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Dialog without trigger (controlled by state) */}
      {/* This is an alternative approach if you want to control the dialog programmatically */}
      
      <SignUpDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
     
    </div>
  );
}