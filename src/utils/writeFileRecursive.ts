import { mkdir, writeFileSync } from 'fs';

export const writeFileRecursive = function (path: string, buffer: Buffer) {
  return new Promise((resolve) => {
    const lastPath = path.substring(0, path.lastIndexOf('/'));
    mkdir(lastPath, { recursive: true }, (err) => {
      writeFileSync(path, buffer);
      resolve('success');
    });
  });
};
