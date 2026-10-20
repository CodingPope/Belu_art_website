import * as migration_20261020_214707_baseline from './20261020_214707_baseline';
import * as migration_20261020_214740_redesign from './20261020_214740_redesign';

export const migrations = [
  {
    up: migration_20261020_214707_baseline.up,
    down: migration_20261020_214707_baseline.down,
    name: '20261020_214707_baseline',
  },
  {
    up: migration_20261020_214740_redesign.up,
    down: migration_20261020_214740_redesign.down,
    name: '20261020_214740_redesign'
  },
];
