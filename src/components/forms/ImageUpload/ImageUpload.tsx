import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void;
  multiple?: boolean;
  eventData?: {
    // Добавляем eventData в интерфейс пропсов
    title?: string;
    date?: string;
    location?: string;
  };
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  multiple = false,
  eventData, // Деструктуризируем eventData из props
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setIsUploading(true);

      try {
        for (const file of acceptedFiles) {
          const formData = new FormData();
          formData.append("image", file);

          // Добавляем данные о событии, если они есть
          if (eventData) {
            formData.append("eventTitle", eventData.title || "");
            formData.append("eventLocation", eventData.location || "");
            formData.append("eventDate", eventData.date || "");
          }

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          const responseData = await response.json();

          if (!response.ok) {
            console.error("Server response:", responseData);
            throw new Error(
              responseData.error ||
                `Upload failed with status ${response.status}`
            );
          }

          onUpload(responseData.imageUrl);
        }
      } catch (err) {
        console.error("Upload error details:", err);
        alert(
          `Ошибка загрузки изображения: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload, eventData]
  ); // Добавляем eventData в зависимости

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
    multiple,
    disabled: isUploading,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive
          ? "border-camouflage-500 bg-camouflage-50"
          : "border-gray-300 hover:border-camouflage-400"
      } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-camouflage-500 mb-2"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      ) : isDragActive ? (
        <div className="flex flex-col items-center">
          <svg
            className="w-12 h-12 text-camouflage-500 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-camouflage-700">
            Отпустите чтобы загрузить изображение
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <svg
            className="w-12 h-12 text-gray-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-600">
            Перетащите изображение сюда или кликните для выбора
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Поддерживаемые форматы: JPG, PNG, GIF, WEBP
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
