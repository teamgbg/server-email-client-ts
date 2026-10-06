/**
 * @system codegen
 * @status generated
 * @edit change the module's exports, then re-run codegen. Hand-edits are overwritten.
 *
 * The configured-primitive contract for this package, derived from the module's
 * OWN exported surface rather than from a registry row — the row does not
 * describe the code, and routing this through one would make a local testing
 * concern depend on a deployed service.
 */

import { expect, test } from "bun:test";
import { configure, getInternalApiKey } from "../configure.ts";

// DECLARED FIRST ON PURPOSE: configure() state is module-level and never
// unsets, so the before-injection behaviour can only be observed before any
// case below has injected anything.
test("an accessor reports absence before configure()", () => {
	// Either shape is a correct answer to "nothing was injected": a loud throw
	// or an explicit undefined. What is NOT acceptable is a plausible value,
	// which is what a silently-defaulting accessor would return.
	let reported: unknown;
	try {
		reported = getInternalApiKey();
	} catch {
		reported = undefined;
	}
	expect(reported).toBeUndefined();
});

test("getInternalApiKey reads back what configure() injected", () => {
	// The probe value is a sentinel whose only job is to be distinguishable, so
	// its TYPE is erased on both sides — `as never` going in (as it always was)
	// and on the assertion coming back. Without the second cast the emitted test
	// cannot typecheck: `toBe` is typed against the accessor's declared return,
	// so a sentinel of any other shape is rejected. This failed in every package
	// carrying the generated file.
	const asFound = getInternalApiKey();
	const injected = { probe: "internalApiKey" };
	configure({ internalApiKey: injected } as never);
	expect(getInternalApiKey()).toBe(injected as never);
	// The suite leaves the module as it found it: bun test runs every file in
	// ONE process, and a holder left holding the probe poisons every later
	// suite that reads this accessor.
	configure({ internalApiKey: asFound } as never);
});

test("a second configure() replaces what getInternalApiKey returns", () => {
	// A boot re-run must REPLACE rather than accumulate, or a stale value
	// survives behind the current one and the accessor reports the wrong
	// injection with nothing failing.
	const asFound = getInternalApiKey();
	const first = { probe: "internalApiKey_first" };
	const second = { probe: "internalApiKey_second" };
	configure({ internalApiKey: first } as never);
	configure({ internalApiKey: second } as never);
	expect(getInternalApiKey()).toBe(second as never);
	expect(getInternalApiKey()).not.toBe(first as never);
	configure({ internalApiKey: asFound } as never);
});
