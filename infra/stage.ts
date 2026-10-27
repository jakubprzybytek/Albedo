// Stage-specific behaviour lives here, so infra code checks flags instead of stage names.
// What each stage is for: docs/development.md.

const stage = $app.stage;

export const isProd = stage === "prod";

// prod lives at the bare domain, other stages under a prefix.
export const siteDomain = isProd ? "albedoonline.com" : `${stage}.albedoonline.com`;

// Cognito groups the API accepts (the pool is shared). The test user's group only off prod.
export const TEST_USER = "albedo-test@albedoonline.com";
export const accessGroups = isProd ? ["albedo"] : ["albedo", "albedo-test"];
