import { z } from "zod";

const SignInSchema = z.object({
  username: z.string().nonempty({ message: "Please enter your username" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .nonempty({ message: "Please enter your password" }),
});

const SignUpSchema = z.object({
  username: z.string().nonempty({ message: "Please enter your username" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .nonempty({ message: "Please enter your password" }),
  role: z.enum(["Admin", "User"], {
    errorMap: () => ({ message: "Please select a role" }),
  }),
});

export type SignInSchemaType = z.infer<typeof SignInSchema>;
export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export { SignInSchema, SignUpSchema };
