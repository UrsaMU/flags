// flags_test.ts

import { Flags } from "./flags.ts";
import { assertEquals } from "https://deno.land/std@0.210.0/testing/asserts.ts";

Deno.test("Flags: Add and Check Existence of Flags", () => {
  const flags = new Flags({ name: "admin", code: "A", lvl: 1 });
  flags.add({ name: "user", code: "U", lvl: 0 });

  const adminFlag = flags.exists("admin");
  const userFlag = flags.exists("user");

  assertEquals(adminFlag !== undefined, true);
  assertEquals(userFlag !== undefined, true);
});

Deno.test("Flags: Get Highest Level from Flags List", () => {
  const flags = new Flags({ name: "admin", code: "A", lvl: 3 }, {
    name: "user",
    code: "U",
    lvl: 1,
  });

  const maxLvl = flags.lvl("admin user");
  assertEquals(maxLvl, 3);
});

Deno.test("Flags: Get Codes from Flags List", () => {
  const flags = new Flags({ name: "admin", code: "A" }, {
    name: "user",
    code: "U",
  });

  const codes = flags.codes("admin user");
  assertEquals(codes, "AU");
});

Deno.test("Flags: Check Flags Against Expression", () => {
  const flags = new Flags({ name: "admin", code: "A" }, {
    name: "user",
    code: "U",
  }, { name: "guest", code: "G" });

  const check1 = flags.check("admin user", "admin");
  const check2 = flags.check("admin user", "!guest");
  const check3 = flags.check("admin user", "admin|guest");

  assertEquals(check1, true);
  assertEquals(check2, true);
  assertEquals(check3, true);
});

Deno.test("Flags: Set and Modify Flags", () => {
  const flags = new Flags({ name: "admin", code: "A" }, {
    name: "user",
    code: "U",
  });
  const data = { existing: "data" };

  const result = flags.set("admin", data, "!admin user");
  assertEquals(result.flags, "user");
  assertEquals(Object.prototype.hasOwnProperty.call(data, "admin"), false);
});
