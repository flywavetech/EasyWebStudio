import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertSiteSchema } from "@shared/schema";
import { z } from "zod";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Get all sites (admin only)
  app.get("/api/sites", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const sites = await storage.getSites();
    res.json(sites);
  });

  // Get site by slug (public)
  app.get("/api/sites/:slug", async (req, res) => {
    const site = await storage.getSiteBySlug(req.params.slug);
    if (!site) return res.sendStatus(404);
    res.json(site);
  });

  // Create new site
  app.post("/api/sites", async (req, res) => {
    try {
      const siteData = insertSiteSchema.parse(req.body);
      const site = await storage.createSite(siteData);
      res.status(201).json(site);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json(e.errors);
      }
      throw e;
    }
  });

  // Update site by edit token
  app.patch("/api/sites/edit/:token", async (req, res) => {
    const site = await storage.getSiteByEditToken(req.params.token);
    if (!site) return res.sendStatus(404);

    try {
      const updates = insertSiteSchema.partial().parse(req.body);
      const updatedSite = await storage.updateSite(site.id, updates);
      res.json(updatedSite);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json(e.errors);
      }
      throw e;
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
