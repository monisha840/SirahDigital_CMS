import * as migration_20260820_031730_baseline from './20260820_031730_baseline';

export const migrations = [
  {
    up: migration_20260820_031730_baseline.up,
    down: migration_20260820_031730_baseline.down,
    name: '20260820_031730_baseline'
  },
];
