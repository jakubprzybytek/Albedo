// Who may call the API. The Cognito pool is shared with other apps, and the REST API's Cognito authorizer
// accepts an ID token from any of its clients, so a valid token is not enough: the token must come from this
// stage's app client (USER_POOL_CLIENT_ID) and the user must be in one of the groups this stage accepts
// (ACCESS_GROUPS). Both are set in infra/api.ts. prod accepts only albedo; other stages also albedo-test.

type Claims = Record<string, unknown> | undefined;

// The REST API passes the groups claim as a string ("a,b"); other shapes seen: "[a b]" and arrays.
export function groupsOf(claims: Claims): string[] {
  const raw = claims?.["cognito:groups"];
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw !== "string" || !raw.trim()) return [];
  return raw.trim().replace(/^\[|\]$/g, "").split(/[\s,"]+/).filter(Boolean);
}

// No ACCESS_GROUPS means nobody gets in.
export function allowedGroups(env: string | undefined = process.env.ACCESS_GROUPS): string[] {
  return (env ?? "").split(",").map((g) => g.trim()).filter(Boolean);
}

export function hasAccess(
  claims: Claims,
  allowed: string[] = allowedGroups(),
  clientId: string | undefined = process.env.USER_POOL_CLIENT_ID,
): boolean {
  if (!clientId || claims?.aud !== clientId) return false;
  return groupsOf(claims).some((g) => allowed.includes(g));
}
