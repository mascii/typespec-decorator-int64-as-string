// These helpers were defined with reference to the following file:
// https://github.com/microsoft/typespec/blob/typespec-stable%401.3.0/packages/openapi3/test/test-host.ts

import { resolvePath } from "@typespec/compiler";
import { createTester } from "@typespec/compiler/testing";

/**
 * Unable to import from `@typespec/compiler`, so it is set to `any`.
 **/
type OpenAPI3EmitterOptions = any;

export const ApiTester = createTester(resolvePath(import.meta.dirname, ".."), {
  libraries: [
    "@typespec/http",
    "@typespec/openapi",
    "@typespec/openapi3",
    "typespec-decorator-int64-as-string",
  ],
});

export const SimpleTester = ApiTester.import(
  "@typespec/http",
  "@typespec/openapi",
  "@typespec/openapi3",
  "typespec-decorator-int64-as-string",
)
  .using("Http", "OpenAPI")
  .emit("@typespec/openapi3");

export async function diagnoseOpenApiFor(
  code: string,
  options: OpenAPI3EmitterOptions = {},
) {
  const diagnostics = await SimpleTester.diagnose(code, {
    compilerOptions: { options: { "@typespec/openapi3": options as any } },
  });
  return diagnostics;
}

export async function openApiFor(
  code: string,
  options: OpenAPI3EmitterOptions = {},
) {
  const host = await SimpleTester.createInstance();
  const outPath = "{emitter-output-dir}/openapi.json";
  const { outputs } = await host.compile(code, {
    compilerOptions: {
      options: { "@typespec/openapi3": { ...options, "output-file": outPath } },
    },
  });

  return JSON.parse(outputs["openapi.json"]);
}

export async function oapiForModel(
  name: string,
  modelDef: string,
  options: OpenAPI3EmitterOptions = {},
) {
  const oapi = await openApiFor(
    `
    ${modelDef};
    @service(#{title: "Testing model"})
    @route("/")
    namespace root {
      op read(): {
        @header contentType: "application/json";
        @body body: ${name};
      };
    }
  `,
    options,
  );

  const useSchema =
    oapi.paths["/"].get.responses[200].content["application/json"].schema;

  return {
    isRef: !!useSchema.$ref,
    useSchema,
    schemas: oapi.components.schemas || {},
  };
}
