import Sidebar from "@/components/sidebar/Sidebar";
import React from "react";
import MobileSidebar from "@/components/sidebar/MobileSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WorkSpaceLayoutProps {
  children: React.ReactNode;
  params: any;
}

const WorkSpaceLayout: React.FC<WorkSpaceLayoutProps> = ({
  children,
  params,
}) => {
  return (
    <main className="flex overflow-hidden h-screen w-screen">
      <Sidebar params={params} />
      <MobileSidebar>
        <Sidebar params={params} className="w-screen inline-block sm:hidden" />
      </MobileSidebar>
      <ScrollArea
        className="
        border-l-[1px] dark:border-Neutrals/neutrals-12/70
        w-full
        relative
        overflow-none
      "
      >
        {children}
      </ScrollArea>
    </main>
  );
};
export default WorkSpaceLayout;
