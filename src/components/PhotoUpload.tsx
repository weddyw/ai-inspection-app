"use client";

import { useRef } from "react";
import type { UploadedPhoto } from "@/lib/types";

const MIN = 5;
const MAX = 20;

type Props = {
  photos: UploadedPhoto[];
  onChange: (photos: UploadedPhoto[]) => void;
};

function readFile(file: File): Promise<UploadedPhoto> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        fileName: file.name,
        dataUrl: reader.result as string,
        file,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PhotoUpload({ photos, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const incoming = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    const merged = [...photos];
    for (const file of incoming) {
      if (merged.length >= MAX) break;
      const item = await readFile(file);
      if (!merged.some((p) => p.id === item.id)) merged.push(item);
    }
    onChange(merged.slice(0, MAX));
  }

  function remove(id: string) {
    onChange(photos.filter((p) => p.id !== id));
  }

  const countOk = photos.length >= MIN && photos.length <= MAX;

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center hover:border-indigo-300 hover:bg-indigo-50/50"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            void addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <p className="text-sm font-medium text-slate-800">Drop photos here or click to browse</p>
        <p className="mt-1 text-xs text-slate-500">
          {MIN}–{MAX} photos required · JPG or PNG
        </p>
      </div>

      <p
        className={`mt-3 text-sm ${countOk ? "text-emerald-700" : "text-slate-600"}`}
      >
        {photos.length} / {MAX} photos
        {photos.length < MIN ? ` — add ${MIN - photos.length} more` : ""}
      </p>

      {photos.length > 0 ? (
        <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {photos.map((p, i) => (
            <li key={p.id} className="relative overflow-hidden rounded-lg border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.dataUrl} alt="" className="aspect-square w-full object-cover" />
              <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 text-[10px] font-medium text-white">
                {i + 1}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(p.id);
                }}
                className="absolute right-1 top-1 rounded bg-white/90 px-1 text-xs text-red-700"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
