"use server";
import { z } from "zod";
import { FormSchema } from "../types";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function loginUserAction({
  email,
  password,
}: z.infer<typeof FormSchema>) {
  const supabase = createRouteHandlerClient({ cookies });
  const response = await supabase.auth.signInWithPassword({ email, password });
  return response;
}

export async function signUpUserAction({
  email,
  password,
}: z.infer<typeof FormSchema>) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email);
  if (data?.length) return { error: "Email already exists", data };
  const response = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}api/auth/callback`,
    },
  });
  return response;
}
