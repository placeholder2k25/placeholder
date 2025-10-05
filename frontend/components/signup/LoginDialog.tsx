"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomDialogContent } from "@/components/ui/custom-dialog-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { getAuthStatus, login } from "@/lib/api";
import { useGlobalStore } from "@/lib/globalStore";
import { useRouter } from "next/navigation";

interface LoginDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function LoginDialog({ trigger, open, onOpenChange }: LoginDialogProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const setAuth = useGlobalStore((s) => s.setAuth);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRememberMeChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      rememberMe: checked,
    }));
  };

  const togglePasswordVisibility = () => setShowPassword((v) => !v);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login({
        username: formData.username,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      // Immediately refresh auth status and store it
      const status = await getAuthStatus();
      setAuth({
        authenticated: !!status.authenticated,
        username: status.username ?? null,
        roles: status.roles ?? [],
      });

      // Close dialog and redirect to dashboard
      onOpenChange?.(false);
      router.replace("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert("Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const dialogContent = (
    <CustomDialogContent
      className="w-full max-w-[95vw] sm:max-w-[400px] lg:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 border-2 border-purple-200/50 shadow-2xl"
      overlayClassName="bg-black/10"
    >
      <DialogHeader className="text-center space-y-3">
        <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Login
        </DialogTitle>
        <DialogDescription className="text-sm sm:text-base text-gray-600">
          Access your account to continue.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange}
              className={`rounded-xl bg-white/70 backdrop-blur-sm border-purple-200 focus:border-purple-400 focus:ring-purple-400/20 ${
                errors.username ? "border-red-500" : ""
              }`}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className={`rounded-xl bg-white/70 backdrop-blur-sm border-purple-200 focus:border-purple-400 focus:ring-purple-400/20 pr-10 ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="space-y-2">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={handleRememberMeChange}
                className="mt-1"
              />
              <div className="grid gap-1.5 leading-none flex-1">
                <Label
                  htmlFor="rememberMe"
                  className="text-sm font-semibold text-gray-700 leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </Label>
                <p className="text-xs text-muted-foreground">
                  Keep me signed in on this device.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button
            type="submit"
            size="lg"
            colorScheme="primary"
            className="w-full text-base font-medium"
            isLoading={isLoading}
            loadingText="Logging in..."
          >
            Login
          </Button>
        </DialogFooter>
      </form>
    </CustomDialogContent>
  );

  // Prevent dialog from closing unless explicitly allowed
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      return; // ignore external close requests; close programmatically when needed
    }
    onOpenChange?.(newOpen);
  };

  if (trigger) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {dialogContent}
    </Dialog>
  );
}