# typespec-decorator-int64-as-string

A TypeSpec decorator for emitting `string` type from `int64`.

## Installation

```bash
npm i -D typespec-decorator-int64-as-string
# or
yarn add -D typespec-decorator-int64-as-string
# or
pnpm i -D typespec-decorator-int64-as-string
```

## Usage

In your .tsp files, apply the `@int64AsString` decorator as follows:

```typespec
import "typespec-decorator-int64-as-string";

model Foo {
  @int64AsString id: int64;
}

model Bar {
  id: int64;
}
```

When you emit the above .tsp to OpenAPI using `@typespec/openapi3`, the following schemas will be generated:

```yaml
schemas:
  Foo:
    type: object
    required:
      - id
    properties:
      id:
        type: string # Here's the change by the @int64AsString decorator
        format: int64
  Bar:
    type: object
    required:
      - id
    properties:
      id:
        type: integer
        format: int64
```

You can also perform a global import using `tspconfig.yaml`:

```yaml
imports:
  - typespec-decorator-int64-as-string
```

## License

MIT
