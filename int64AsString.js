import { $encode, isArrayModelType } from "@typespec/compiler";
import { $extension } from "@typespec/openapi";
import { reportDiagnostic } from "./lib.js";

/**
 * @param context {import("@typespec/compiler").DecoratorContext}
 * @param target {import("@typespec/compiler").ModelProperty}
 */
export function $int64AsString(context, target) {
  const targetType = target.type;

  if (targetType.kind === "Scalar" && targetType.name === "int64") {
    $encode(context, target, "int64");
    return;
  }

  if (
    isArrayModelType(context.program, targetType) &&
    targetType.indexer?.value.name === "int64"
  ) {
    $extension(context, target, "items", { type: "string", format: "int64" });
    return;
  }

  reportDiagnostic(context.program, {
    code: "invalid-int64-target",
    target,
  });
}
