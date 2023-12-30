# Flags

`Flags` is a flexible and robust flag management system, designed for use with
UrsaMU in Deno. It allows for easy handling and querying of flags, which can
represent various states or features in an entity component system (ECS).

## Features

- Add and manage custom flags.
- Check if flags exist and retrieve their properties.
- Evaluate flag expressions to determine complex state conditions.
- Handle flag groups for organized management.

## Installation

Since this module is designed for Deno, no package manager is needed. Import it
directly into your Deno project:

```typescript
import { Flags } from "path/to/flags.ts";
```

Replace `'path/to/flags.ts'` with the actual path to the `flags.ts` file in your
project.

## Usage

### Creating a Flags Instance

```typescript
const flags = new Flags(
  { name: "admin", code: "A", lvl: 1 },
  { name: "user", code: "U", lvl: 0 },
);
```

### Adding Flags

```typescript
flags.add({ name: "moderator", code: "M", lvl: 2 });
```

### Checking for Flag Existence

```typescript
const hasAdmin = flags.exists("admin");
```

### Evaluating Flag Expressions

```typescript
const isAuthorized = flags.check("admin user", "admin | moderator");
```

### Setting Flags

```typescript
let data = {};
const result = flags.set("user", data, "admin");
```

## API

### `add(flags: Flag[])`

Add one or more flags to the system.

### `exists(name: string): Flag | undefined`

Check if a flag exists and return the flag object.

### `check(list: string, flagExpr: string): boolean`

Check a list of flags against a flag expression.

### `set(flags: string, data: Data, expr: string): { flags: string, data: Data }`

Set and modify flags based on an expression.

## Testing

To run tests in Deno:

```sh
deno test
```

## License

MIT

## Contributing

Contributions are welcome. Please submit a pull request or an issue if you have
any improvements or ideas.
