export type QuizSection = {
  id: string;
  title: string | null;
  displayIndex: number | null;
  totalScore: number;
  parentId: string | null;
  allowShuffle: boolean | null;
  content: string | null;
  items: {
    id: string;
    displayIndex: number;
    content: string;
    choices: {
      id: string;
      type: "choice" | "short-answer";
      displayIndex: number | null;
      content: string;
      isCorrect: boolean;
    }[];
  }[];
};

export type QuizItem = QuizSection["items"][number];
export type QuizChoice = QuizItem["choices"][number];
