"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  UploadCloud,
  X,
  Star,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function ImageUploader({
  images,
  coverImage,
  onChange,
}: {
  images: string[];
  coverImage: string | null;
  onChange: (images: string[], coverImage: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  async function upload(files: FileList | File[]) {
    const arr = Array.from(files);
    if (arr.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      arr.forEach((f) => fd.append("files", f));
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yükleme başarısız.");
      const next = [...images, ...data.urls];
      onChange(next, coverImage || next[0] || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yükleme başarısız.");
    } finally {
      setUploading(false);
    }
  }

  function remove(url: string) {
    const next = images.filter((i) => i !== url);
    const nextCover = coverImage === url ? next[0] || null : coverImage;
    onChange(next, nextCover);
  }

  function move(index: number, dir: number) {
    const next = [...images];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next, coverImage);
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          upload(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragOver ? "border-ink bg-sand" : "border-line bg-paper hover:bg-sand"
        }`}
      >
        {uploading ? (
          <Loader2 className="animate-spin text-accent" size={26} />
        ) : (
          <UploadCloud className="text-accent" size={26} />
        )}
        <p className="text-sm text-ink">
          {uploading ? "Yükleniyor..." : "Fotoğraf sürükleyin veya seçmek için tıklayın"}
        </p>
        <p className="text-xs text-muted">JPG, PNG, WEBP · en fazla 8 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          hidden
          onChange={(e) => e.target.files && upload(e.target.files)}
        />
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {images.length > 0 && (
        <>
          <p className="mt-4 text-xs text-muted">
            {images.length} fotoğraf · İlk sıradaki ya da yıldızladığınız fotoğraf
            kapak olur.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((url, i) => {
              const isCover = (coverImage || images[0]) === url;
              return (
                <div
                  key={url}
                  className={`group relative aspect-[4/3] overflow-hidden rounded-sm border ${
                    isCover ? "border-accent ring-1 ring-accent" : "border-line"
                  }`}
                >
                  <Image src={url} alt="" fill sizes="200px" className="object-cover" />
                  {isCover && (
                    <span className="absolute left-1.5 top-1.5 rounded-sm bg-accent px-1.5 py-0.5 text-[0.6rem] font-medium uppercase text-ink">
                      Kapak
                    </span>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center gap-1 bg-ink/45 opacity-0 transition-opacity group-hover:opacity-100">
                    <MiniBtn title="Sola al" onClick={() => move(i, -1)}>
                      <ArrowLeft size={15} />
                    </MiniBtn>
                    <MiniBtn title="Kapak yap" onClick={() => onChange(images, url)}>
                      <Star size={15} className={isCover ? "fill-current" : ""} />
                    </MiniBtn>
                    <MiniBtn title="Sağa al" onClick={() => move(i, 1)}>
                      <ArrowRight size={15} />
                    </MiniBtn>
                    <MiniBtn title="Kaldır" danger onClick={() => remove(url)}>
                      <X size={15} />
                    </MiniBtn>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function MiniBtn({
  children,
  title,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-full bg-paper text-ink transition-colors ${
        danger ? "hover:bg-red-600 hover:text-paper" : "hover:bg-accent hover:text-paper"
      }`}
    >
      {children}
    </button>
  );
}
