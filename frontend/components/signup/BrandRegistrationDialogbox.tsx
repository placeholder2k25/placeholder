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
import { Textarea } from "@/components/ui/textarea";

interface BrandRegistrationDialogboxProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function BrandRegistrationDialogbox({
  trigger,
  open,
  onOpenChange,
}: BrandRegistrationDialogboxProps) {
  const [formData, setFormData] = useState({
    brandName: "",
    website: "",
    description: "",
    location: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const isValidUrl = (value: string) => {
    try {
      const url = new URL(value);
      return Boolean(url.protocol === "http:" || url.protocol === "https:");
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.brandName.trim()) {
      newErrors.brandName = "Brand name is required";
    }

    if (!formData.website.trim()) {
      newErrors.website = "Website is required";
    } else if (!isValidUrl(formData.website)) {
      newErrors.website = "Please enter a valid URL (http/https)";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Brand description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description should be at least 10 characters";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // TODO: Replace with actual brand registration logic
      console.log("Brand registration data:", formData);

      // Simulate API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Close dialog on success
      onOpenChange?.(false);

      // TODO: Redirect or show toast
      alert("Brand registered successfully!");
    } catch (err) {
      console.error("Brand registration error:", err);
      alert("Failed to register brand. Please try again.");
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
          Brand Registration
        </DialogTitle>
        <DialogDescription className="text-sm sm:text-base text-gray-600">
          Provide your brand details to get started.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Brand Name */}
          <div className="space-y-2">
            <Label htmlFor="brandName" className="text-sm font-semibold text-gray-700">
              Brand Name
            </Label>
            <Input
              id="brandName"
              name="brandName"
              type="text"
              placeholder="Your brand name"
              value={formData.brandName}
              onChange={handleInputChange}
              className={`rounded-xl bg-white/70 backdrop-blur-sm border-purple-200 focus:border-purple-400 focus:ring-purple-400/20 ${
                errors.brandName ? "border-red-500" : ""
              }`}
            />
            {errors.brandName && (
              <p className="text-sm text-red-500">{errors.brandName}</p>
            )}
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm font-semibold text-gray-700">
              Website
            </Label>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://example.com"
              value={formData.website}
              onChange={handleInputChange}
              className={`rounded-xl bg-white/70 backdrop-blur-sm border-purple-200 focus:border-purple-400 focus:ring-purple-400/20 ${
                errors.website ? "border-red-500" : ""
              }`}
            />
            {errors.website && (
              <p className="text-sm text-red-500">{errors.website}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="location" className="text-sm font-semibold text-gray-700">
              Location
            </Label>
            <Input
              id="location"
              name="location"
              type="text"
              placeholder="City, Country"
              value={formData.location}
              onChange={handleInputChange}
              className={`rounded-xl bg-white/70 backdrop-blur-sm border-purple-200 focus:border-purple-400 focus:ring-purple-400/20 ${
                errors.location ? "border-red-500" : ""
              }`}
            />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location}</p>
            )}
          </div>

          {/* Brand Description */}
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
              Brand Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Tell us about your brand, values, and products/services"
              value={formData.description}
              onChange={handleInputChange}
              className={`min-h-[100px] rounded-xl bg-white/70 backdrop-blur-sm border-purple-200 focus:border-purple-400 focus:ring-purple-400/20 ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="submit"
            size="lg"
            colorScheme="primary"
            className="w-full text-base font-medium"
            isLoading={isLoading}
            loadingText="Submitting..."
          >
            Submit
          </Button>
        </DialogFooter>
      </form>
    </CustomDialogContent>
  );

  // Prevent dialog from closing unless explicitly allowed (consistent with LoginDialog)
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