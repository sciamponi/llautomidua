import { promises as fs } from 'fs';
import path from 'path';
import { StorageCategory, StorageFile, StorageProvider } from './types';

export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;

  constructor(baseDir: string = '/data/storage') {
    this.baseDir = baseDir;
  }

  private getCategoryPath(category: StorageCategory): string {
    return path.join(this.baseDir, category);
  }

  async uploadFile(file: Buffer, fileName: string, category: StorageCategory): Promise<StorageFile> {
    const dirPath = this.getCategoryPath(category);
    await fs.mkdir(dirPath, { recursive: true });
    
    const filePath = path.join(dirPath, fileName);
    await fs.writeFile(filePath, file);

    const stats = await fs.stat(filePath);

    return {
      name: fileName,
      url: `/api/public/storage/${category}/${fileName}`, // Placeholder URL logic
      category,
      size: stats.size,
      updatedAt: stats.mtime
    };
  }

  async getFileUrl(fileName: string, category: StorageCategory): Promise<string> {
    return `/api/public/storage/${category}/${fileName}`;
  }

  async deleteFile(fileName: string, category: StorageCategory): Promise<void> {
    const filePath = path.join(this.getCategoryPath(category), fileName);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  }

  async listFiles(category: StorageCategory): Promise<StorageFile[]> {
    const dirPath = this.getCategoryPath(category);
    try {
      const files = await fs.readdir(dirPath);
      const storageFiles = await Promise.all(
        files.map(async (name) => {
          const stats = await fs.stat(path.join(dirPath, name));
          return {
            name,
            url: await this.getFileUrl(name, category),
            category,
            size: stats.size,
            updatedAt: stats.mtime
          };
        })
      );
      return storageFiles;
    } catch (error) {
      return [];
    }
  }
}
