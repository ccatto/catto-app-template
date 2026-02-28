# @rleaguez/shared

This package contains shared interfaces, types, and utilities used across the rleaguez monorepo.

## Installation

This package is part of the rleaguez monorepo and should be used as an internal dependency.

```bash
# From another workspace in the monorepo
yarn add @rleaguez/shared@*
```

## Usage

```typescript
import { YourInterface, YourType } from '@rleaguez/shared';

// Use the imported types and interfaces
const data: YourType = {
  // ...
};
```

## Development

### Building

```bash
# Build the package
yarn build
```

### Configuration

This package uses TypeScript for type definitions. The configuration can be found in `tsconfig.json`.

## Dependencies

The package has minimal dependencies to avoid conflicts when used in different projects:

- TypeScript (dev dependency)
- Type definitions for required packages (dev dependencies)

## Troubleshooting

If you encounter build errors related to missing type definitions:

1. Add the required `@types/*` package as a dev dependency
2. Make sure your TypeScript configuration has `skipLibCheck: true`
3. Check that the monorepo's root `package.json` has the correct workspace configuration

## License

MIT
