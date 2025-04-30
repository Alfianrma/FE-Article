"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ArrowLeft,
  ImagePlus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next/client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArticleSchema,
  ArticleSchemaType,
} from "@/validation/ArticleValidation";
import { Category } from "@/lib/types/DataArticlesType";
import axios from "axios";

function AddArticlePage() {
  const router = useRouter();
  const token = getCookie("token") as string;
  // Dropdown options
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  //Input Image
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(file.name);
      form.setValue("image", file, { shouldValidate: true });
    }
  };
  //Article Form
  const form = useForm<ArticleSchemaType>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
      image: undefined,
    },
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  //Get Category Options
  const getCategoryOptions = useCallback(async () => {
    const baseUrl = "https://test-fe.mysellerpintar.com/api/categories";
    let allCategory: Category[] = [];
    let currentPage = 1;
    let totalPages = 1;

    do {
      await axios
        .get(`${baseUrl}?page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data;

          allCategory = allCategory.concat(data.data);
          totalPages = data.totalPages;
          currentPage++;
        })
        .catch((err) => {});
    } while (currentPage <= totalPages);

    const categoryOptions = allCategory.map((category) => ({
      value: category.id,
      label: category.name,
    }));
    setCategoryOptions(categoryOptions);
  }, []);

  //Submit Form
  const onSubmit: SubmitHandler<ArticleSchemaType> = async (data) => {
    const formData = new FormData();
    formData.append("image", data.image);
    await axios
      .post("https://test-fe.mysellerpintar.com/api/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Image Upload Response:", response.data);
        const payload = {
          title: data.title,
          content: data.content,
          categoryId: data.categoryId,
          imageUrl: response.data.imageUrl,
        };
        axios
          .post("https://test-fe.mysellerpintar.com/api/articles", payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            console.log("Article Upload Response:", response.data);
            router.push("/admin/articles");
          });
      });
    console.log("Form Data:", data);
  };

  useEffect(() => {
    getCategoryOptions();
  }, [getCategoryOptions]);
  return (
    <Form {...form}>
      <div className="bg-white rounded-xl border border-gray-200 p-4 w-full font-semibold">
        <div className="flex flex-row gap-2 items-center">
          <ArrowLeft
            strokeWidth={2.25}
            className="hover:cursor-pointer"
            onClick={() => router.back()}
          />
          <p>Add Articles</p>
        </div>
        <div className="mt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <div>
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <div
                        className="flex flex-col gap-2 items-center justify-center w-60 h-40 border-2 border-dashed rounded-lg bg-gray-50 hover:cursor-pointer hover:bg-gray-100"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <ImagePlus className="text-gray-500" />
                        <div className="text-gray-500 underline text-xs">
                          Click to select files
                        </div>
                        <div className="text-gray-500 underline text-xs">
                          Support file type : jpg or png
                        </div>
                      </div>
                      {imagePreview && (
                        <div className="mt-2 text-sm text-gray-700">
                          Selected file: {imagePreview}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Input Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className=" bg-white">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup>
                          <SelectItem value="all">All</SelectItem>
                          {categoryOptions.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div>
                      {/* Toolbar */}
                      <div className="flex gap-2 border-b pb-2">
                        <button
                          type="button"
                          onClick={() => execCommand("bold")}
                          className="font-bold  px-4 py-1 border border-gray-200 rounded-md hover:cursor-pointer"
                        >
                          B
                        </button>
                        <button
                          type="button"
                          onClick={() => execCommand("italic")}
                          className="italic font-light px-4 py-1 border border-gray-200 rounded-md hover:cursor-pointer "
                        >
                          I
                        </button>
                        <button
                          onClick={() => execCommand("justifyLeft")}
                          type="button"
                          className="px-2 py-1 border border-gray-200 rounded-md hover:cursor-pointer "
                        >
                          <AlignLeft />
                        </button>
                        <button
                          onClick={() => execCommand("justifyCenter")}
                          type="button"
                          className="px-2 py-1 border border-gray-200 rounded-md hover:cursor-pointer "
                        >
                          <AlignCenter />
                        </button>
                        <button
                          onClick={() => execCommand("justifyRight")}
                          type="button"
                          className="px-2 py-1 border border-gray-200 rounded-md hover:cursor-pointer "
                        >
                          <AlignRight />
                        </button>
                        <button
                          onClick={() => execCommand("justifyFull")}
                          type="button"
                          className="px-2 py-1 border border-gray-200 rounded-md hover:cursor-pointer "
                        >
                          <AlignJustify />
                        </button>
                      </div>

                      {/* Editable Area */}
                      <div
                        ref={editorRef}
                        contentEditable
                        className="min-h-[200px] p-4 border rounded-md bg-gray-50 focus:outline-none max-w-screen"
                        onInput={(e) =>
                          field.onChange(e.currentTarget.innerHTML)
                        }
                        // dangerouslySetInnerHTML={{ __html: field.value || "" }}
                      ></div>

                      {/* Footer */}
                      <div className="text-sm text-gray-500 flex justify-between">
                        <div>
                          {editorRef.current?.innerText
                            .split(/\s+/)
                            .filter(Boolean).length || 0}{" "}
                          Words
                        </div>
                        {error && (
                          <div className="text-red-500">
                            Content field cannot be empty
                          </div>
                        )}
                      </div>
                    </div>
                    {/* <Textarea
                      placeholder="Type a content"
                      {...field}
                      className="pr-10"
                      rows={30}
                    /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </div>
      </div>
      <div className="flex flex-row justify-end mt-4">
        <button
          type="button"
          className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-100 hover:cursor-pointer"
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-primaryBlue text-white px-4 py-2 rounded-md hover:bg-primaryBlue/80 hover:cursor-pointer"
          onClick={form.handleSubmit(onSubmit)}
        >
          Save
        </button>
      </div>
    </Form>
  );
}

export default AddArticlePage;
