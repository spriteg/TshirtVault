import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tshirts = pgTable("tshirts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  size: text("size").notNull(),
  color: text("color").notNull(),
});

export const insertTshirtSchema = createInsertSchema(tshirts).omit({
  id: true,
});

export type InsertTshirt = z.infer<typeof insertTshirtSchema>;
export type Tshirt = typeof tshirts.$inferSelect;
