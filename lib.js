import { createTypeSpecLibrary } from "@typespec/compiler";

export const $lib = createTypeSpecLibrary({
  name: "typespec-decorator-int64-as-string",
  diagnostics: {
    "invalid-int64-target": {
      severity: "error",
      messages: {
        default:
          "@int64AsString decorator can only be used for int64 properties.",
      },
    },
    "invalid-uint64-target": {
      severity: "error",
      messages: {
        default:
          "@uint64AsString decorator can only be used for uint64 properties.",
      },
    },
  },
});

export const { reportDiagnostic } = $lib;
