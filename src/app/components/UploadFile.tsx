'use client';
import { upload } from "@/app/actions/upload";
import { useState } from "react";
import { formatFileSize } from "../utils";
import { MAX_FILE_SIZE } from "../constants";

export default function UploadFile() {

    const [error, setError] = useState<string | null>(null);

    const handleUpload = async (formData: FormData) => {
        const result = await upload(formData);
        if (!result.success) {
            setError(result.message);
        } else {
            setError(null);
        }
    }

    return (
        <div className="p-6 rounded-lg bg-[#282a36] mb-8 border border-[#44475a]">
            <form action={handleUpload}>
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-[#44475a] rounded-lg p-6 bg-[#1e1f29]">
                        <input 
                            name="file"
                            type="file"
                            className="text-[#f8f8f2] file:p-2 file:rounded-lg file:border-0 file:bg-[#bd93f9] hover:file:bg-[#ff79c6]"
                        />
                        <p className="mt-2 text-[#6272a4]">
                            Максимальная размерность файла: {formatFileSize(MAX_FILE_SIZE)}
                        </p>
                    </div>
                    {error && (
                        <p className="text-[#ff5555]">
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="w-full p-2 bg-[#bd93f9] rounded-lg hover:bg-[#ff79c6]"
                    >
                        Загрузить файл
                    </button>
                </div>
            </form>
        </div>
    )
}