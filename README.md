# typespec-decorator-int64-as-string

A TypeSpec decorator for emitting `string` type from `int64` and `uint64`.

## Installation

```bash
npm i -D typespec-decorator-int64-as-string
# or
yarn add -D typespec-decorator-int64-as-string
# or
pnpm i -D typespec-decorator-int64-as-string
```

## Usage

In your .tsp files, apply the `@int64AsString` or `@uint64AsString` decorators as follows:

```typespec
import "typespec-decorator-int64-as-string";

model Foo {
  @int64AsString id: int64;
  @uint64AsString count: uint64;
  @int64AsString ids: int64[];
  @uint64AsString counts: uint64[];
}

model Bar {
  id: int64;
  count: uint64;
  ids: int64[];
  counts: uint64[];
}
```

When you emit the above .tsp to OpenAPI using `@typespec/openapi3`, the following schemas will be generated:

```yaml
schemas:
  Foo:
    type: object
    required:
      - id
      - count
      - ids
      - counts
    properties:
      id:
        type: string # Here's the change by the @int64AsString decorator
        format: int64
      count:
        type: string # Here's the change by the @uint64AsString decorator
        format: uint64
      ids:
        type: array
        items:
          type: string # Array items are also converted to string
          format: int64
      counts:
        type: array
        items:
          type: string # Array items are also converted to string
          format: uint64
  Bar:
    type: object
    required:
      - id
      - count
      - ids
      - counts
    properties:
      id:
        type: integer
        format: int64
      count:
        type: integer
        format: uint64
      ids:
        type: array
        items:
          type: integer
          format: int64
      counts:
        type: array
        items:
          type: integer
          format: uint64
```

You can also perform a global import using `tspconfig.yaml`:

```yaml
imports:
  - typespec-decorator-int64-as-string
```

## License

MIT
