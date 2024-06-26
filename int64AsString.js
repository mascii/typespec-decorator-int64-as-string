import { $encode } from "@typespec/compiler";

/**
 * @param context {import("@typespec/compiler").DecoratorContext}
 * @param target {import("@typespec/compiler").ModelProperty}
 */
export function $int64AsString(context, target) {
  if ("name" in target.type && target.type.name === "int64") {
    $encode(context, target, "int64");
  } else {
    throw new Error(
      "@int64AsString decorator can only be used for int64 properties.",
    );
  }
}
