import { z } from "zod";

//! Optional only includes undefined not an empty string that why we add .or(z.literal(""))
//! This way we can pass undefined or an empty string as the value
export const optionalString = z.string().trim().optional().or(z.literal(""));

export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
});

export type GeneralInfoValues = z.infer<typeof generalInfoSchema>;
