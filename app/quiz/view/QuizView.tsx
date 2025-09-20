"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import "../editor-config";
import QuizSectionComponent from "./components/QuizSection";
import { UseQuizFormHook } from "../demo-only/hooks/useQuizForm";
import { gradeQuizSubmission } from "../demo-only/api";

export function QuizView({ form }: { form: UseQuizFormHook }) {
  const quiz = form.watch("sections");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isInvalid, setIsInvalid] = useState(false);

  const router = useRouter();
  const totalItems = useMemo(
    () =>
      quiz?.reduce((prev, cur) => {
        return prev + cur.items.length;
      }, 0),
    [quiz]
  );

  useEffect(() => {
    if (totalItems !== undefined && totalItems === 0) {
      // data is loaded, but still 0 quiz items
      // if this is in prod, maybe user hack path
    }
  }, [totalItems, router]);

  const submitQuiz = () => {
    const result = gradeQuizSubmission({
      quizSections: quiz,
      submission: answers,
    });
    alert(`You got ${result.score} of ${result.total}`);
    console.log(Date.now(), result);
  };

  return (
    <div className="w-full px-6 pr-8 space-y-6 md:space-y-8">
      <div>
        {quiz &&
          quiz.map((data, index: number) => {
            return (
              <QuizSectionComponent
                key={index}
                quizSection={data}
                answers={answers}
                isAnswerMode={false}
                onAnswerChange={(answer) => {
                  const newAnswers = { ...answers };
                  if (!answer.answer) {
                    delete newAnswers[answer.id];
                  } else {
                    newAnswers[answer.id] = answer.answer;
                  }
                  setAnswers(newAnswers);
                }}
              />
            );
          })}
      </div>
      <div className="flex flex-col items-end text-right space-y-2">
        <div>
          การบ้านชุดนี้สามารถส่งได้ไม่จำกัดจำนวนครั้ง
          <br />
          โดยจะเลือกเอารอบที่ได้คะแนนสูงสุด
        </div>
        {isInvalid && (
          <div className="text-red-500 text-right font-bold text-xl">
            กรุณาตอบให้ครบทุกข้อ
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 sm:flex items-center justify-end gap-4">
        <button
          className="bg-red-500 text-white font-bold px-6 py-3 rounded-md"
          onClick={() => {
            if (confirm("ต้องการรีเซ็ตคำตอบทั้งหมดหรือไม่?")) {
              setAnswers({});
              setIsInvalid(false);
              window.scrollTo(0, 0);
            }
          }}
        >
          รีเซ็ตคำตอบ
        </button>
        <button
          className="bg-green-500 text-white font-bold px-6 py-3 rounded-md"
          onClick={() => {
            if (Object.keys(answers).length !== totalItems) {
              setIsInvalid(true);
              return;
            }
            if (confirm("ต้องการส่งคำตอบหรือไม่?")) {
              setIsInvalid(false);
              submitQuiz();
            }
          }}
        >
          ส่งคำตอบ
        </button>
      </div>
    </div>
  );
}
