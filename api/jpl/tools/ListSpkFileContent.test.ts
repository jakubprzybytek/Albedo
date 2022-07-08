import { describe, it } from "vitest";
import { ListSpkFileContent } from "./ListSpkFileContent";

describe("ListSpkFileContent", () => {
    it("list", async () => {
        ListSpkFileContent('d:/Workspace/Java/Albedo/misc/jpl-kernels/de440s.bsp');
    });
});

