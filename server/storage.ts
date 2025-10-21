import { type Tshirt, type InsertTshirt } from "@shared/schema";
import { randomUUID } from "crypto";

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

export const storage = new MemStorage();
