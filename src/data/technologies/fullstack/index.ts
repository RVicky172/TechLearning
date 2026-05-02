import type { Technology } from "@/data/types";
import { fullstackNetworking } from "@/data/technologies/fullstack/networking";
import { fullstackApis } from "@/data/technologies/fullstack/apis";
import { fullstackAuth } from "@/data/technologies/fullstack/auth";
import { fullstackDatabases } from "@/data/technologies/fullstack/databases";
import { fullstackInfrastructure } from "@/data/technologies/fullstack/infrastructure";
import { fullstackArchitecture } from "@/data/technologies/fullstack/architecture";
import { fullstackDevOps } from "@/data/technologies/fullstack/devops";
import { fullstackSystemDesign } from "@/data/technologies/fullstack/systemDesign";

const fullstack: Technology = {
  id: "fullstack",
  name: "Fullstack Concepts",
  description: "Essential backend, infrastructure, and system design concepts every frontend developer should know.",
  color: "bg-violet-600",
  iconName: "Layers",
  deviconClass: "devicon-linux-plain",
  tree: [
    fullstackNetworking,
    fullstackApis,
    fullstackAuth,
    fullstackDatabases,
    fullstackInfrastructure,
    fullstackArchitecture,
    fullstackDevOps,
    fullstackSystemDesign,
  ],
};

export default fullstack;
