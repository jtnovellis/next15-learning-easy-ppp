import { removeTrailingSlash } from "@/lib/utils";
import { z } from "zod";

export const productDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  url: z
    .string()
    .url()
    .min(1, "URL is required")
    .transform(removeTrailingSlash),
});
