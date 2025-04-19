"use client";
import React from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormInput from "./FormInput";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import { SignIn, SignUp } from "@/lib/actions/auth.action";

const authFormSchema = (type: FormType) => {
  return z.object({
    name:
      type === "sign-up" ? z.string().min(3).max(50) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type as FormType);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log(data);
      if (type === "sign-up") {
        const { email, name, password } = data;
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const result = await SignUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });
        if (!result?.success) return toast.error(result?.message);
        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const idToken = await userCredentials.user.getIdToken();
        if (!idToken)
          return toast.error("Failed to sign in.");

        await SignIn({ email, idToken });
        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.error(`error`, error);
      toast.error(`There was an error: ${error}`);
    }
  };
  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src={"/logo.svg"} width={38} height={32} alt="logo" />
          <h2>Mock Ai Interview</h2>
        </div>
        <h3>Practice job interviews with AI</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full mt-4 form "
          >
            {!isSignIn && (
              <FormInput
                control={form.control}
                name="name"
                label="Name"
                placeholder="John"
              />
            )}
            <FormInput
              control={form.control}
              name="email"
              label="Email"
              placeholder="johnboe@gmail.com"
            />
            <FormInput
              control={form.control}
              name="password"
              label="Password"
              placeholder="*******"
            />
            <Button className="btn" type="submit">
              {isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>
        <p>
          {isSignIn ? "Don't have an account?" : "Have an account already"}{" "}
          <Link
            href={`/${isSignIn ? "sign-up" : "sign-in"}`}
            className="text-blue-500 hover:underline"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
