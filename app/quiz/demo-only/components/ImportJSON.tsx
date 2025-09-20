"use client";

import { useRef } from "react";
import { QuizSection } from "../../types/full";

export default function ImportJSONButton({
  onSuccess,
}: {
  onSuccess: (data: QuizSection[]) => void;
}) {
  const importFileRef = useRef<HTMLInputElement | null>(null);
  const readJSONFile = (file?: File) => {
    return new Promise<any>((resolve, reject) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          try {
            const json = JSON.parse(text);
            resolve(json);
          } catch (e) {
            reject("Invalid JSON format");
          }
        };
        reader.readAsText(file);
      } else {
        reject("No file selected");
      }
    });
  };
  return (
    <>
      <input
        ref={importFileRef}
        type="file"
        className="hidden"
        accept=".json"
        onChange={(e) => {
          readJSONFile(e.target.files?.[0]).then((json) => {
            onSuccess(json);
          });
        }}
      />
      <button
        onClick={() => importFileRef.current?.click()}
        className="bg-blue-500 text-sm px-4 py-2 rounded-sm text-white font-medium hover:bg-blue-600 transition-colors"
      >
        Import from JSON
      </button>
    </>
  );
}
