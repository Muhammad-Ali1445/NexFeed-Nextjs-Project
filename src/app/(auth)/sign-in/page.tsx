"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/app/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/app/schemas/signInSchema";
import { signIn } from "next-auth/react";

const SignInPage = () => {
  const router = useRouter();

  // zod implementaton
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      toast.error("Login Failed! Error while signing-in",{style:{backgroundColor:"#FF0000" ,color: "white"}});
    }
    result?.url && router.replace("/dashboard");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Messsage
          </h1>
          <p className="mb-4">SignUp to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="username..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">SignIn</Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="">
            Not have account?&nbsp;
            <Link
              href={"/sign-in"}
              className="text-blue-600 hover:text-blue-800"
            >
              Sign-Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
