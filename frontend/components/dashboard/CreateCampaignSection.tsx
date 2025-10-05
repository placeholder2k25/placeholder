"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, X } from "lucide-react";
import { createCampaign } from "@/lib/api.dashboard";

const schema = z.object({
  campaign_name: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  objective: z.string().min(1, "Required"),
  // We'll store the selected image URL as a string (preview). Backend upload can be wired later.
  image: z.string().optional().nullable(),
  deliverables: z.array(z.string()).default([]),
  timeline: z.string().min(1, "Required"),
  budget_target: z.coerce.number().min(0, "Must be >= 0"),
  rules: z.string().optional().default(""),
  sample_captions: z.array(z.string()).default([]),
  required_hashtags: z.array(z.string()).default([]),
  creator_approval: z.boolean().default(false),
  total_allowed_creators: z.coerce.number().min(1, "Must be >= 1"),
  target: z.string().min(1, "Required"),
  max_payment_per_creator: z.coerce.number().min(0, "Must be >= 0"),
});

export type CreateCampaignValues = z.infer<typeof schema>;

// Simple chip input for lists (hashtags, deliverables, sample captions)
function ChipInput({
  label,
  placeholder,
  items,
  onChange,
}: {
  label: string;
  placeholder?: string;
  items: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const addItem = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    if (items.includes(trimmed)) return;
    onChange([...(items || []), trimmed]);
    setDraft("");
  };

  const removeAt = (idx: number) => {
    const next = items.slice();
    next.splice(idx, 1);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <div className="flex flex-wrap gap-2">
        {items?.map((it, i) => (
          <Badge key={it + i} variant="secondary" className="flex items-center gap-1">
            {it}
            <button
              type="button"
              className="ml-1 focus:outline-none"
              onClick={() => removeAt(i)}
              aria-label={`Remove ${it}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder={placeholder || "Type and press Enter"}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem(draft);
            }
          }}
        />
        <Button
          type="button"
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90"
          onClick={() => addItem(draft)}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

export default function CreateCampaignSection() {
  const form = useForm<CreateCampaignValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      campaign_name: "",
      description: "",
      objective: "Product awareness",
      image: null,
      deliverables: [],
      timeline: "",
      budget_target: 0,
      rules: "",
      sample_captions: [],
      required_hashtags: [],
      creator_approval: true,
      total_allowed_creators: 10,
      target: "General audience",
      max_payment_per_creator: 0,
    },
    mode: "onChange",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageAspect, setImageAspect] = useState<'16:9' | '9:16' | null>(null);

  const onSubmit = async (values: CreateCampaignValues) => {
    try {
      await createCampaign(values);
      alert("Campaign created successfully");
      // Optionally: reset form after success
      // form.reset();
    } catch (err: any) {
      console.error("CreateCampaign error:", err);
      alert(err?.message || "Failed to create campaign");
    }
  };

  const setArrayField = (name: keyof Pick<CreateCampaignValues, "deliverables" | "sample_captions" | "required_hashtags">, next: string[]) => {
    form.setValue(name as any, next, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Create Campaign</h1>
      <p className="text-sm text-neutral-600">Fill out details. Right side shows a live preview.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left column: form */}
          <div className="lg:col-span-8 space-y-6">
            {/* Details Card */}
            <Card className="rounded-2xl border-neutral-200/60 bg-white/80 backdrop-blur shadow-xl">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Details</CardTitle>
                <CardDescription>Basic information for your campaign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="campaign_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Summer Launch 2025" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={5} placeholder="Describe your campaign goals, expectations, and context" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Objective as a simple select */}
                <FormField
                  control={form.control}
                  name="objective"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objective</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select objective" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Product awareness">Product awareness</SelectItem>
                          <SelectItem value="App installs">App installs</SelectItem>
                          <SelectItem value="Website traffic">Website traffic</SelectItem>
                          <SelectItem value="Content UGC">Content UGC</SelectItem>
                          <SelectItem value="Sales / Conversions">Sales / Conversions</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image upload with preview */}
                <div className="space-y-2">
                  <FormLabel>Cover image</FormLabel>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90">
                      <Upload className="h-4 w-4" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const objectUrl = URL.createObjectURL(file);
                          const img = new Image();

                          img.onload = () => {
                            const { width, height } = img;
                            const ratio = width / height;
                            const is916 = Math.abs(ratio - 9 / 16) < 0.02; // allow small tolerance
                            const is169 = Math.abs(ratio - 16 / 9) < 0.02;

                            if (!is916 && !is169) {
                              alert("Please select an image with 9:16 or 16:9 aspect ratio.");
                              URL.revokeObjectURL(objectUrl);
                              e.currentTarget.value = ""; // reset input
                              return;
                            }

                            setImagePreview(objectUrl);
                            setImageAspect(is169 ? '16:9' : '9:16');
                            form.setValue("image", objectUrl, { shouldDirty: true });
                          };

                          img.onerror = () => {
                            alert("Could not load image. Please try another file.");
                            URL.revokeObjectURL(objectUrl);
                            e.currentTarget.value = "";
                          };

                          img.src = objectUrl;
                        }}
                      />
                    </label>
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-16 w-16 rounded-md object-cover border"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-md border bg-neutral-50 grid place-items-center text-xs text-neutral-500">
                        No image
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements Card */}
            <Card className="rounded-2xl border-neutral-200/60 bg-white/80 backdrop-blur shadow-xl">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Requirements</CardTitle>
                <CardDescription>Content requirements and constraints</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ChipInput
                  label="Deliverables"
                  placeholder="e.g. 1x YouTube video, 2x Instagram stories"
                  items={form.watch("deliverables")}
                  onChange={(next) => setArrayField("deliverables", next)}
                />

                <ChipInput
                  label="Sample captions"
                  placeholder="e.g. Check out our new collection!"
                  items={form.watch("sample_captions")}
                  onChange={(next) => setArrayField("sample_captions", next)}
                />

                <ChipInput
                  label="Required hashtags"
                  placeholder="#brand #summerlaunch"
                  items={form.watch("required_hashtags")}
                  onChange={(next) => setArrayField("required_hashtags", next)}
                />

                <FormField
                  control={form.control}
                  name="rules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rules</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="Any dos and don'ts, legal or brand guidelines" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Timing & Budget Card */}
            <Card className="rounded-2xl border-neutral-200/60 bg-white/80 backdrop-blur shadow-xl">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Timing & Budget</CardTitle>
                <CardDescription>Schedule and payment settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Timeline */}
                <div className="space-y-2">
                  <FormLabel>Timeline</FormLabel>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Input
                      type="date"
                      onChange={(e) => {
                        const end = form.getValues("timeline").split("|")[1] ?? "";
                        form.setValue("timeline", `${e.target.value}|${end}`, { shouldDirty: true });
                      }}
                    />
                    <Input
                      type="date"
                      onChange={(e) => {
                        const start = form.getValues("timeline").split("|")[0] ?? "";
                        form.setValue("timeline", `${start}|${e.target.value}`, { shouldDirty: true });
                      }}
                    />
                  </div>
                  <p className="text-xs text-neutral-500">We store timeline as "start|end". Adjust as needed.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="budget_target"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget target</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} step="0.01" placeholder="e.g. 5000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="max_payment_per_creator"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max payment / creator</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} step="0.01" placeholder="e.g. 300" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="total_allowed_creators"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total allowed creators</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} step="1" placeholder="e.g. 25" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="target"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target audience</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Gen Z in US, tech-savvy, fitness" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="creator_approval"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-end">
                        <div className="flex items-center justify-between rounded-md border p-3">
                          <div>
                            <FormLabel>Creator approval required</FormLabel>
                            <p className="text-xs text-neutral-500">Manual review before creators can participate</p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md hover:opacity-90">Save campaign</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right column: preview */}
          <div className="lg:col-span-4">
            <Card className="sticky top-20 rounded-2xl border-neutral-200/60 bg-white/80 backdrop-blur shadow-xl">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Preview</CardTitle>
                <CardDescription>How creators may see it</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={
                    "w-full overflow-hidden rounded-md border bg-neutral-100 ring-1 ring-purple-200/60 " +
                    (imageAspect === '9:16' ? 'aspect-[9/16]' : 'aspect-video')
                  }
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Cover" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center text-neutral-400 text-sm">No cover image</div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold">
                    {form.watch("campaign_name") || "Untitled campaign"}
                  </h3>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-600">
                    {form.watch("description") || "Campaign description will appear here."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-neutral-500">Objective</div>
                    <div className="font-medium">{form.watch("objective")}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Budget</div>
                    <div className="font-medium">${form.watch("budget_target") || 0}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Creators</div>
                    <div className="font-medium">{form.watch("total_allowed_creators")}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Max / creator</div>
                    <div className="font-medium">${form.watch("max_payment_per_creator") || 0}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-neutral-500">Required hashtags</div>
                  <div className="flex flex-wrap gap-2">
                    {form.watch("required_hashtags")?.length ? (
                      form.watch("required_hashtags").map((tag, i) => (
                        <Badge key={tag + i} variant="outline">{tag}</Badge>
                      ))
                    ) : (
                      <span className="text-xs text-neutral-400">None</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-neutral-500">Deliverables</div>
                  <ul className="list-disc pl-5 text-sm">
                    {form.watch("deliverables")?.length ? (
                      form.watch("deliverables").map((d, i) => <li key={d + i}>{d}</li>)
                    ) : (
                      <li className="text-neutral-400">No deliverables specified</li>
                    )}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-neutral-500">Timeline</div>
                  <div className="text-sm">
                    {(() => {
                      const t = form.watch("timeline");
                      if (!t) return "Not set";
                      const [s, e] = t.split("|");
                      return s || e ? `${s || "?"} → ${e || "?"}` : "Not set";
                    })()}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-neutral-500">Sample captions</div>
                  <ul className="list-disc pl-5 text-sm">
                    {form.watch("sample_captions")?.length ? (
                      form.watch("sample_captions").map((c, i) => <li key={c + i}>{c}</li>)
                    ) : (
                      <li className="text-neutral-400">None</li>
                    )}
                  </ul>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="text-neutral-500">Target</div>
                  <div className="font-medium">{form.watch("target")}</div>
                </div>

                <div className="text-sm text-neutral-500">
                  {form.watch("creator_approval") ? "Creator approval required" : "Auto-approve creators"}
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </section>
  );
}