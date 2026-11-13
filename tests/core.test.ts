import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { brandCheck } from "../lib/brand-check.ts";
import { effectivePlan } from "../lib/plans.ts";
import { verifyStripeSignature } from "../lib/stripe-signature.ts";

test("brandCheck flags avoided words", () => {
  const r = brandCheck("We leverage synergy. Synergy wins.", ["synergy", "leverage"]);
  assert.equal(r.bannedHits.find((h) => h.word === "synergy")?.count, 2);
  assert.ok(r.score < 100);
});
test("brandCheck clean text scores 100 without sample", () => {
  assert.equal(brandCheck("Short clear words.", ["synergy"]).score, 100);
});
test("expired trial has no plan; active pro does", () => {
  const past = new Date(Date.now() - 1000).toISOString();
  assert.equal(effectivePlan({ plan: "trial", status: "trialing", trial_ends_at: past, current_period_end: null, billing_interval: null }), "none");
  assert.equal(effectivePlan({ plan: "pro", status: "active", trial_ends_at: null, current_period_end: null, billing_interval: "month" }), "pro");
  assert.equal(effectivePlan({ plan: "pro", status: "canceled", trial_ends_at: null, current_period_end: null, billing_interval: "month" }), "none");
});
test("stripe signature verification", () => {
  const body = '{"a":1}', secret = "whsec_test", t = 1_700_000_000;
  const sig = createHmac("sha256", secret).update(`${t}.${body}`).digest("hex");
  assert.equal(verifyStripeSignature(body, `t=${t},v1=${sig}`, secret, 300, t + 10), true);
  assert.equal(verifyStripeSignature(body + "x", `t=${t},v1=${sig}`, secret, 300, t + 10), false);
  assert.equal(verifyStripeSignature(body, `t=${t},v1=${sig}`, secret, 300, t + 9999), false);
});
