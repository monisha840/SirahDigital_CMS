import * as migration_20260820_031730_baseline from './20260820_031730_baseline';
import * as migration_20260821_171147_remove_blog from './20260821_171147_remove_blog';
import * as migration_20260824_130000_booking_reschedule from './20260824_130000_booking_reschedule';

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
  {
    up: migration_20260824_130000_booking_reschedule.up,
    down: migration_20260824_130000_booking_reschedule.down,
    name: '20260824_130000_booking_reschedule'
  },
];
