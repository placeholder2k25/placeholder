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

interface CreatorRegistrationDialogboxProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreatorRegistrationDialogbox({
  trigger,
  open,
  onOpenChange,
}: CreatorRegistrationDialogboxProps) {
  const [formData, setFormData] = useState({
    bio: "",
    category: "",
    location: "",
    instagram: "",
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
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const isValidInstagramUrl = (value: string) => {
    if (!isValidUrl(value)) return false;
    try {
      const { hostname } = new URL(value);
      return (
        hostname.endsWith("instagram.com") ||
        hostname.endsWith("www.instagram.com") ||
        hostname.endsWith("instagr.am")
      );
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    } else if (formData.bio.trim().length < 10) {
      newErrors.bio = "Bio should be at least 10 characters";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.instagram.trim()) {
      newErrors.instagram = "Instagram link is required";
    } else if (!isValidInstagramUrl(formData.instagram)) {
      newErrors.instagram = "Please enter a valid Instagram URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // TODO: Replace with actual creator registration logic
      console.log("Creator registration data:", formData);

      // Simulate API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Close dialog on success
      onOpenChange?.(false);

      // TODO: Redirect or show toast
      alert("Creator registered successfully!");
    } catch (err) {
      console.error("Creator registration error:", err);
      alert("Failed to register creator. Please try again.");
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
          Creator Registration
        </DialogTitle>
        <DialogDescription className="text-sm sm:text-base text-gray-600">
          Share your details to set up your creator profile.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
              Category
            </Label>
            <Input
              id="category"
              name="category"
              type="text"
              placeholder="e.g., Fashion, Tech, Fitness"
              value={formData.category}
              onChange={handleInputChange}
              className={`rounded-xl bg-white/70 backdrop-blur-sm border-purple-200 focus:border-purple-400 focus:ring-purple-400/20 ${
                errors.category ? "border-red-500" : ""
              }`}
            />
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
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

          {/* Instagram Link */}
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="instagram" className="text-sm font-semibold text-gray-700">
              Instagram Link
            </Label>
            <Input
              id="instagram"
              name="instagram"
              type="url"
              placeholder="https://instagram.com/your_handle"
              value={formData.instagram}
              onChange={handleInputChange}
              className={`rounded-xl bg-white/70 backdrop-blur-sm border-purple-200 focus:border-purple-400 focus:ring-purple-400/20 ${
                errors.instagram ? "border-red-500" : ""
              }`}
            />
            {errors.instagram && (
              <p className="text-sm text-red-500">{errors.instagram}</p>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="bio" className="text-sm font-semibold text-gray-700">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell brands about yourself, your niche, and audience."
              value={formData.bio}
              onChange={handleInputChange}
              className={`min-h-[100px] rounded-xl bg-white/70 backdrop-blur-sm border-purple-200 focus:border-purple-400 focus:ring-purple-400/20 ${
                errors.bio ? "border-red-500" : ""
              }`}
            />
            {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
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