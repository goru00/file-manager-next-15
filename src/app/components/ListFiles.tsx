import { deleteFile } from "@/app/actions/delete";
import { groupFilesByType } from "@/app/utils";
import dayjs from "dayjs";
import fs from "fs/promises";
import Image from "next/image";

const ListFiles = async () => {
  let files: string[] = [];

  try {
    files = await fs.readdir("uploads");
  } catch (error) {
    console.error(error);
    await fs.mkdir("uploads", { recursive: true });
  }

  const groupedFiles = groupFilesByType(files);

  const handleDelete = async (fileName: string) => {
    "use server";
    await deleteFile(fileName);
  };

  return (
    <>
      {Object.entries(groupedFiles).map(([type, typeFiles]) => (
        <div key={type} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 capitalize text-[#f8f8f2]">
            {type}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typeFiles.map((file) => (
              <div
                key={file}
                className="bg-[#282a36] p-4 rounded-lg border border-[#44475a]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#f8f8f2] truncate">
                      {file}
                    </p>
                    <p className="text-xs text-[#6272a4]">
                      {dayjs(file.split("_")[0]).format('DD.MM.YYYY')}
                    </p>
                  </div>
                  <form action={handleDelete.bind(null, file)}>
                    <button
                      type="submit"
                      className="ml-2 px-3 py-1 bg-[#ff5555] text-[#282a36] rounded-lg"
                    >
                      Удалить
                    </button>
                  </form>
                </div>

                {type === "image" && (
                  <div className="relative aspect-video bg-[#1e1f29] rounded-md">
                    <Image
                      src={`/api/download/${file}`}
                      alt={file}
                      fill
                      className="rounded-md object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                {type === "video" && (
                  <video
                    className="w-full rounded-md bg-[#1e1f29]"
                    controls
                    src={`/api/download/${file}`}
                  />
                )}
                {type === "audio" && (
                  <audio
                    className="w-full mt-3"
                    controls
                    src={`/api/download/${file}`}
                    preload="none"
                  />
                )}
                {(type === "document" || type === "other") && (
                  <div className="mt-2">
                    <a
                      href={`/api/download/${file}`}
                      className="text-[#bd93f9] hover:text-[#ff79c6] text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Скачать файл
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {files.length === 0 && (
        <div className="text-center py-12 bg-[#1e1f29] rounded-lg border border-[#44475a]">
          <p className="text-[#6272a4]">Файлов не было загружено</p>
        </div>
      )}
    </>
  );
};

export { ListFiles };