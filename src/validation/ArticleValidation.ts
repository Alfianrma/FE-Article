import { z } from "zod";

const ArticleSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z
    .string()
    .min(1, "Content cannot be empty")
    .refine((val) => val !== "<br>", {
      message: "Content cannot be just line break",
    }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  image: z
    .instanceof(File, { message: "Image is required" })
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
      {
        message: "Only JPG, JPEG, PNG formats are supported",
      }
    )
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "Image must be less than 2MB",
    }),
});

export type ArticleSchemaType = z.infer<typeof ArticleSchema>;

export { ArticleSchema };
