import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';

import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file)
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, file); // esse é o caminho do arquivo configurado pelo path

    try {
      await fs.promises.stat(filePath); // verifica o status do arquivo, assim com essa logica verifica sua existencia
    } catch {
      return;
    }
    await fs.promises.unlink(filePath); // Metodo que apaga o arquivo no fs
  }
}

export default DiskStorageProvider;
