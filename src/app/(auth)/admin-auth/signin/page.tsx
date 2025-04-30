"use client";
import React from "react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SignInSchema, SignInSchemaType } from "@/validation/AuthValidation";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import axios from "axios";
import Swal from "sweetalert2";
import { setCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";

function SignInAdminPage() {
  const router = useRouter();
  //SignIn Form
  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  //Submit Form
  const onSubmit: SubmitHandler<SignInSchemaType> = async (data) => {
    await axios
      .post("https://test-fe.mysellerpintar.com/api/auth/login", data, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      })
      .then((response) => {
        setCookie("token", response.data.token);
        axios
          .get("https://test-fe.mysellerpintar.com/api/auth/profile", {
            headers: {
              Authorization: `Bearer ${response.data.token}`,
            },
          })
          .then((response) => {
            if (response.data.role === "Admin") {
              router.replace("/admin/articles");
            } else {
              Swal.fire(
                "Login Failed!",
                "Only admin can access this page",
                "error"
              );
            }
          });
      })
      .catch((error) => {
        Swal.fire("Login Failed!", error.response.data.error, "error");
      });
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-4 py-8 w-[400px] max-w-sm">
        <Image
          src="/logo/auth_logo.svg"
          alt="Auth Logo"
          height={80}
          width={80}
          className="w-30 mx-auto mb-4"
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Input Username" {...field} />
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
                    <PasswordInput
                      placeholder="Input Password"
                      {...field}
                      className="pr-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="primaryBlueFull" className="w-full">
              Login
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4 text-sm text-gray-500">
          <p>
            Don&apos;t have an account?
            <a href="/admin-auth/signup" className="text-blue-500 underline">
              Register
            </a>{" "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignInAdminPage;
