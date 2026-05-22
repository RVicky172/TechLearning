export type { TopicNode, Technology } from "@/data/types";

import react from "@/data/technologies/react";
import nextjs from "@/data/technologies/nextjs";
import typescript from "@/data/technologies/typescript";
import javascript from "@/data/technologies/javascript";
import nodejs from "@/data/technologies/nodejs";
import expressjs from "@/data/technologies/expressjs";
import html from "@/data/technologies/html";
import css from "@/data/technologies/css";
import scss from "@/data/technologies/scss";
import redux from "@/data/technologies/redux";
import databases from "@/data/technologies/databases";
import orm from "@/data/technologies/orm";
import git from "@/data/technologies/git";
import cicd from "@/data/technologies/cicd";
import testing from "@/data/technologies/testing";
import graphql from "@/data/technologies/graphql";
import packageManagers from "@/data/technologies/packageManagers";
import environment from "@/data/technologies/environment";
import cloud from "@/data/technologies/cloud";
import fullstack from "@/data/technologies/fullstack";
import ai from "@/data/technologies/ai";
import dsa from "@/data/technologies/dsa";
import webpack from "@/data/technologies/webpack";

export const technologies = [
	react,
	nextjs,
	javascript,
	typescript,
	html,
	css,
	scss,
	redux,
	nodejs,
	expressjs,
	databases,
	orm,
	graphql,
	testing,
	git,
	cicd,
	packageManagers,
	environment,
	cloud,
	fullstack,
	ai,
	dsa,
	webpack,
];

/** Sidebar category groupings — drives the grouped view on the home page. */
export const techCategories: Array<{ label: string; ids: string[] }> = [
	{
		label: "Frontend",
		ids: ["react", "nextjs", "javascript", "typescript", "html", "css", "scss"],
	},
	{
		label: "State Management",
		ids: ["redux"],
	},
	{
		label: "Backend",
		ids: ["nodejs", "expressjs", "databases", "orm", "graphql"],
	},
	{
		label: "Testing & Quality",
		ids: ["testing"],
	},
	{
		label: "DevOps & Tools",
		ids: ["git", "cicd", "packageManagers", "environment", "cloud", "webpack"],
	},
	{
		label: "Computer Science",
		ids: ["dsa", "ai"],
	},
	{
		label: "Architecture",
		ids: ["fullstack"],
	},
];
