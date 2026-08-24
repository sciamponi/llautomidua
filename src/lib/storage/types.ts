export type StorageCategory = 'logos' | 'previews' | 'uploads' | 'documents';

export interface StorageFile {
  name: string;
  url: string;
  category: StorageCategory;
  size?: number;
  mimeType?: string;
  updatedAt: Date;
}

export interface StorageProvider {
  uploadFile(file: Buffer, fileName: string, category: StorageCategory): Promise<StorageFile>;
  getFileUrl(fileName: string, category: StorageCategory): Promise<string>;
  deleteFile(fileName: string, category: StorageCategory): Promise<void>;
  listFiles(category: StorageCategory): Promise<StorageFile[]>;
}
