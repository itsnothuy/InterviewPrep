import { sql } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  serial,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { boolean, timestamp, primaryKey, integer } from "drizzle-orm/pg-core";
import { AdapterAccount } from "next-auth/adapters";

export const userSystemEnum = pgEnum("user_system_enum", ["system", "user"]);

export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});
