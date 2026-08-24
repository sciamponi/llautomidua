import { LocalStorageProvider } from './local.server';
import { StorageProvider } from './types';

// O baseDir deve vir de uma variável de ambiente no futuro, ex: process.env.STORAGE_PATH
const storageProvider: StorageProvider = new LocalStorageProvider(
  process.env['STORAGE_PATH'] || '/data/storage'
);

export { storageProvider };
