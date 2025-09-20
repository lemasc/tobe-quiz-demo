import { QuizItem, QuizSection } from "../types/full";

export const gradeQuizSubmission = ({
  quizSections,
  submission,
}: {
  quizSections: QuizSection[];
  submission: Record<string, string>;
}) => {
  let score = 0;
  const corrected: Record<string, QuizItem | boolean> = {};
  const incorrected: Record<
    string,
    | (QuizItem & {
        answered: QuizItem["choices"][number] | string | null;
      })
    | boolean
  > = {};
  let total = 0;
  for (const section of quizSections) {
    if (section.items.length > 0) {
      let currentScore = 0;
      for (const { id: itemId, ...item } of section.items) {
        for (const choice of item.choices) {
          if (!choice.isCorrect) continue;
          const value =
            choice.type === "choice" ? choice.id : choice.content.trim();
          if (submission[itemId] === value) {
            // if (DEBUG) {
            //   corrected[itemId] = {
            //     ...item,
            //     choices: [choice],
            //   };
            // } else {
            corrected[itemId] = true;
            // }
            currentScore += 1;
            break;
          }
        }
        // if (!corrected[itemId] && DEBUG) {
        //   incorrected[itemId] = {
        //     ...item,
        //     answered:
        //       item.choices.find((choice) => {
        //         const value =
        //           choice.type === "choice" ? choice.id : choice.content.trim();
        //         return submission[itemId] === value;
        //       }) ?? submission[itemId],
        //   };
        // }
      }
      score += (currentScore / section.items.length) * section.totalScore;
    }
    total += section.totalScore;
  }
  score = parseFloat(score.toFixed(2));
  return { score, total, corrected, incorrected };
};
