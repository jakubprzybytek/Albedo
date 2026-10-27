import { describe, expect, it } from "vitest";
import { allowedGroups, groupsOf, hasAccess } from "./access";

describe("groupsOf", () => {
  it("reads the groups claim in each shape it comes in", () => {
    expect(groupsOf({ "cognito:groups": "albedo,albedo-test" })).toEqual(["albedo", "albedo-test"]);
    expect(groupsOf({ "cognito:groups": "[albedo albedo-test]" })).toEqual(["albedo", "albedo-test"]);
    expect(groupsOf({ "cognito:groups": ["albedo"] })).toEqual(["albedo"]);
    expect(groupsOf({ "cognito:groups": "" })).toEqual([]);
    expect(groupsOf(undefined)).toEqual([]);
  });
});

describe("hasAccess", () => {
  const claims = { aud: "client", "cognito:groups": "albedo" };

  it("needs this stage's client and an accepted group", () => {
    expect(hasAccess(claims, ["albedo"], "client")).toBe(true);
    expect(hasAccess(claims, ["albedo-test"], "client")).toBe(false);
    expect(hasAccess(claims, ["albedo"], "other")).toBe(false);
    expect(hasAccess(claims, ["albedo"], undefined)).toBe(false);
  });

  it("parses ACCESS_GROUPS", () => {
    expect(allowedGroups("albedo, albedo-test")).toEqual(["albedo", "albedo-test"]);
    expect(allowedGroups(undefined)).toEqual([]);
  });
});
