import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertSiteSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { uploadImage, uploadImages } from "./upload";
import archiver from 'archiver';


// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // File upload endpoint
  app.post("/api/upload", upload.array("file"), async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      if (req.files.length === 1) {
        const url = await uploadImage(req.files[0]);
        res.json({ url });
      } else {
        const urls = await uploadImages(req.files);
        res.json({ urls });
      }
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Upload failed" });
    }
  });

  // Get all sites (admin only)
  app.get("/api/sites", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const sites = await storage.getSites();
    res.json(sites);
  });

  // Get site by slug (public) - now returns HTML
  app.get("/sites/:slug", async (req, res) => {
    const site = await storage.getSiteBySlug(req.params.slug);
    if (!site) return res.sendStatus(404);

    // Return static HTML page
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${site.businessName}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <style>
          :root {
            --theme-color: ${site.themeColor || '#3b82f6'};
          }

          body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
          }
          .hero {
            background-color: var(--theme-color);
            color: white;
            padding: 4rem 2rem;
            text-align: center;
          }
          .logo {
            width: 120px;
            height: 120px;
            object-fit: contain;
            margin-bottom: 2rem;
            border-radius: 50%;
            background: white;
            padding: 1rem;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
          }
          .contact-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 2rem;
            margin: 2rem 0;
          }
          .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            padding: 2rem 0;
          }
          .gallery img {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: 8px;
          }
          .social-links {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 2rem;
          }
          .social-links a {
            color: white;
            font-size: 1.5rem;
            transition: opacity 0.2s;
          }
          .social-links a:hover {
            opacity: 0.8;
          }
          @media (max-width: 768px) {
            .hero {
              padding: 2rem 1rem;
            }
            .container {
              padding: 1rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="hero">
          ${site.logoUrl ? `
            <img src="${site.logoUrl}" alt="${site.businessName} logo" class="logo">
          ` : ''}
          <h1>${site.businessName}</h1>
          <p>${site.description}</p>
          ${site.socialLinks && site.socialLinks.length > 0 ? `
            <div class="social-links">
              ${site.socialLinks.map(link => {
                const icon = link.includes('facebook') ? 'fab fa-facebook' :
                           link.includes('twitter') ? 'fab fa-twitter' :
                           link.includes('instagram') ? 'fab fa-instagram' :
                           link.includes('linkedin') ? 'fab fa-linkedin' :
                           'fas fa-link';
                return `<a href="${link}" target="_blank" rel="noopener noreferrer"><i class="${icon}"></i></a>`;
              }).join('')}
            </div>
          ` : ''}
        </div>

        <div class="container">
          <div class="contact-card">
            <h2>Contact Us</h2>
            <p>${site.contactInfo}</p>
          </div>

          ${site.images && site.images.length > 0 ? `
            <h2>Gallery</h2>
            <div class="gallery">
              ${site.images.map(img => `
                <img src="${img}" alt="Gallery image">
              `).join('')}
            </div>
          ` : ''}
        </div>
      </body>
      </html>
    `;

    res.send(html);
  });

  // API version of get site by slug (for admin/edit pages)
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

  // Download site as ZIP
  app.get("/api/download", async (req, res) => {
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    res.attachment('mysite.zip');
    archive.pipe(res);

    // Add client files
    archive.directory('client/src', 'src');
    archive.directory('server', 'server');
    archive.directory('shared', 'shared');
    archive.file('package.json', { name: 'package.json' });

    await archive.finalize();
  });


  const httpServer = createServer(app);
  return httpServer;
}