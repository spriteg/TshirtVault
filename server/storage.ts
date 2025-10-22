import { type Tshirt, type InsertTshirt, tshirts } from "@shared/schema";
import { randomUUID } from "crypto";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

export interface IStorage {
  getTshirts(): Promise<Tshirt[]>;
  getTshirt(id: string): Promise<Tshirt | undefined>;
  createTshirt(tshirt: InsertTshirt): Promise<Tshirt>;
  updateTshirt(id: string, tshirt: InsertTshirt): Promise<Tshirt | undefined>;
  deleteTshirt(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private tshirts: Map<string, Tshirt>;

  constructor() {
    this.tshirts = new Map();
  }

  async getTshirts(): Promise<Tshirt[]> {
    return Array.from(this.tshirts.values());
  }

  async getTshirt(id: string): Promise<Tshirt | undefined> {
    return this.tshirts.get(id);
  }

  async createTshirt(insertTshirt: InsertTshirt): Promise<Tshirt> {
    const id = randomUUID();
    const tshirt: Tshirt = { ...insertTshirt, id };
    this.tshirts.set(id, tshirt);
    return tshirt;
  }

  async updateTshirt(id: string, insertTshirt: InsertTshirt): Promise<Tshirt | undefined> {
    const existing = this.tshirts.get(id);
    if (!existing) {
      return undefined;
    }
    const updated: Tshirt = { ...insertTshirt, id };
    this.tshirts.set(id, updated);
    return updated;
  }

  async deleteTshirt(id: string): Promise<boolean> {
    return this.tshirts.delete(id);
  }
}

export class PostgresStorage implements IStorage {
  private db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    const sql = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql);
  }

  async getTshirts(): Promise<Tshirt[]> {
    return await this.db.select().from(tshirts);
  }

  async getTshirt(id: string): Promise<Tshirt | undefined> {
    const results = await this.db.select().from(tshirts).where(eq(tshirts.id, id));
    return results[0];
  }

  async createTshirt(insertTshirt: InsertTshirt): Promise<Tshirt> {
    const results = await this.db.insert(tshirts).values(insertTshirt).returning();
    return results[0];
  }

  async updateTshirt(id: string, insertTshirt: InsertTshirt): Promise<Tshirt | undefined> {
    const results = await this.db
      .update(tshirts)
      .set(insertTshirt)
      .where(eq(tshirts.id, id))
      .returning();
    return results[0];
  }

  async deleteTshirt(id: string): Promise<boolean> {
    const results = await this.db.delete(tshirts).where(eq(tshirts.id, id)).returning();
    return results.length > 0;
  }
}

// Use PostgreSQL storage in production, memory storage for testing
export const storage = process.env.DATABASE_URL ? new PostgresStorage() : new MemStorage();
