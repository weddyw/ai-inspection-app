"use client";

import { useRef, useState } from "react";
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
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const countOk = photos.length >= MIN;

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          void addFiles(e.dataTransfer.files);
        }}
        className={`rounded-xl border-2 border-dashed px-4 py-8 text-center transition sm:py-10 ${
          isDragging
            ? "border-indigo-500 bg-indigo-50"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        <p className="text-sm font-medium text-slate-800">Drag and drop photos here</p>
        <p className="mt-1 text-xs text-slate-500">{MIN}–{MAX} photos · JPG or PNG</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          className="flex min-h-[48px] items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-800 active:bg-indigo-100"
        >
          Take photos
        </button>
        <button
          type="button"
          onClick={() => galleryRef.current?.click()}
          className="flex min-h-[48px] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 active:bg-slate-50"
        >
          Choose from library
        </button>
      </div>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={(e) => {
          void addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          void addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <p className={`text-sm ${countOk ? "font-medium text-emerald-700" : "text-slate-600"}`}>
        {photos.length} / {MAX} photos
        {photos.length < MIN ? ` — add at least ${MIN - photos.length} more` : " — ready to continue"}
      </p>

      {photos.length > 0 ? (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((p, i) => (
            <li
              key={p.id}
              className="relative overflow-hidden rounded-lg border border-slate-200 bg-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.dataUrl}
                alt={`Inspection photo ${i + 1}`}
                className="aspect-square w-full object-cover"
              />
              <span className="absolute left-1 top-1 rounded bg-indigo-600 px-2 py-0.5 text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(p.id)}
                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-red-600 shadow"
                aria-label={`Remove photo ${i + 1}`}
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
