import { MAX_FILE_SIZE, UPLOAD_DIR } from "@/app/constants";
import { canShowInBrowser, getMimeTypeFromExtension } from "@/app/utils";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from 'fs/promises';

type Params = Promise<{ filename: string }>;
const GET = async (_: NextRequest, { params }: { params: Params }) => {
    try {
        const { filename } = await params;
        if (!filename) {
            return NextResponse.json(
                { error: 'Файл не найден' },
                { status: 400 }
            )
        }
        const fileExt = path.extname(filename).toLowerCase();
        const contentType = getMimeTypeFromExtension(fileExt);
        if (!contentType) {
            return NextResponse.json({ error: 'Неверный формат файла' }, { status: 400 });
        }

        const filepath = path.join(process.cwd(), UPLOAD_DIR, filename);

        try {
            await fs.access(filepath);
        } catch (err) {
            console.error(err);
            return NextResponse.json({ error: 'Файл не найден' }, { status: 404 });
        }

        const stats = await fs.stat(filepath);
        if (stats.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'Размер файла превышает допустимый размер' }, { status: 400 });
        }

        const file = await fs.readFile(filepath);

        const disposition = canShowInBrowser(fileExt) ? 'inline' : 'attachment';

        return new NextResponse(file, {
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `${disposition}; filename="${encodeURIComponent(filename)}"`,
                "Cache-Control": "public, max-age=31536000, immutable",
                "Content-Securite-Policy": "default-src 'self'",
                "X-Content-Type-Options": "nosniff",
                "Content-Length": stats.size.toString(),
                "Accept-Ranges": "bytes",
            }
        })

    } catch (err) {
        console.error(err);
        return NextResponse.json({
            error: 'Возникла ошибка сервера',
        }, {
            status: 500
        });
    }
};

export { GET };