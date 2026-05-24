import type { TopicNode } from "@/data/types";

export const authJwt: TopicNode = {
  id: "auth-jwt",
  title: "JWTs & Refresh Tokens",
  iconName: "Key",
  link: "https://jwt.io/introduction/",
  theory:
    "A JSON Web Token (JWT) is a compact, URL-safe string containing a signed JSON payload. The server signs the token with a secret or private key; the client sends it back with each request; the server verifies the signature without a database lookup. Short-lived access tokens (15 min) paired with longer-lived refresh tokens (7 days) is the standard pattern for secure, stateless authentication.",
  theoryDetail: {
    keyConcepts: [
      "Structure: header.payload.signature — each part is base64url encoded; the signature ensures tampering is detected",
      "Claims: standard fields inside the payload — sub (subject/user ID), iat (issued at), exp (expiry), iss (issuer)",
      "HS256 vs RS256: HS256 uses a shared secret (symmetric); RS256 uses a private/public key pair (asymmetric) — use RS256 when multiple services need to verify tokens without sharing a secret",
      "Access token: short-lived (5–15 min) — sent in Authorization: Bearer header; used for every API request",
      "Refresh token: long-lived (7–30 days) — stored in HttpOnly cookie; used only to get a new access token from a /auth/refresh endpoint",
      "Token rotation: issue a new refresh token on each use and invalidate the old one — limits the damage window if a refresh token is stolen",
      "Revocation: JWTs cannot be invalidated server-side (stateless); use short expiry + a blocklist in Redis for critical revocations (logout, password change)",
    ],
    whyItMatters:
      "JWT is the most common authentication mechanism in REST APIs and microservice architectures. Interview questions about stateless auth, token refresh flows, and where to store tokens are extremely common. Understanding the trade-offs between sessions and JWTs is expected at senior level.",
    commonPitfalls: [
      "Storing access tokens in localStorage — XSS can steal them; store access tokens in memory and refresh tokens in HttpOnly cookies",
      "Using the none algorithm — some libraries accept alg: none (unsigned tokens); always explicitly specify and enforce the expected algorithm",
      "Trusting the claims without verifying the signature — always verify before using any claim, including user ID",
      "Long expiry on access tokens — a stolen access token is valid until it expires; keep expiry under 15 minutes",
    ],
    examples: [
      {
        title: "JWT issue + verify + refresh token rotation in Express",
        description:
          "A production-quality token service with access/refresh token pair and rotation.",
        code: `import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

function issueTokens(userId: string) {
  const accessToken = jwt.sign(
    { sub: userId },
    ACCESS_SECRET,
    { expiresIn: "15m", algorithm: "HS256" },
  );
  const refreshToken = jwt.sign(
    { sub: userId },
    REFRESH_SECRET,
    { expiresIn: "7d",  algorithm: "HS256" },
  );
  return { accessToken, refreshToken };
}

// POST /auth/login
export async function login(req: Request, res: Response) {
  const user = await verifyCredentials(req.body.email, req.body.password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const { accessToken, refreshToken } = issueTokens(user.id);

  // Refresh token in HttpOnly cookie — JS cannot access it
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge:   7 * 24 * 60 * 60 * 1000,  // 7 days in ms
  });

  // Access token in response body — stored in memory by the client
  res.json({ accessToken });
}

// POST /auth/refresh — rotate refresh token
export async function refresh(req: Request, res: Response) {
  const token = req.cookies.refreshToken as string | undefined;
  if (!token) return res.status(401).json({ error: "No refresh token" });

  let payload: jwt.JwtPayload;
  try {
    payload = jwt.verify(token, REFRESH_SECRET) as jwt.JwtPayload;
  } catch {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }

  // Token rotation — issue new pair and invalidate old refresh token
  await invalidateRefreshToken(token);          // store in Redis blocklist
  const { accessToken, refreshToken } = issueTokens(payload.sub!);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, secure: true, sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ accessToken });
}`,
        language: "typescript",
      },
    ],
  },
};
