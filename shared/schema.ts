import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - Required for authentication
// Note: Table name is "session" to match connect-pg-simple default
export const sessions = pgTable(
  "session",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - Username/password authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").notNull().unique(),
  password: varchar("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// T-Shirt inventory table
export const tshirts = pgTable("tshirts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  size: text("size").notNull(),
  color: text("color").notNull(),
  quantity: integer("quantity").notNull().default(0),
}, (table) => [
  uniqueIndex("color_size_unique").on(table.color, table.size),
]);

export const insertTshirtSchema = createInsertSchema(tshirts).omit({
  id: true,
}).extend({
  quantity: z.number().int().min(0, "Quantity must be 0 or greater"),
});

export type InsertTshirt = z.infer<typeof insertTshirtSchema>;
export type Tshirt = typeof tshirts.$inferSelect;
