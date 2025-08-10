import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export type UserRole = "user" | "admin";
export type TokenPayload = { sub: string; role: UserRole };

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-me");
const issuer = "navi-aula";
const audience = "navi-aula";

export async function signToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .setIssuer(issuer)
    .setAudience(audience)
    .sign(secretKey);
}

export async function verifyToken(token: string): Promise<(TokenPayload & JWTPayload) | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey, { issuer, audience });
    return payload as TokenPayload & JWTPayload;
  } catch {
    return null;
  }
}
