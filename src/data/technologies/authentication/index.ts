import type { Technology } from "@/data/types";
import { authFundamentals } from "@/data/technologies/authentication/fundamentals";
import { authJwt } from "@/data/technologies/authentication/jwt";

const authentication: Technology = {
  id: "authentication",
  name: "Authentication",
  description:
    "Auth fundamentals — sessions vs JWTs, OAuth 2.0/OIDC, refresh token rotation, and Auth.js integration.",
  color: "bg-rose-600",
  iconName: "Lock",
  deviconClass: "devicon-openssl-plain",
  tree: [authFundamentals, authJwt],
};

export default authentication;
