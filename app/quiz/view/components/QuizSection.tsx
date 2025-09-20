import type {
  QuizItem as QuizItemType,
  QuizSection as QuizSectionType,
} from "../../types/public";
import { MdPreview } from "md-editor-rt";
import { cn } from "@/lib/utils";

export default function QuizSectionComponent({
  quizSection,
  answers,
  onAnswerChange,
  isAnswerMode,
}: {
  quizSection: QuizSectionType;
  answers: Record<string, string>;
  onAnswerChange: (answer: { id: string; answer: string | null }) => void;
  isAnswerMode: boolean;
}) {
  return (
    <section className="p-6 bg-white flex flex-col space-y-4 rounded-lg">
      <h2 className="text-3xl font-bold text-tobe-yellow">
        {quizSection.title} ({quizSection.totalScore} คะแนน)
      </h2>
      <div className="space-y-2 flex flex-col">
        {quizSection.items.map((item) => {
          return (
            <div key={item.id} className="flex flex-col">
              <div className="flex flex-row text-lg gap-4">
                <div className="font-bold">{item.displayIndex}.</div>
                <div className={`w-full`}>
                  <MdPreview
                    className={"quizMarkdown"}
                    modelValue={item.content}
                    language="en-US"
                  />
                </div>
              </div>
              {item.choices.length > 0 &&
              item.choices.every((choice) => choice.type === "choice") ? (
                <QuizInputChoice
                  item={item}
                  answer={answers[item.id]}
                  onAnswerChange={(answer) =>
                    onAnswerChange({
                      id: item.id,
                      answer,
                    })
                  }
                  isAnswerMode={isAnswerMode}
                />
              ) : (
                <QuizInputText
                  item={item}
                  answer={answers[item.id]}
                  onAnswerChange={(answer) =>
                    onAnswerChange({
                      id: item.id,
                      answer,
                    })
                  }
                  isAnswerMode={isAnswerMode}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

const IMAGE_MARKDOWN_REGEX = /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/;

function QuizInputChoice({
  item,
  answer,
  onAnswerChange,
  isAnswerMode,
}: {
  item: QuizItemType;
  answer: string;
  onAnswerChange: (answer: string) => void;
  isAnswerMode: boolean;
}) {
  const { choices } = item;
  const choiceHasImage = choices.some((choice) =>
    IMAGE_MARKDOWN_REGEX.test(choice.content)
  );
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:gap-5 pl-6 py-6 w-full max-w-4xl",
        choiceHasImage && "sm:grid grid-cols-2"
      )}
    >
      {choices.map((choice) => {
        return (
          <button
            onClick={() => {
              if (isAnswerMode) return;
              onAnswerChange(choice.id);
            }}
            key={choice.id}
            className={cn(
              "w-full h-fit items-center flex gap-2 transition-colors",
              answer == choice.id
                ? " bg-neutral-300/40"
                : "bg-neutral-300/20 focus:bg-neutral-300/30 hover:bg-neutral-300/30",
              !isAnswerMode && "focus:ring-2 focus:ring-tobe-yellow",
              answer == choice.id &&
                `ring-2 ${isAnswerMode ? "ring-red-500" : "ring-tobe-yellow"}`,
              "p-3 rounded-md space-x-2 focus:outline-none"
            )}
          >
            <div className="bg-neutral-300/30 p-1 rounded-full">
              <div
                className={cn(
                  answer == choice.id ? "bg-blue-500" : "bg-transparent",
                  "p-1 rounded-full"
                )}
              />
            </div>
            <div
              className={cn(
                "w-full max-w-[calc(100%_-_45px)]",
                !choiceHasImage && "text-left"
              )}
            >
              {choice && (
                <div key={choice.id} className="">
                  <MdPreview
                    className={`quizMarkdown quizChoices`}
                    modelValue={choice.content}
                    noImgZoomIn
                    language="en-US"
                  />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function QuizInputText({
  // item,
  answer,
  onAnswerChange,
  isAnswerMode,
}: {
  item: QuizItemType;
  answer: string;
  onAnswerChange: (answer: string | null) => void;
  isAnswerMode: boolean;
}) {
  return (
    <div className="py-4 pl-9 w-full">
      <input
        value={answer ?? ""}
        onChange={(e) => {
          if (isAnswerMode) return;
          const value = e.target.value.trim();
          if (!value) {
            onAnswerChange(null);
          } else {
            onAnswerChange(e.target.value);
          }
        }}
        readOnly={isAnswerMode}
        className={cn(
          "items-center flex gap-2 w-full sm:max-w-[400px]",
          answer
            ? `bg-neutral-300/40 ring-2 ${
                isAnswerMode ? "ring-red-500" : "ring-tobe-yellow"
              }`
            : "bg-neutral-300/20 focus:bg-neutral-300/30 hover:bg-neutral-300/30",
          !isAnswerMode &&
            "transition-colors focus:ring-2 focus:ring-tobe-yellow",
          "p-3 rounded-md focus:outline-none"
        )}
        placeholder="กรุณาตอบ"
      />
    </div>
  );
}
