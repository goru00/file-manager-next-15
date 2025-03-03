import path from "path";
import { UPLOAD_DIR } from "@/app/constants";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";

const deleteFile = async (filename: string) => {
    try {
        const filepath = path.join(UPLOAD_DIR, filename);
        await fs.unlink(filepath);
        revalidatePath("/");
    } catch (err) {
        console.error(err);
    }
}

export { deleteFile };