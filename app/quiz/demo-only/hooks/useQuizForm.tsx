import { useForm } from "react-hook-form";
import { QuizSection } from "../../types/full";

export const useQuizForm = () => {
  return useForm({
    defaultValues: {
      sections: [] as QuizSection[],
    },
  });
};

export type UseQuizFormHook = ReturnType<typeof useQuizForm>;
