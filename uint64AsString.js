import { $encode, isArrayModelType } from "@typespec/compiler";
import { $extension } from "@typespec/openapi";
import { reportDiagnostic } from "./lib.js";

/**
 * @param context {import("@typespec/compiler").DecoratorContext}
 * @param target {import("@typespec/compiler").ModelProperty}
 */
export function $uint64AsString(context, target) {
  const targetType = target.type;

  if (targetType.kind === "Scalar" && targetType.name === "uint64") {
    $encode(context, target, "uint64");
    return;
  }

  if (
    isArrayModelType(context.program, targetType) &&
    targetType.indexer?.value.name === "uint64"
  ) {
    $extension(context, target, "items", { type: "string", format: "uint64" });
    return;
  }

  reportDiagnostic(context.program, {
    code: "invalid-uint64-target",
    target,
  });
}
