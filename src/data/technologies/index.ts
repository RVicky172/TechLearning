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
import docker from "@/data/technologies/docker";
import redis from "@/data/technologies/redis";
import vite from "@/data/technologies/vite";
import tailwind from "@/data/technologies/tailwind";
import tanstackQuery from "@/data/technologies/tanstack-query";
import zustand from "@/data/technologies/zustand";
import websockets from "@/data/technologies/websockets";
import nginx from "@/data/technologies/nginx";
import linux from "@/data/technologies/linux";
import authentication from "@/data/technologies/authentication";
import webSecurity from "@/data/technologies/web-security";
import designPatterns from "@/data/technologies/design-patterns";
import monitoring from "@/data/technologies/monitoring";

export const technologies = [
	react,
	nextjs,
	javascript,
	typescript,
	html,
	css,
	scss,
	tailwind,
	vite,
	redux,
	zustand,
	tanstackQuery,
	nodejs,
	expressjs,
	databases,
	orm,
	graphql,
	redis,
	websockets,
	testing,
	git,
	cicd,
	docker,
	nginx,
	linux,
	packageManagers,
	environment,
	cloud,
	monitoring,
	fullstack,
	ai,
	dsa,
	webpack,
	authentication,
	webSecurity,
	designPatterns,
];

/** Sidebar category groupings — drives the grouped view on the home page. */
export const techCategories: Array<{ label: string; ids: string[] }> = [
	{
		label: "Frontend",
		ids: ["react", "nextjs", "javascript", "typescript", "html", "css", "scss", "tailwind", "vite"],
	},
	{
		label: "State Management",
		ids: ["redux", "zustand", "tanstack-query"],
	},
	{
		label: "Backend",
		ids: ["nodejs", "expressjs", "databases", "orm", "graphql", "redis", "websockets"],
	},
	{
		label: "Testing & Quality",
		ids: ["testing"],
	},
	{
		label: "Security",
		ids: ["authentication", "web-security"],
	},
	{
		label: "DevOps & Tools",
		ids: ["git", "cicd", "docker", "nginx", "linux", "packageManagers", "environment", "cloud", "monitoring", "webpack"],
	},
	{
		label: "Computer Science",
		ids: ["dsa", "ai", "design-patterns"],
	},
	{
		label: "Architecture",
		ids: ["fullstack"],
	},
];
