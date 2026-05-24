import type { Technology } from "@/data/types";
import { databasesFundamentals } from "./fundamentals";
import { databasesSql } from "./sql";
import { databasesNoSql } from "./nosql";
import { databasesPerformance } from "./performance";
import { databasesModernData } from "./modernData";
import { databasesRelational } from "./relational";
import { databasesSpecialized } from "./specialized";
import { databasesChoosing } from "./choosing";

const databases: Technology = {
  id: "databases",
  name: "Databases",
  description: "Relational, NoSQL, specialized databases, and a practical guide to choosing the right database for any use case.",
  color: "bg-cyan-600",
  iconName: "Database",
  deviconClass: "devicon-postgresql-plain colored",
  tree: [
    databasesFundamentals,
    databasesRelational,
    databasesSql,
    databasesNoSql,
    databasesSpecialized,
    databasesPerformance,
    databasesModernData,
    databasesChoosing,
  ],
};

export default databases;