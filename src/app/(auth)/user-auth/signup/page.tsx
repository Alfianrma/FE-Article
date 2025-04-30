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
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { SignUpSchema, SignUpSchemaType } from "@/validation/AuthValidation";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

function SignUpUserPage() {
  const router = useRouter();
  //SignUp Form
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  //Submit Form
  const onSubmit: SubmitHandler<SignUpSchemaType> = async (data) => {
    const payload = {
      username: data.username,
      password: data.password,
      role: "User",
    };
    await axios
      .post("https://test-fe.mysellerpintar.com/api/auth/register", payload, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      })
      .then((response) => {
        Swal.fire(
          "Register Success!",
          "You can now login to continue",
          "success"
        ).then(() => {
          router.push("/user-auth/signin");
        });
      })
      .catch((error) => {
        Swal.fire(
          "Register Failed!",
          error.response.data.error || "Register Failed!",
          "error"
        );
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
            <input type="hidden" value="User" {...form.register("role")} />
            <Button type="submit" variant="primaryBlueFull" className="w-full">
              Register
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4 text-sm text-gray-500">
          <p>
            Already have an account?
            <a href="/user-auth/signin" className="text-blue-500 underline">
              Login
            </a>{" "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpUserPage;
