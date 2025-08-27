import { expectDiagnostics } from "@typespec/compiler/testing";
import { oapiForModel, diagnoseOpenApiFor } from "./test-host.js";

describe("@uint64AsString", () => {
  it("should work correctly with uint64 type", async () => {
    const res = await oapiForModel(
      "Foo",
      `
        model Foo {
          @uint64AsString id1: uint64;
          id2: uint64;
        }
      `,
    );

    expect(res.schemas.Foo).toMatchObject({
      required: ["id1", "id2"],
      properties: {
        id1: { type: "string", format: "uint64" },
        id2: { type: "integer", format: "uint64" },
      },
    });
  });

  it("should report diagnostic when used on non-uint64 type", async () => {
    const diagnostics = await diagnoseOpenApiFor(
      `
        model Foo {
          @uint64AsString id: int32;
        }
      `,
    );

    expectDiagnostics(diagnostics, {
      code: "typespec-decorator-int64-as-string/invalid-uint64-target",
      message:
        "@uint64AsString decorator can only be used for uint64 properties.",
    });
  });
});
