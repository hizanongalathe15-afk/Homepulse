# Shared

Shared types and utilities used across the monorepo (backend, admin, app).

## Structure
```
shared/
├── types/
│   └── shared.types.ts    # Common TypeScript interfaces
└── utils/
    ├── formatters.ts      # Shared formatting utilities
    └── validators.ts      # Shared validation logic
```

## Usage
Import directly from `shared/` in consuming packages.

### Backend
```ts
import { SharedType } from '@shared/types'
```

### Admin
```ts
import { formatCurrency } from '@shared/utils'
```

### App (Flutter)
Shared Dart utilities may be copied or linked depending on build setup.
