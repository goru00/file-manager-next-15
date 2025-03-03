'use server';

import path from "path";
import { ALLOWED_TYPES, MAX_FILE_SIZE, UPLOAD_DIR } from "../constants";
import { isAllowedMimeType, sanitizeFileName } from "../utils";
import { exception } from "./exception";
import dayjs from 'dayjs';
import fs from 'fs/promises';
import fsp from 'fs';
import { revalidatePath } from "next/cache";

export type UploadResult = {
    success: boolean;
    message: string;
    filename?: string;
}

const upload = async (formData: FormData): Promise<UploadResult> => {
    try {
        const file = formData.get('file') as File;
        if (!file) return { success: false, message: 'Файл не выбран' };
        if (!isAllowedMimeType(file.type)) {
            return { 
                success: false, 
                message: `Недопустимый формат файла. Допустимые форматы: ${Object.keys(ALLOWED_TYPES).join(', ')}` 
            };
        }
        if (file.size > MAX_FILE_SIZE) {
            return {
                success: false,
                message: `Размер файла превышает допустимый размер (${MAX_FILE_SIZE / (1024 * 1024)} МБ).`,
            }
        }

        const timestamp = dayjs().format('YYYY-MM-DD');
        const saveFilename = `${timestamp}_${sanitizeFileName(file.name)}`;
        const filepath = path.join(UPLOAD_DIR, saveFilename);
        if (!fsp.existsSync(UPLOAD_DIR)) {
            await fs.mkdir(UPLOAD_DIR);
        }
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await fs.writeFile(filepath, buffer);
        const stats = await fs.stat(filepath);
        if (stats.size !== file.size) {
            await fs.unlink(filepath);
            return { success: false, message: 'Не удалось сохранить файл.' };
        }
        revalidatePath("/");
        return {
            success: true,
            message: 'Файл успешно загружен',
            filename: saveFilename,
        }
    } catch (err) {
        return exception(err);
    }
}

export { upload }