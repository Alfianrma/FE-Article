"use client";
import React, { useState } from "react";
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
import axios from "axios";
import Swal from "sweetalert2";
import { getCookie } from "cookies-next/client";
import {
  CategorySchema,
  CategorySchemaType,
} from "@/validation/CategoryValidation";

function AddCategoryForm({
  closeDialog,
  getCategory,
}: {
  closeDialog: () => void;
  getCategory: () => void;
}) {
  const token = getCookie("token");
  //SignIn Form
  const form = useForm<CategorySchemaType>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
    },
  });

  //Submit Form
  const onSubmit: SubmitHandler<CategorySchemaType> = async (data) => {
    await axios
      .post("https://test-fe.mysellerpintar.com/api/categories", data, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        closeDialog();
        Swal.fire("Success!", "Category added successfully", "success");
        getCategory();
      })
      .catch((error) => {
        closeDialog();
        Swal.fire("Error adding category!", error.response.data.error, "error");
      });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Input Category" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end gap-4">
          <button
            className="bg-white text-black rounded-md border border-gray-200 px-2 py-1 hover:cursor-pointer"
            type="button"
            onClick={closeDialog}
          >
            Cancel
          </button>
          <button className="bg-primaryBlue text-white rounded-md border px-2 py-1 hover:bg-primaryBlue/80 hover:cursor-pointer transition-all duration-200 ease-in-out">
            Add
          </button>
        </div>
      </form>
    </Form>
  );
}

export default AddCategoryForm;
