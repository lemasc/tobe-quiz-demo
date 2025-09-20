import { UseQuizFormHook } from "../hooks/useQuizForm";

export default function SaveJSONButton({ form }: { form: UseQuizFormHook }) {
  const saveJSON = () => {
    const formValues = form.getValues("sections");
    const content = JSON.stringify(formValues, null, 4);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button
      onClick={() => saveJSON()}
      className="bg-green-500 text-sm px-4 py-2 rounded-sm text-white font-medium hover:bg-green-600 transition-colors"
    >
      Save to JSON
    </button>
  );
}
