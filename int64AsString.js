import { $encode } from "@typespec/compiler";
import { reportDiagnostic } from "./lib.js";

/**
 * @param context {import("@typespec/compiler").DecoratorContext}
 * @param target {import("@typespec/compiler").ModelProperty}
 */
export function $int64AsString(context, target) {
  if ("name" in target.type && target.type.name === "int64") {
    $encode(context, target, "int64");
  } else {
    reportDiagnostic(context.program, {
      code: "invalid-int64-target",
      target,
    });
  }
}
