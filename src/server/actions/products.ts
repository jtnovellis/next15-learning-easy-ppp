"use server";

import { productDetailsSchema } from "@/schemas/products";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import {
  createProductDb,
  deleteProductDb,
  updateProductDb,
} from "../db/products";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createProduct(
  unsafeData: z.infer<typeof productDetailsSchema>
): Promise<{ error: boolean; message?: string } | undefined> {
  const { userId } = await auth();

  const { success, data } = productDetailsSchema.safeParse(unsafeData);

  if (!success || userId === null) {
    return { error: true, message: "There was an error creating the product" };
  }

  const { id } = await createProductDb({ ...data, clerkUserId: userId });

  redirect(`/dashboard/products/${id}/edit?tab=countries`);
}

export async function updateProduct(
  id: string,
  unsafeData: z.infer<typeof productDetailsSchema>
): Promise<{ error: boolean; message?: string } | undefined> {
  const { userId } = await auth();
  const errorMessage = "There was an error updating the product";

  const { success, data } = productDetailsSchema.safeParse(unsafeData);

  if (!success || userId === null) {
    return { error: true, message: "There was an error updating the product" };
  }

  const isSuccess = await updateProductDb(data, { id, userId });

  return {
    error: !isSuccess,
    message: isSuccess ? "Product updated" : errorMessage,
  };
}

export async function deleteProduct(id: string) {
  const { userId } = await auth();
  const errorMessage = "There was an error deleting the product";

  if (userId === null) {
    return {
      error: true,
      message: "You must be signed in to delete a product",
    };
  }

  const isSuccess = await deleteProductDb({ id, userId });

  return {
    error: !isSuccess,
    message: isSuccess ? "Product deleted" : errorMessage,
  };
}
