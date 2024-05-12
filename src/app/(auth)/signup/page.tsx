"use client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../../public/Logo2.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/global/Loader";
import { signUpUserAction } from "@/lib/server-actions/auth-actions";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MailCheck } from "lucide-react";
import { FormSchema } from "@/lib/types";

const signUpFormSchema = z
  .object({
    email: z.string().describe("Email").email({ message: "Invalid Email" }),
    password: z.string().describe("Password").min(1, "Password is required"),
    confirmPassword: z
      .string()
      .describe("Confirm Password")
      .min(1, "Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignUp = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const searchParams = useSearchParams();

  const codeExchangeError = useMemo(() => {
    if (!searchParams) {
      return "";
    }
    return searchParams.get("error_description");
  }, [searchParams]);

  const confirmationAndErrorStyles = useMemo(
    () =>
      clsx("bg-primary", {
        "bg-red-500/10": codeExchangeError,
        "border-red-500/50": codeExchangeError,
        "text-red-700": codeExchangeError,
      }),
    [codeExchangeError]
  );

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(signUpFormSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async ({ email, password }: z.infer<typeof FormSchema>) => {
    const { error } = await signUpUserAction({ email, password });
    if (error) {
      if (typeof error === "string") {
        setSubmitError(error);
      } else {
        setSubmitError(
          "An error has occurred while signing up. Please try again."
        );
      }
      form.reset();
      return;
    }
    setConfirmation(true);
  };

  return (
    <Form {...form}>
      <form
        onChange={() => {
          if (submitError) setSubmitError("");
        }}
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col"
      >
        <Link href={"/"} className="w-full flex items-center">
          <Image src={Logo} alt="Cypress Logo" width={50} height={30} />
          <span className="font-semibold dark:text-white">OmniNote</span>
        </Link>
        <FormDescription
          className="
        text-foreground/60"
        >
          An all-In-One Collaboration and Productivity Platform
        </FormDescription>
        <FormField
          disabled={isLoading}
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isLoading}
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isLoading}
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {submitError && <FormMessage>{submitError}</FormMessage>}
        <Button
          type="submit"
          className="w-full p-6"
          size="lg"
          disabled={isLoading}
        >
          {!isLoading ? "Sign Up" : <Loader />}
        </Button>
        <span className="self-container">
          Already have an account?{" "}
          <Link href="/login" className="text-primary">
            Login
          </Link>
        </span>
        {(confirmation || codeExchangeError) && (
          <>
            <Alert className={confirmationAndErrorStyles}>
              {!codeExchangeError && <MailCheck className="h-4 w-4" />}
              <AlertTitle>
                {codeExchangeError ? "Invalid Link" : "Check your email."}
              </AlertTitle>
              <AlertDescription>
                {codeExchangeError || "An email confirmation has been sent."}
              </AlertDescription>
            </Alert>
          </>
        )}
      </form>
    </Form>
  );
};
export default SignUp;
