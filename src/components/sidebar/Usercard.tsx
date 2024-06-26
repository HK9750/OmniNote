import React from "react";
import { Subscription } from "@/lib/supabase/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import db from "@/lib/supabase/db";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CypressProfileIcon from "../icons/OmniNoteProfileIcon";
import ModeToggle from "../global/ModeToggle";
import { LogOut } from "lucide-react";
import LogoutButton from "../global/LogoutButton";

interface UserCardProps {
  subscription: Subscription | null;
}

const UserCard: React.FC<UserCardProps> = async ({ subscription }) => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;
  const response = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, user.id),
  });
  let avatarPath;
  if (!response) return;
  if (!response.avatarUrl) avatarPath = "";
  else {
    avatarPath = supabase.storage
      .from("avatars")
      .getPublicUrl(response.avatarUrl)?.data.publicUrl;
  }
  const profile = {
    ...response,
    avatarUrl: avatarPath,
  };

  return (
    <article className="hidden sm:flex justify-between items-center px-4 py-2 dark:bg-Neutrals/neutrals-12 rounded-3xl">
      <aside className="flex flex-col justify-between items-center gap-2">
        <div className="flex justify-center items-center gap-2">
          <Avatar>
            <AvatarImage src={profile.avatarUrl} />
            <AvatarFallback>
              <CypressProfileIcon />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-muted-foreground">
              {subscription?.status === "active" ? "Pro Plan" : "Free Plan"}
            </span>
            <small className="overflow-hidden overflow-ellipsis">
              {profile.email}
            </small>
          </div>
        </div>
        <div className="flex items-center mt-2">
          <LogoutButton>
            <LogOut />
          </LogoutButton>
          <ModeToggle />
        </div>
      </aside>
    </article>
  );
};

export default UserCard;
