import { z } from "zod";

//! Optional only includes undefined not an empty string that why we add .or(z.literal(""))
//! This way we can pass undefined or an empty string as the value
export const optionalString = z.string().trim().optional().or(z.literal(""));

export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
});

export type GeneralInfoValues = z.infer<typeof generalInfoSchema>;

//! custom<File | undefined>() is a custom type guard that checks if the value is a File object
//! we can only send upto 4mb to a serverless function in nextjs.
//! If you want to upload something bigger you can do that client side.
export const personalInfoSchema = z.object({
  photo: z
    .custom<File | undefined>()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "Must be an image file",
    )
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 4,
      "File must be less than 4MB",
    ),
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  phone: optionalString,
  email: optionalString,
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

//! We can merge two schemas together using the shape property
//! This way we can create a schema that includes all the fields from all schemas
export const resumeSchema = z.object({
  ...generalInfoSchema.shape,
  ...personalInfoSchema.shape,
});

//! Extend the type because when we update an already existing resume we have an id field
//! When we create a new resume we don't yet have an id
//! We will store the id in This resume values together with all other fields but independently of the forms
//! omit the photo field and use the one we have specified in the ResumeValues type
export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "photo"> & {
  id?: string;
  photo?: File | string | null;
};
