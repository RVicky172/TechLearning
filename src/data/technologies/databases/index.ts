import type { Technology } from "@/data/types";
import { databasesFundamentals } from "./fundamentals";
import { databasesSql } from "./sql";
import { databasesNoSql } from "./nosql";
import { databasesPerformance } from "./performance";
import { databasesModernData } from "./modernData";

const databases: Technology = {
  id: "databases",
  name: "Databases",
  description: "Relational, NoSQL, caching, and modern data-platform concepts used in real applications today.",
  color: "bg-cyan-600",
  iconName: "Database",
  deviconClass: "devicon-postgresql-plain colored",
  tree: [
    databasesFundamentals,
    databasesSql,
    databasesNoSql,
    databasesPerformance,
    databasesModernData,
  ],
};

export default databases;