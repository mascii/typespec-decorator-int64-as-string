import { expectDiagnostics } from "@typespec/compiler/testing";
import { oapiForModel, diagnoseOpenApiFor } from "./test-host.js";

describe("@int64AsString", () => {
  it("should work correctly with int64 type", async () => {
    const res = await oapiForModel(
      "Foo",
      `
        model Foo {
          @int64AsString id1: int64;
          id2: int64;
        }
      `,
    );

    expect(res.schemas.Foo).toMatchObject({
      required: ["id1", "id2"],
      properties: {
        id1: { type: "string", format: "int64" },
        id2: { type: "integer", format: "int64" },
      },
    });
  });

  it("should report diagnostic when used on non-int64 type", async () => {
    const diagnostics = await diagnoseOpenApiFor(
      `
        model Foo {
          @int64AsString id: int32;
        }
      `,
    );

    expectDiagnostics(diagnostics, {
      code: "typespec-decorator-int64-as-string/invalid-int64-target",
      message:
        "@int64AsString decorator can only be used for int64 properties.",
    });
  });
});
