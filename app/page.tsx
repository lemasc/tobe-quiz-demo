"use client";

import { QuizEditorView } from "./quiz/edit/QuizEditorView";
import { useQuizForm } from "./quiz/demo-only/hooks/useQuizForm";
import { FormProvider } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ImportJSONButton from "./quiz/demo-only/components/ImportJSON";
import { useState } from "react";
import { QuizView } from "./quiz/view/QuizView";
import SaveJSONButton from "./quiz/demo-only/components/SaveJSON";

export default function DemoIndexPage() {
  const form = useQuizForm();
  const [showPreview, setShowPreview] = useState(false);
  return (
    <div className="min-h-screen h-full">
      <div className="sticky top-0 w-full min-h-14 shadow-md flex items-center px-6 py-4 gap-4 bg-white z-30">
        <div className="font-bold flex-grow text-lg">Quiz Demo</div>
        <div className="flex items-center gap-4 flex-wrap justify-end">
          <ImportJSONButton
            onSuccess={(data) => {
              form.reset(
                {
                  sections: data,
                },
                {
                  keepDefaultValues: true,
                  keepDirty: false,
                  keepDirtyValues: false,
                }
              );
            }}
          />
          <SaveJSONButton form={form} />
          <div className="flex items-center space-x-2">
            <Switch
              checked={showPreview}
              onCheckedChange={(v) => setShowPreview(v)}
              id="show-preview"
            />
            <Label htmlFor="show-preview" className="font-normal">
              Show Quiz Preview
            </Label>
          </div>
        </div>
      </div>
      <FormProvider {...form}>
        <div className="bg-neutral-100 min-h-screen h-full p-8 md:p-10 flex flex-col items-center">
          <div className="w-full max-w-7xl flex flex-col">
            {showPreview ? (
              <QuizView form={form} />
            ) : (
              <QuizEditorView form={form} />
            )}
          </div>
        </div>
      </FormProvider>
    </div>
  );
}
