import "./int64AsString.js";

using TypeSpec.Reflection;

/**
 * Emit string type from int64.
 * This decorator is equivalent to `@encode("int64", string)`.
 */
extern dec int64AsString(target: ModelProperty);
