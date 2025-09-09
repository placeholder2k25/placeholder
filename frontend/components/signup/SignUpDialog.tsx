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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { register } from "@/lib/api";
import { BrandRegistrationDialogbox } from "@/components/signup/BrandRegistrationDialogbox";
import { CreatorRegistrationDialogbox } from "@/components/signup/CreatorRegistrationDialogbox";

interface SignUpDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SignUpDialog({
  trigger,
  open,
  onOpenChange,
}: SignUpDialogProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    isCreator: false,
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Control follow-up dialogs after signup based on role
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
  const [isCreatorDialogOpen, setIsCreatorDialogOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isCreator: checked,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      acceptTerms: checked,
    }));

    // Clear error when user accepts terms
    if (errors.acceptTerms) {
      setErrors((prev) => ({
        ...prev,
        acceptTerms: "",
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // const prevUsername = formData.username;

      const data = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phoneNumber: formData.phoneNumber,
        isCreator: formData.isCreator,
        termsAccepted: formData.acceptTerms,
        role: formData.isCreator ? "creator" : "brand",
      });

      // Persist username and role to localStorage
      if (data?.username && data?.role) {
        try {
          localStorage.setItem("username", data.username);
          localStorage.setItem("role", data.role);
        } catch (e) {
          console.warn("Unable to access localStorage:", e);
        }
      }

      // Reset form on success
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        isCreator: false,
        acceptTerms: false,
      });

      // Close signup dialog
      onOpenChange?.(false);

      // Open the appropriate registration dialog based on role in localStorage
      const role = (typeof window !== "undefined" ? localStorage.getItem("role") : null) || data.role;
      if (role === "brand") {
        setIsBrandDialogOpen(true);
      } else if (role === "creator") {
        setIsCreatorDialogOpen(true);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const dialogContent = (
    <CustomDialogContent
      className="w-full max-w-[95vw] sm:max-w-[500px] lg:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 border-2 border-purple-200/50 shadow-2xl"
      overlayClassName="bg-black/10"
    >
      <DialogHeader className="text-center space-y-3">
        <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Create Account
        </DialogTitle>
        <DialogDescription className="text-sm sm:text-base text-gray-600">
          Join our platform and start connecting with brands and creators today.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Grid container for form fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Username */}
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-sm font-semibold text-gray-700"
            >
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

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className={`rounded-xl bg-white/70 backdrop-blur-sm border-purple-200 focus:border-purple-400 focus:ring-purple-400/20 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-semibold text-gray-700"
            >
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
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-semibold text-gray-700"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`rounded-xl bg-white/70 backdrop-blur-sm border-purple-200 focus:border-purple-400 focus:ring-purple-400/20 pr-10 ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label
              htmlFor="phoneNumber"
              className="text-sm font-semibold text-gray-700"
            >
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={`rounded-xl bg-white/70 backdrop-blur-sm border-purple-200 focus:border-purple-400 focus:ring-purple-400/20 ${
                errors.phoneNumber ? "border-red-500" : ""
              }`}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Account Type Switch */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              Account Type
            </Label>
            <div className="flex items-center justify-between p-3 border border-purple-200 rounded-xl bg-white/70 backdrop-blur-sm">
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {formData.isCreator ? "Creator Account" : "Brand Account"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formData.isCreator
                    ? "For content creators"
                    : "For businesses and brands"}
                </span>
              </div>
              <Switch
                id="isCreator"
                checked={formData.isCreator}
                onCheckedChange={handleSwitchChange}
              />
            </div>
          </div>
        </div>

        {/* Terms and Conditions - Full width */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={handleCheckboxChange}
              className={`mt-1 ${errors.acceptTerms ? "border-red-500" : ""}`}
            />
            <div className="grid gap-1.5 leading-none flex-1">
              <Label
                htmlFor="acceptTerms"
                className="text-sm font-semibold text-gray-700 leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </Label>
              <p className="text-xs text-muted-foreground">
                You agree to our{" "}
                <a href="#" className="underline hover:text-primary">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline hover:text-primary">
                  Privacy Policy
                </a>
                .
              </p>
              {errors.acceptTerms && (
                <p className="text-xs text-red-500">{errors.acceptTerms}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <DialogFooter className="pt-4">
          <Button
            type="submit"
            size="lg"
            colorScheme="primary"
            className="w-full text-base font-medium"
            isLoading={isLoading}
            loadingText="Creating Account..."
          >
            Create Account
          </Button>
        </DialogFooter>
      </form>
    </CustomDialogContent>
  );

  // Prevent dialog from closing unless explicitly allowed
  const handleOpenChange = (newOpen: boolean) => {
    // Only allow closing if newOpen is false and we explicitly want to close
    // This prevents accidental closing but allows programmatic closing
    if (!newOpen) {
      // Don't close the dialog - ignore the close request
      return;
    }
    onOpenChange?.(newOpen);
  };

  if (trigger) {
    return (
      <>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>{trigger}</DialogTrigger>
          {dialogContent}
        </Dialog>

        {/* Follow-up dialogs rendered at root level to avoid nesting modal issues */}
        <BrandRegistrationDialogbox open={isBrandDialogOpen} onOpenChange={setIsBrandDialogOpen} />
        <CreatorRegistrationDialogbox open={isCreatorDialogOpen} onOpenChange={setIsCreatorDialogOpen} />
      </>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        {dialogContent}
      </Dialog>

      {/* Follow-up dialogs rendered at root level to avoid nesting modal issues */}
      <BrandRegistrationDialogbox open={isBrandDialogOpen} onOpenChange={setIsBrandDialogOpen} />
      <CreatorRegistrationDialogbox open={isCreatorDialogOpen} onOpenChange={setIsCreatorDialogOpen} />
    </>
  );
}
