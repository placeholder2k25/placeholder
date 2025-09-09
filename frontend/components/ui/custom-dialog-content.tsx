'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// Custom DialogContent without close button and prevents closing
const CustomDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    overlayClassName?: string;
    overlayProps?: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;
  }
>(({ className, children, overlayClassName, overlayProps, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay className={overlayClassName} {...overlayProps} />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className
      )}
      onPointerDownOutside={(e) => e.preventDefault()}
      onEscapeKeyDown={(e) => e.preventDefault()}
      {...props}
    >
      {children}
      {/* No close button here */}
    </DialogPrimitive.Content>
  </DialogPortal>
));
CustomDialogContent.displayName = 'CustomDialogContent';

export { CustomDialogContent };