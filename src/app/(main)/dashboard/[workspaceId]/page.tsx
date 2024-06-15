import QuillEditor from "@/components/quilleditor/QuillEditor";
import { getWorkspaceDetails } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import React from "react";

interface WorkspacePageProps {
  params: { workspaceId: string };
}

const WorkspacePage: React.FC<WorkspacePageProps> = async ({ params }) => {
  const { data, error } = await getWorkspaceDetails(params.workspaceId);
  if (error || !data.length) redirect("/dashboard");
  return (
    <div className="relative">
      <QuillEditor
        dirType="workspace"
        fileId={params.workspaceId}
        dirDetails={data[0] || {}}
      />
    </div>
  );
};
export default WorkspacePage;
