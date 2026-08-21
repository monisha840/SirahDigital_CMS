import * as migration_20260820_031730_baseline from './20260820_031730_baseline';
import * as migration_20260821_171147_remove_blog from './20260821_171147_remove_blog';

export const migrations = [
  {
    up: migration_20260820_031730_baseline.up,
    down: migration_20260820_031730_baseline.down,
    name: '20260820_031730_baseline',
  },
  {
    up: migration_20260821_171147_remove_blog.up,
    down: migration_20260821_171147_remove_blog.down,
    name: '20260821_171147_remove_blog'
  },
];
