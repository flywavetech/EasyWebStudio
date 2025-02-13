import { users, sites, type User, type InsertUser, type Site, type InsertSite } from "@shared/schema";
import { db, sessionStore } from "./db";
import session from "express-session";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getSites(): Promise<Site[]>;
  getSite(id: number): Promise<Site | undefined>;
  getSiteBySlug(slug: string): Promise<Site | undefined>;
  getSiteByEditToken(token: string): Promise<Site | undefined>;
  createSite(site: InsertSite): Promise<Site>;
  updateSite(id: number, site: Partial<InsertSite>): Promise<Site>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore = sessionStore;

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getSites(): Promise<Site[]> {
    return await db.select().from(sites);
  }

  async getSite(id: number): Promise<Site | undefined> {
    const [site] = await db.select().from(sites).where(eq(sites.id, id));
    return site;
  }

  async getSiteBySlug(slug: string): Promise<Site | undefined> {
    const [site] = await db.select().from(sites).where(eq(sites.slug, slug));
    return site;
  }

  async getSiteByEditToken(token: string): Promise<Site | undefined> {
    const [site] = await db.select().from(sites).where(eq(sites.editToken, token));
    return site;
  }

  async createSite(insertSite: InsertSite): Promise<Site> {
    const editToken = randomBytes(32).toString("hex");
    const [site] = await db
      .insert(sites)
      .values({
        ...insertSite,
        editToken,
        createdAt: new Date(),
      })
      .returning();
    return site;
  }

  async updateSite(id: number, updates: Partial<InsertSite>): Promise<Site> {
    const [site] = await db
      .update(sites)
      .set(updates)
      .where(eq(sites.id, id))
      .returning();
    if (!site) throw new Error("Site not found");
    return site;
  }
}

export const storage = new DatabaseStorage();