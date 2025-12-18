import EmailResult from "./results/EmailResult";
import AnalysisResult from "./results/AnalysisResult";
import GenericResult from "./results/GenericResult";

export default function TaskResult({ task }) {
  if (!task?.result_summary) return null;

  switch (task.task_type) {
    case "email":
      return <EmailResult content={task.result_summary} />;

    case "analysis":
      return <AnalysisResult content={task.result_summary} />;

    default:
      return <GenericResult content={task.result_summary} />;
  }
}
