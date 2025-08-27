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

  it("should work correctly with uint64 array type", async () => {
    const res = await oapiForModel(
      "Foo",
      `
        model Foo {
          @uint64AsString
          ids1: uint64[];
          @uint64AsString
          ids2: Array<uint64>;

          ids3: uint64[];
          ids4: Array<uint64>;
        }
      `,
    );

    expect(res.schemas.Foo).toMatchObject({
      required: ["ids1", "ids2", "ids3", "ids4"],
      properties: {
        ids1: {
          type: "array",
          items: { type: "string", format: "uint64" },
        },
        ids2: {
          type: "array",
          items: { type: "string", format: "uint64" },
        },
        ids3: {
          type: "array",
          items: { type: "integer", format: "uint64" },
        },
        ids4: {
          type: "array",
          items: { type: "integer", format: "uint64" },
        },
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

  it("should report diagnostic when used on non-uint64 array type", async () => {
    const diagnostics = await diagnoseOpenApiFor(
      `
        model Foo {
          @uint64AsString ids: int32[];
        }
      `,
    );

    expectDiagnostics(diagnostics, {
      code: "typespec-decorator-int64-as-string/invalid-uint64-target",
      message:
        "@uint64AsString decorator can only be used for uint64 properties.",
    });
  });

  it("should report diagnostic when used on string array type", async () => {
    const diagnostics = await diagnoseOpenApiFor(
      `
        model Foo {
          @uint64AsString names: string[];
        }
      `,
    );

    expectDiagnostics(diagnostics, {
      code: "typespec-decorator-int64-as-string/invalid-uint64-target",
      message:
        "@uint64AsString decorator can only be used for uint64 properties.",
    });
  });

  it("should work correctly with optional properties", async () => {
    const res = await oapiForModel(
      "Foo",
      `
        model Foo {
          @uint64AsString id?: uint64;
          @uint64AsString ids?: uint64[];
          name: string;
        }
      `,
    );

    expect(res.schemas.Foo).toMatchObject({
      required: ["name"],
      properties: {
        id: { type: "string", format: "uint64" },
        ids: {
          type: "array",
          items: { type: "string", format: "uint64" },
        },
        name: { type: "string" },
      },
    });
  });

  it("should report diagnostic when used on uint64 union type", async () => {
    const diagnostics = await diagnoseOpenApiFor(
      `
        model Foo {
          @uint64AsString id: uint64 | null;
        }
      `,
    );

    expectDiagnostics(diagnostics, {
      code: "typespec-decorator-int64-as-string/invalid-uint64-target",
      message:
        "@uint64AsString decorator can only be used for uint64 properties.",
    });
  });

  it("should work correctly with multiple decorators", async () => {
    const res = await oapiForModel(
      "Foo",
      `
        model Foo {
          @uint64AsString
          @example(123)
          id: uint64;
        }
      `,
    );

    expect(res.schemas.Foo).toMatchObject({
      required: ["id"],
      properties: {
        id: {
          type: "string",
          format: "uint64",
          example: 123,
        },
      },
    });
  });

  it("should report diagnostic when used on Record type", async () => {
    const diagnostics = await diagnoseOpenApiFor(
      `
        model Foo {
          @uint64AsString counts: Record<uint64>;
        }
      `,
    );

    expectDiagnostics(diagnostics, {
      code: "typespec-decorator-int64-as-string/invalid-uint64-target",
      message:
        "@uint64AsString decorator can only be used for uint64 properties.",
    });
  });

  it("should report diagnostic when used on invalid union type", async () => {
    const diagnostics = await diagnoseOpenApiFor(
      `
        model Foo {
          @uint64AsString id: string | uint64;
        }
      `,
    );

    expectDiagnostics(diagnostics, {
      code: "typespec-decorator-int64-as-string/invalid-uint64-target",
      message:
        "@uint64AsString decorator can only be used for uint64 properties.",
    });
  });

  it("should work correctly with type alias", async () => {
    const res = await oapiForModel(
      "Foo",
      `
        alias uint64Array = uint64[];
        model Foo {
          @uint64AsString ids: uint64Array;
        }
      `,
    );

    expect(res.schemas.Foo).toMatchObject({
      required: ["ids"],
      properties: {
        ids: {
          type: "array",
          items: { type: "string", format: "uint64" },
        },
      },
    });
  });

  it("should report diagnostic when used on nested array type", async () => {
    const diagnostics = await diagnoseOpenApiFor(
      `
        model Foo {
          @uint64AsString matrix: uint64[][];
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
