import { readdir } from "node:fs/promises";
import path from "node:path";
import Invitation from "./Invitation";

export const runtime = "nodejs";

// public 전체에서 브라우저 표시가 가능한 이미지들을 읽습니다.
// 정적 빌드 후 사진을 추가했다면 다시 빌드/배포하세요.
async function readPhotos(directory, relative = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const photos = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const next = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      photos.push(...await readPhotos(path.join(directory, entry.name), next));
    } else if (entry.isFile() && /\.(jpe?g|png|webp|gif|avif)$/i.test(entry.name)) {
      photos.push(next);
    }
  }
  return photos;
}

export default async function Page() {
  const photos = await readPhotos(path.join(process.cwd(), "public"));
  photos.sort((a, b) => a.localeCompare(b, "ko", { numeric: true }));
  const urls = photos.map(file => "/" + file.split("/").map(encodeURIComponent).join("/"));
  return <Invitation galleryPhotos={urls} />;
}
