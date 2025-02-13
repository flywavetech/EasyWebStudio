import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from "@/lib/utils";
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageDropzoneProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
  multiple?: boolean;
}

export function ImageDropzone({ value, onChange, className, multiple = false }: ImageDropzoneProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const formData = new FormData();
    acceptedFiles.forEach(file => {
      formData.append('file', file);
    });

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      onChange(multiple ? data.urls : data.url);
    } catch (error) {
      console.error('Upload error:', error);
    }
  }, [onChange, multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary",
        className
      )}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
        {value ? (
          <>
            <ImageIcon className="h-8 w-8" />
            <p className="text-sm">Image selected</p>
            {!multiple && (
              <img 
                src={value} 
                alt="Preview" 
                className="mt-2 max-h-32 rounded-lg"
              />
            )}
          </>
        ) : (
          <>
            <Upload className="h-8 w-8" />
            <p className="text-sm">
              {isDragActive
                ? "Drop the image here"
                : multiple
                ? "Drag & drop images here, or click to select"
                : "Drag & drop an image here, or click to select"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
