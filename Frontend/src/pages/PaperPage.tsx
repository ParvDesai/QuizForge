import { useParams } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";
import { PaperView } from "@/components/paper/paper-view";

export default function PaperPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <AppShell>
      <PaperView assignmentId={id!} />
    </AppShell>
  );
}
