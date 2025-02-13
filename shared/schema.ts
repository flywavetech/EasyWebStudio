import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sites = pgTable("sites", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  contactInfo: text("contact_info").notNull(),
  description: text("description").notNull(),
  logoUrl: text("logo_url"),
  images: text("images").array(),
  editToken: text("edit_token").notNull(),
  slug: text("slug").notNull().unique(),
  interestedInGiftCard: boolean("interested_in_gift_card").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  // Add new fields for social media and theme
  socialLinks: text("social_links").array(),
  themeColor: text("theme_color").default('#3b82f6'), // Default blue color
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSiteSchema = createInsertSchema(sites)
  .omit({ id: true, createdAt: true, editToken: true })
  .extend({
    businessName: z.string().min(1, "Business name is required"),
    contactInfo: z.string().min(1, "Contact info is required"),
    description: z.string().min(1, "Description is required"),
    logoUrl: z.string().url("Please provide a valid logo URL").optional(),
    images: z.array(z.string().url("Please provide valid image URLs")).optional().default([]),
    interestedInGiftCard: z.boolean(),
    slug: z.string().min(1, "Slug is required"),
    socialLinks: z.array(z.string().url("Please provide valid social media URLs")).optional().default([]),
    themeColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color hex code").optional(),
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSite = z.infer<typeof insertSiteSchema>;
export type Site = typeof sites.$inferSelect;