
import mongoose from 'mongoose';
import { z } from "zod";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const siteSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  contactInfo: { type: String, required: true },
  description: { type: String, required: true },
  logoUrl: String,
  images: [String],
  editToken: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  interestedInGiftCard: { type: Boolean, required: true },
  socialLinks: [String],
  themeColor: { type: String, default: '#3b82f6' },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
export const Site = mongoose.model('Site', siteSchema);

export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export const insertSiteSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  contactInfo: z.string().min(1, "Contact info is required"),
  description: z.string().min(1, "Description is required"),
  logoUrl: z.string().url("Please provide a valid logo URL").optional(),
  images: z.array(z.string().url("Please provide valid image URLs")).optional().default([]),
  interestedInGiftCard: z.boolean(),
  slug: z.string().min(1, "Slug is required"),
  socialLinks: z.array(z.string().url("Please provide valid social media URLs")).optional().default([]),
  themeColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color hex code").optional()
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertSite = z.infer<typeof insertSiteSchema>;
