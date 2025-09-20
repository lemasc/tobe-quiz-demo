"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { MdEditor } from "md-editor-rt";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircleIcon, TrashIcon } from "lucide-react";
import { QuizChoice, QuizItem } from "../../types/full";
import { v4 as uuid } from "uuid";
import { Button } from "@/components/ui/button";
import { startTransition, useEffect, useState } from "react";

export default function QuizSectionComponent({
  fieldName,
  index,
}: {
  fieldName: string;
  index: number;
}) {
  const { control, register, getValues, setValue } = useFormContext();

  const itemsFieldName = `${fieldName}.items` as const;
  const { fields, append, remove } = useFieldArray({
    control,
    name: itemsFieldName,
  });

  const add = () => {
    const newItem: QuizItem = {
      id: uuid(),
      content: "",
      choices: [],
      displayIndex: fields.length,
    };
    append(newItem);
  };

  if (getValues(`${fieldName}.displayIndex`) !== index) {
    setValue(`${fieldName}.displayIndex`, index);
  }

  return (
    <section className="p-8 bg-white shadow-sm rounded-lg flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row">
        <div className="space-y-2 flex items-start flex-col flex-grow">
          <span className="text-tobe-yellow uppercase">Section {index}</span>
          <input
            className="w-full max-w-[500px] text-3xl font-bold bg-neutral-50 border border-input px-4 py-4 rounded-lg"
            {...register(`${fieldName}.title`)}
          />
        </div>
        <div className="flex flex-col gap-2 items-center">
          <span className="font-medium">คะแนนทั้งหมด</span>
          <input
            type="number"
            className="bg-tobe-yellow font-medium px-4 py-2 rounded-lg bg-neutral-50 border border-input text-center"
            {...register(`${fieldName}.totalScore`, {
              valueAsNumber: true,
            })}
          />
        </div>
      </div>
      <Controller
        control={control}
        name={`${fieldName}.content`}
        render={({ field }) => (
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`section-content-${index}`}
                checked={typeof field.value === "string"}
                className="dark:data-[state=checked]:bg-red-400 dark:data-[state=checked]:text-black"
                onCheckedChange={(value) => {
                  if (value === false) {
                    if (field.value.trim() !== "") {
                      alert("Must remove content before unchecking this box");
                      return;
                    }
                    field.onChange(null);
                  } else {
                    field.onChange("");
                  }
                }}
              />
              <label
                htmlFor={`section-content-${index}`}
                className={`${
                  field.value ? "text-red-400" : "text-black"
                } font-bold`}
              >
                Has Section Content
              </label>
            </div>
            {typeof field.value === "string" && (
              <MdEditor
                modelValue={field.value}
                editorId={`section-content-${index}`}
                onChange={field.onChange}
                language="en-US"
                noMermaid
                noImgZoomIn
              />
            )}
          </div>
        )}
      />
      <Accordion type="multiple" className="flex flex-col pl-3">
        {fields.map((item, idx) => {
          return (
            <AccordionItem key={item.id} value={item.id} asChild>
              <QuizItemComponent
                index={idx}
                onRemove={remove}
                fieldName={`${itemsFieldName}.${idx}`}
              />
            </AccordionItem>
          );
        })}
        <button
          type="button"
          onClick={add}
          className="flex flex-row pl-6 py-6 pb-4 group/choice border-l-4 transition-colors hover:border-blue-400 hover:text-blue-400"
        >
          <PlusCircleIcon className="w-6 h-6 mr-4 mt-0.5" />
          <div className="text-xl font-bold text-left">Add New Item</div>
        </button>
      </Accordion>
    </section>
  );
}

const trimForPreview = (content?: string) => {
  if (!content) return "";
  return content.slice(0, 100);
};

