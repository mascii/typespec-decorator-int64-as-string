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

  it("should work correctly with int64 array type", async () => {
    const res = await oapiForModel(
      "Foo",
      `
        model Foo {
          @int64AsString
          ids1: int64[];
          @int64AsString
          ids2: Array<int64>;

          ids3: int64[];
          ids4: Array<int64>;
        }
      `,
    );

    expect(res.schemas.Foo).toMatchObject({
      required: ["ids1", "ids2", "ids3", "ids4"],
      properties: {
        ids1: {
          type: "array",
          items: { type: "string", format: "int64" },
        },
        ids2: {
          type: "array",
          items: { type: "string", format: "int64" },
        },
        ids3: {
          type: "array",
          items: { type: "integer", format: "int64" },
        },
        ids4: {
          type: "array",
          items: { type: "integer", format: "int64" },
        },
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

  it("should report diagnostic when used on non-int64 array type", async () => {
    const diagnostics = await diagnoseOpenApiFor(
      `
        model Foo {
          @int64AsString ids: int32[];
        }
      `,
    );

    expectDiagnostics(diagnostics, {
      code: "typespec-decorator-int64-as-string/invalid-int64-target",
      message:
        "@int64AsString decorator can only be used for int64 properties.",
    });
  });

  it("should report diagnostic when used on string array type", async () => {
    const diagnostics = await diagnoseOpenApiFor(
      `
        model Foo {
          @int64AsString names: string[];
        }
      `,
    );

    expectDiagnostics(diagnostics, {
      code: "typespec-decorator-int64-as-string/invalid-int64-target",
      message:
        "@int64AsString decorator can only be used for int64 properties.",
    });
  });

  it("should work correctly with optional properties", async () => {
    const res = await oapiForModel(
      "Foo",
      `
        model Foo {
          @int64AsString id?: int64;
          @int64AsString ids?: int64[];
          name: string;
        }
      `,
    );

    expect(res.schemas.Foo).toMatchObject({
      required: ["name"],
      properties: {
        id: { type: "string", format: "int64" },
        ids: {
          type: "array",
          items: { type: "string", format: "int64" },
        },
        name: { type: "string" },
      },
    });
  });

  it("should report diagnostic when used on int64 union type", async () => {
    const diagnostics = await diagnoseOpenApiFor(
      `
        model Foo {
          @int64AsString id: int64 | null;
        }
      `,
    );

    expectDiagnostics(diagnostics, {
      code: "typespec-decorator-int64-as-string/invalid-int64-target",
      message:
        "@int64AsString decorator can only be used for int64 properties.",
    });
  });

  it("should work correctly with multiple decorators", async () => {
    const res = await oapiForModel(
      "Foo",
      `
        model Foo {
          @int64AsString
          @example(123)
          id: int64;
        }
      `,
    );

    expect(res.schemas.Foo).toMatchObject({
      required: ["id"],
      properties: {
        id: {
          type: "string",
          format: "int64",
          example: 123,
        },
      },
    });
  });

  it("should report diagnostic when used on Record type", async () => {
    const diagnostics = await diagnoseOpenApiFor(
      `
        model Foo {
          @int64AsString counts: Record<int64>;
        }
      `,
    );

    expectDiagnostics(diagnostics, {
      code: "typespec-decorator-int64-as-string/invalid-int64-target",
      message:
        "@int64AsString decorator can only be used for int64 properties.",
    });
  });

  it("should report diagnostic when used on invalid union type", async () => {
    const diagnostics = await diagnoseOpenApiFor(
      `
        model Foo {
          @int64AsString id: string | int64;
        }
      `,
    );

    expectDiagnostics(diagnostics, {
      code: "typespec-decorator-int64-as-string/invalid-int64-target",
      message:
        "@int64AsString decorator can only be used for int64 properties.",
    });
  });

  it("should work correctly with type alias", async () => {
    const res = await oapiForModel(
      "Foo",
      `
        alias Int64Array = int64[];
        model Foo {
          @int64AsString ids: Int64Array;
        }
      `,
    );

    expect(res.schemas.Foo).toMatchObject({
      required: ["ids"],
      properties: {
        ids: {
          type: "array",
          items: { type: "string", format: "int64" },
        },
      },
    });
  });

  it("should report diagnostic when used on nested array type", async () => {
    const diagnostics = await diagnoseOpenApiFor(
      `
        model Foo {
          @int64AsString matrix: int64[][];
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
