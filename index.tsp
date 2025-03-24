import "./int64AsString.js";
import "./uint64AsString.js";

using TypeSpec.Reflection;

/**
 * Emit string type from int64.
 * This decorator is equivalent to `@encode("int64", string)`.
 */
extern dec int64AsString(target: ModelProperty);

/**
 * Emit string type from uint64.
 * This decorator is equivalent to `@encode("uint64", string)`.
 */
extern dec uint64AsString(target: ModelProperty);
