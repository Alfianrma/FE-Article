import { z } from "zod";

const CategorySchema = z.object({
  name: z.string().nonempty({ message: "Category field cannot be empty" }),
});

export type CategorySchemaType = z.infer<typeof CategorySchema>;
export { CategorySchema };
