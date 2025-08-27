import { $encode } from "@typespec/compiler";
import { reportDiagnostic } from "./lib.js";

/**
 * @param context {import("@typespec/compiler").DecoratorContext}
 * @param target {import("@typespec/compiler").ModelProperty}
 */
export function $uint64AsString(context, target) {
  if ("name" in target.type && target.type.name === "uint64") {
    $encode(context, target, "uint64");
  } else {
    reportDiagnostic(context.program, {
      code: "invalid-uint64-target",
      target: target,
    });
  }
}
