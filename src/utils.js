import { unlink } from 'fs';

export function removeFile(filePath) {
    return new Promise((resolve, reject) => {
        try {
            unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}