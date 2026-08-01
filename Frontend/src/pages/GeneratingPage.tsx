import { useParams } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";
import { GeneratingView } from "@/components/assignment/generating-view";

export default function GeneratingPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <AppShell>
      <GeneratingView assignmentId={id!} />
    </AppShell>
  );
}
