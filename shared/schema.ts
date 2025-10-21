import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tshirts = pgTable("tshirts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  size: text("size").notNull(),
  color: text("color").notNull(),
  quantity: integer("quantity").notNull().default(0),
});

export const insertTshirtSchema = createInsertSchema(tshirts).omit({
  id: true,
}).extend({
  quantity: z.number().int().min(0, "Quantity must be 0 or greater"),
});

export type InsertTshirt = z.infer<typeof insertTshirtSchema>;
export type Tshirt = typeof tshirts.$inferSelect;
