import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { cookies } from "next/headers";
import {
  getCollaboratingWorkspaces,
  getFolders,
  getPrivateWorkspaces,
  getSharedWorkspaces,
  getUserSubscriptionStatus,
} from "@/lib/supabase/queries";
import { twMerge } from "tailwind-merge";
import WorkspaceDropdown from "./WorkspaceDropdown";
import PlanUsage from "./PlanUsage";
import NativeNavigation from "./NativeNavigation";
import { ScrollArea } from "../ui/scroll-area";
import FoldersDropdownList from "./FoldersDropdown";
import UserCard from "./Usercard";
import { Folder } from "@/lib/supabase/types";
import ModeToggle from "../global/ModeToggle";

interface SidebarProps {
  params: { workspaceId: string };
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = async ({ params, className }) => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: subscriptionData, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  const {
    data: foldersData,
    error: foldersError,
  }: { data: Folder[] | null; error: any } = await getFolders(
    params.workspaceId
  );

  if (subscriptionError || foldersError || !subscriptionData || !foldersData) {
    console.error("Error fetching data", { subscriptionError, foldersError });
    // return null;
  }

  const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] =
    await Promise.all([
      getPrivateWorkspaces(user.id),
      getCollaboratingWorkspaces(user.id),
      getSharedWorkspaces(user.id),
    ]);

  return (
    <aside
      className={twMerge(
        "hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between",
        className
      )}
    >
      <div>
        <WorkspaceDropdown
          privateWorkspaces={privateWorkspaces}
          sharedWorkspaces={sharedWorkspaces}
          collaboratingWorkspaces={collaboratingWorkspaces}
          defaultValue={[
            ...privateWorkspaces,
            ...collaboratingWorkspaces,
            ...sharedWorkspaces,
          ].find((workspace) => workspace.id === params.workspaceId)}
        />
        <PlanUsage
          foldersLength={foldersData ? foldersData.length : 0}
          subscription={subscriptionData}
        />
        <NativeNavigation myWorkspaceId={params.workspaceId} />
        <ScrollArea
          className="relative
        h-[250px]
      "
        >
          <div
            className="pointer-events-none 
        w-full 
        absolute 
        bottom-0 
        h-20 
        bg-gradient-to-t 
        from-background 
        to-transparent 
        z-40"
          />
          <FoldersDropdownList
            workspaceFolders={foldersData ? foldersData : []}
            workspaceId={params.workspaceId}
          />
        </ScrollArea>
      </div>
      <UserCard subscription={subscriptionData} />
    </aside>
  );
};

export default Sidebar;