function QuizItemComponent({
  index,
  onRemove,
  fieldName,
}: {
  index: number;
  onRemove: (index: number) => void;
  fieldName: string;
}) {
  const { control, getValues, watch, setValue } = useFormContext();
  const id = watch(`${fieldName}.id`) as string;

  const choiceFieldName = `${fieldName}.choices`;

  const { fields, append, remove } = useFieldArray({
    control,
    name: choiceFieldName,
  });

  const [previewContent, setPreviewContent] = useState<string>(() => {
    return trimForPreview(getValues(`${fieldName}.content`) as string);
  });

  const add = () => {
    const newChoice: QuizChoice = {
      id: uuid(),
      content: "",
      type: "choice",
      isCorrect: false,
      displayIndex: fields.length,
    };
    append(newChoice);
  };

  if (getValues(`${fieldName}.displayIndex`) !== index + 1) {
    setValue(`${fieldName}.displayIndex`, index + 1);
  }

  return (
    <div className="flex flex-col pl-6 pt-3 pb-3 group/item border-l-4 transition-colors hover:border-blue-400 data-[state=open]:border-blue-400">
      <AccordionTrigger className="pb-4 flex items-center hover:no-underline">
        <div className="flex items-center justify-start gap-8">
          <div className="text-2xl font-bold text-left transition-colors group-data-[state=open]/item:text-blue-300 group-hover/item:text-blue-400 text-black w-[100px]">
            Item {index + 1}
          </div>
          <Button
            type="button"
            variant={"destructive"}
            title={`Delete Item ${index + 1}`}
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Confirm delete item ${index + 1}?`)) {
                onRemove(index);
              }
            }}
            asChild
          >
            <div role="button">
              <TrashIcon className="h-4 w-4" />
            </div>
          </Button>
          <span className="hidden md:block text-black/70 font-normal group-hover/item:text-black transition-colors text-sm text-left truncate max-w-[500px]">
            {previewContent}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <Controller
          control={control}
          name={`${fieldName}.content`}
          render={({ field }) => (
            <MdEditor
              modelValue={field.value}
              editorId={`content-${id}`}
              onChange={(value) => {
                startTransition(() => {
                  setPreviewContent(trimForPreview(value));
                });
                field.onChange(value);
              }}
              language="en-US"
              noMermaid
              noImgZoomIn
            />
          )}
        />
        <div className="pt-6 space-y-4">
          <Accordion type="multiple" className="flex flex-col w-full pl-3">
            {fields.map((choice, idx) => {
              return (
                <AccordionItem key={choice.id} value={choice.id} asChild>
                  <QuizChoiceComponent
                    index={idx}
                    onRemove={remove}
                    fieldName={`${choiceFieldName}.${idx}`}
                  />
                </AccordionItem>
              );
            })}
            <button
              type="button"
              onClick={add}
              className="flex flex-row pl-6 py-6 pb-4 group/choice border-l-4 transition-colors hover:border-red-400 hover:text-red-400"
            >
              <PlusCircleIcon className="w-6 h-6 mr-4 mt-0.5" />
              <div className="text-xl font-bold text-left">Add New Choice</div>
            </button>
          </Accordion>
        </div>
      </AccordionContent>
    </div>
  );
}

function QuizChoiceComponent({
  index,
  onRemove,
  fieldName,
}: {
  index: number;
  onRemove: (index: number) => void;
  fieldName: string;
}) {
  const { control, getValues, setValue, watch } = useFormContext();
  const id = watch(`${fieldName}.id`) as string;

  const [previewContent, setPreviewContent] = useState<string>(() => {
    return trimForPreview(getValues(`${fieldName}.content`) as string);
  });

  if (getValues(`${fieldName}.displayIndex`) !== index) {
    setValue(`${fieldName}.displayIndex`, index);
  }

  return (
    <div className="flex flex-col pl-5 py-1 group/choice border-l-4 transition-colors hover:border-red-400 data-[state=open]:border-red-400">
      <AccordionTrigger className="pb-4 flex items-center hover:no-underline">
        <div className="flex items-center justify-start gap-8">
          <div className="text-lg font-bold text-left transition-colors group-hover/choice:text-red-400 group-data-[state=open]/choice:text-red-300 text-black w-[100px]">
            Choice {index + 1}
          </div>
          <Button
            type="button"
            asChild
            variant={"destructive"}
            title={`Delete Choice ${index + 1}`}
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Confirm delete choice ${index + 1}?`)) {
                onRemove(index);
              }
            }}
          >
            <div role="button">
              <TrashIcon className="h-4 w-4" />
            </div>
          </Button>
          <Controller
            control={control}
            name={`${fieldName}.isCorrect`}
            render={({ field }) => (
              <div
                className="flex items-center space-x-2"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Checkbox
                  id={`choice-isCorrect-${id}`}
                  checked={field.value}
                  className="dark:data-[state=checked]:bg-red-400 dark:data-[state=checked]:text-black"
                  onCheckedChange={field.onChange}
                />
                <label
                  htmlFor={`choice-isCorrect-${id}`}
                  className={`${
                    field.value ? "text-red-400" : "text-black"
                  } font-bold`}
                >
                  Is Correct
                </label>
              </div>
            )}
          />
          <Controller
            control={control}
            name={`${fieldName}.type`}
            render={({ field }) => (
              <div
                className="flex items-center space-x-2 pr-8"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="min-w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"choice"}>Choice</SelectItem>
                    <SelectItem value={"short-answer"}>Short Answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
          <span className="text-black/70 font-normal group-hover/choice:text-black transition-colors text-sm text-left truncate max-w-[500px]">
            {previewContent}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <Controller
          control={control}
          name={`${fieldName}.content`}
          render={({ field }) => (
            <MdEditor
              modelValue={field.value}
              onChange={(value) => {
                startTransition(() => {
                  setPreviewContent(trimForPreview(value));
                });
                field.onChange(value);
              }}
              editorId={`choice-content-${id}`}
              noMermaid
              language="en-US"
            />
          )}
        />
      </AccordionContent>
    </div>
  );
}
