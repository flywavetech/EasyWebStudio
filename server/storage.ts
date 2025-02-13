import { User, InsertUser, Site, InsertSite } from "@shared/schema";
import session from "express-session";
import { randomBytes } from "crypto";
import createMemoryStore from "memorystore";
const MemoryStore = createMemoryStore(session);

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

  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sites: Map<number, Site>;
  private currentUserId: number;
  private currentSiteId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.sites = new Map();
    this.currentUserId = 1;
    this.currentSiteId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getSites(): Promise<Site[]> {
    return Array.from(this.sites.values());
  }

  async getSite(id: number): Promise<Site | undefined> {
    return this.sites.get(id);
  }

  async getSiteBySlug(slug: string): Promise<Site | undefined> {
    return Array.from(this.sites.values()).find((site) => site.slug === slug);
  }

  async getSiteByEditToken(token: string): Promise<Site | undefined> {
    return Array.from(this.sites.values()).find(
      (site) => site.editToken === token,
    );
  }

  async createSite(insertSite: InsertSite): Promise<Site> {
    const id = this.currentSiteId++;
    const editToken = randomBytes(32).toString("hex");
    const site: Site = {
      ...insertSite,
      id,
      editToken,
      createdAt: new Date(),
    };
    this.sites.set(id, site);
    return site;
  }

  async updateSite(id: number, updates: Partial<InsertSite>): Promise<Site> {
    const site = await this.getSite(id);
    if (!site) throw new Error("Site not found");

    const updatedSite = { ...site, ...updates };
    this.sites.set(id, updatedSite);
    return updatedSite;
  }
}

export const storage = new MemStorage();
