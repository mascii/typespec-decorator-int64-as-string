import { $encode } from "@typespec/compiler";

/**
 * @param context {import("@typespec/compiler").DecoratorContext}
 * @param target {import("@typespec/compiler").ModelProperty}
 */
export function $uint64AsString(context, target) {
  if ("name" in target.type && target.type.name === "uint64") {
    $encode(context, target, "uint64");
  } else {
    throw new Error(
      "@uint64AsString decorator can only be used for uint64 properties.",
    );
  }
}
