import { type Tshirt, type InsertTshirt, tshirts, type User, type InsertUser, users } from "@shared/schema";
import { randomUUID } from "crypto";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import session, { type Store } from "express-session";
import connectPg from "connect-pg-simple";
import createMemoryStore from "memorystore";

const PostgresSessionStore = connectPg(session);
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations - Required for authentication
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Session store for authentication
  sessionStore: Store;
  
  // T-Shirt operations
  getTshirts(): Promise<Tshirt[]>;
  getTshirt(id: string): Promise<Tshirt | undefined>;
  createTshirt(tshirt: InsertTshirt): Promise<Tshirt>;
  updateTshirt(id: string, tshirt: InsertTshirt): Promise<Tshirt | undefined>;
  deleteTshirt(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private tshirts: Map<string, Tshirt>;
  private users: Map<string, User>;
  public sessionStore: Store;

  constructor() {
    this.tshirts = new Map();
    this.users = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // User operations - Username/password authentication
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const user: User = {
      id: randomUUID(),
      username: userData.username,
      password: userData.password,
    };
    this.users.set(user.id, user);
    return user;
  }

  // T-Shirt operations
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
  public sessionStore: Store;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    const sql = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql);
    
    // Set up PostgreSQL session store
    const pool = new (require('pg').Pool)({
      connectionString: process.env.DATABASE_URL,
    });
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User operations - Username/password authentication
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await this.db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  // T-Shirt operations
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
