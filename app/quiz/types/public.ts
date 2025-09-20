export type QuizSection = {
  id: string;
  title: string | null;
  parentId: string | null;
  items: {
    id: string;
    content: string;
    choices: {
      id: string;
      type: "choice" | "short-answer";
      content: string;
    }[];
    displayIndex: number;
  }[];
  totalScore: number;
};

export type QuizItem = QuizSection["items"][number];
export type QuizChoice = QuizItem["choices"][number];
