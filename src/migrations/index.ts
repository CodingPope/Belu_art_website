import * as migration_20260620_032907_initial from './20260620_032907_initial';

export const migrations = [
  {
    up: migration_20260620_032907_initial.up,
    down: migration_20260620_032907_initial.down,
    name: '20260620_032907_initial'
  },
];
