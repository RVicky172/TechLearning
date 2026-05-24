import type { Technology } from "@/data/types";
import { securityFundamentals } from "@/data/technologies/web-security/fundamentals";
import { securityAttacks } from "@/data/technologies/web-security/attacks";

const webSecurity: Technology = {
  id: "web-security",
  name: "Web Security",
  description:
    "OWASP Top 10, XSS, CSRF, SQL injection, secure headers, and practical defences every fullstack developer must know.",
  color: "bg-red-700",
  iconName: "Shield",
  deviconClass: "devicon-github-original",
  tree: [securityFundamentals, securityAttacks],
};

export default webSecurity;
