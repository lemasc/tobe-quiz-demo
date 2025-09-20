"use client";

import "../editor-config";

import { useFieldArray } from "react-hook-form";
import QuizSectionComponent from "./components/QuizSection";
import { UseQuizFormHook } from "../demo-only/hooks/useQuizForm";
import { Button } from "@/components/ui/button";
import { v4 as uuid } from "uuid";

export function QuizEditorView({ form }: { form: UseQuizFormHook }) {
  const { isDirty } = form.formState;
  const { fields, append } = useFieldArray({
    control: form.control,
    name: `sections`,
  });

  return (
    <>
      <form className="space-y-6">
        {fields.map((field, index: number) => {
          return (
            <div key={field.id}>
              <QuizSectionComponent
                fieldName={`sections.${index}`}
                index={index}
              />
            </div>
          );
        })}
      </form>
      <div className="py-6">
        <Button
          size="lg"
          onClick={() => {
            const lastDisplayIndex =
              form.getValues("sections").at(-1)?.displayIndex || -1;
            append({
              id: uuid(),
              allowShuffle: false,
              content: null,
              displayIndex: lastDisplayIndex + 1,
              items: [],
              title: "",
              totalScore: 0,
              parentId: null,
            });
          }}
        >
          Add Section
        </Button>
      </div>
      <div className="flex justify-end">
        <div className="grid grid-cols-2 sm:flex items-center justify-end gap-4">
          <Button
            disabled={!isDirty}
            size="lg"
            className="disabled:bg-tobe-red disabled:cursor-not-allowed bg-red-700 text-white"
            onClick={() => {
              if (confirm("Discard all current changes?")) {
                // setAnswers({});
                // setSubmitStatus("idle");
                window.scrollTo(0, 0);
                form.reset(undefined, {
                  keepDefaultValues: true,
                  keepDirty: false,
                  keepDirtyValues: false,
                });
              }
            }}
          >
            Discard changes
          </Button>
        </div>
      </div>
    </>
  );
}
