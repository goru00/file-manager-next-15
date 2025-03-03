import { ListFiles } from "./components/ListFiles";
import UploadFile from "./components/UploadFile";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a1b26]">
      <div className="max-w-6xl mx-auto p-6">
        <UploadFile />
        <ListFiles />
      </div>
    </div>
  );
}
