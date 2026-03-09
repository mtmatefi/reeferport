import {
  pgTable, text, integer, boolean, timestamp, decimal,
  primaryKey, jsonb, serial,
} from "drizzle-orm/pg-core";

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id:           text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email:        text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name:         text("name").notNull(),
  avatar:       text("avatar").notNull().default("https://i.pravatar.cc/150?img=1"),
  type:         text("type").notNull().default("Privat"), // "Händler" | "Privat"
  location:     text("location").notNull().default("Schweiz"),
  bio:          text("bio"),
  verified:     boolean("verified").notNull().default(false),
  memberSince:  text("member_since").notNull().$defaultFn(() => new Date().getFullYear().toString()),
  salesCount:   integer("sales_count").notNull().default(0),
  rating:       decimal("rating", { precision: 2, scale: 1 }).notNull().default("5.0"),
  reviewCount:  integer("review_count").notNull().default(0),
  createdAt:    timestamp("created_at").notNull().defaultNow(),
});

// ─── Listings ─────────────────────────────────────────────────────────────────
export const listings = pgTable("listings", {
  id:           text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title:        text("title").notNull(),
  latin:        text("latin").notNull().default(""),
  price:        integer("price").notNull(),
  currency:     text("currency").notNull().default("CHF"),
  subtitle:     text("subtitle").notNull().default(""),
  description:  text("description").notNull(),
  location:     text("location").notNull(),
  image:        text("image").notNull(),
  images:       jsonb("images").$type<string[]>().notNull().default([]),
  category:     text("category").notNull(), // Korallen | Fische | Wirbellose | Equipment | Frags
  condition:    text("condition").notNull(), // Nachzucht | Wildfang | Gebraucht | Neu
  listingType:  text("listing_type").notNull().default("C2C"), // B2C | C2C
  sellerId:     text("seller_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tags:         jsonb("tags").$type<string[]>().notNull().default([]),
  badge:        text("badge"),
  shipping:     boolean("shipping").notNull().default(false),
  shippingCost: integer("shipping_cost"),
  pickup:       boolean("pickup").notNull().default(true),
  views:        integer("views").notNull().default(0),
  active:       boolean("active").notNull().default(true),
  createdAt:    timestamp("created_at").notNull().defaultNow(),
});

// ─── Saved Listings ───────────────────────────────────────────────────────────
export const savedListings = pgTable("saved_listings", {
  userId:    text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  listingId: text("listing_id").notNull().references(() => listings.id, { onDelete: "cascade" }),
  savedAt:   timestamp("saved_at").notNull().defaultNow(),
}, (t) => [primaryKey({ columns: [t.userId, t.listingId] })]);

// ─── Conversations ────────────────────────────────────────────────────────────
export const conversations = pgTable("conversations", {
  id:        text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  buyerId:   text("buyer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sellerId:  text("seller_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  listingId: text("listing_id").references(() => listings.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Messages ─────────────────────────────────────────────────────────────────
export const messages = pgTable("messages", {
  id:             text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  senderId:       text("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  text:           text("text").notNull(),
  read:           boolean("read").notNull().default(false),
  createdAt:      timestamp("created_at").notNull().defaultNow(),
});

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const reviews = pgTable("reviews", {
  id:         text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  sellerId:   text("seller_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  reviewerId: text("reviewer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  listingId:  text("listing_id").references(() => listings.id, { onDelete: "set null" }),
  rating:     integer("rating").notNull(),
  text:       text("text").notNull(),
  createdAt:  timestamp("created_at").notNull().defaultNow(),
});

export type User        = typeof users.$inferSelect;
export type Listing     = typeof listings.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message     = typeof messages.$inferSelect;
export type Review      = typeof reviews.$inferSelect;
