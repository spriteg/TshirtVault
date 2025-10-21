import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTshirtSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // GET /api/tshirts - Get all t-shirts
  app.get("/api/tshirts", async (_req, res) => {
    try {
      const tshirts = await storage.getTshirts();
      res.json(tshirts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch t-shirts" });
    }
  });

  // GET /api/tshirts/:id - Get a single t-shirt
  app.get("/api/tshirts/:id", async (req, res) => {
    try {
      const tshirt = await storage.getTshirt(req.params.id);
      if (!tshirt) {
        return res.status(404).json({ error: "T-shirt not found" });
      }
      res.json(tshirt);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch t-shirt" });
    }
  });

  // POST /api/tshirts - Create a new t-shirt
  app.post("/api/tshirts", async (req, res) => {
    try {
      const result = insertTshirtSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: "Invalid t-shirt data",
          details: result.error.issues 
        });
      }

      const tshirt = await storage.createTshirt(result.data);
      res.status(201).json(tshirt);
    } catch (error) {
      res.status(500).json({ error: "Failed to create t-shirt" });
    }
  });

  // PUT /api/tshirts/:id - Update a t-shirt
  app.put("/api/tshirts/:id", async (req, res) => {
    try {
      const result = insertTshirtSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: "Invalid t-shirt data",
          details: result.error.issues 
        });
      }

      const tshirt = await storage.updateTshirt(req.params.id, result.data);
      if (!tshirt) {
        return res.status(404).json({ error: "T-shirt not found" });
      }
      res.json(tshirt);
    } catch (error) {
      res.status(500).json({ error: "Failed to update t-shirt" });
    }
  });

  // DELETE /api/tshirts/:id - Delete a t-shirt
  app.delete("/api/tshirts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTshirt(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "T-shirt not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete t-shirt" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
