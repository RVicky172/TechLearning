import type { Technology } from "@/data/types";
import { ormFundamentals } from "./fundamentals";
import { ormPrisma } from "./prisma";
import { ormDrizzle } from "./drizzle";

const orm: Technology = {
  id: "orm",
  name: "ORM & Query Builders",
  description: "Type-safe database interaction with Prisma, Drizzle, and TypeORM.",
  color: "bg-cyan-600",
  iconName: "Database",
  deviconClass: "devicon-postgresql-plain colored",
  tree: [
    ormFundamentals,
    ormPrisma,
    ormDrizzle,
  ],
};

export default orm;
