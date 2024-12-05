import { db } from "@/drizzle/db";
import { ProducTable, ProductCustomizationTable } from "@/drizzle/schema";
import {
  CACHE_TAGS,
  dbCache,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";
import { and, eq } from "drizzle-orm";

export function getProducts(userId: string, { limit }: { limit?: number }) {
  const cacheFn = dbCache(getProductsInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.products)],
  });

  return cacheFn(userId, { limit });
}

export async function getProduct({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const cacheFn = dbCache(getProductInternal, {
    tags: [getUserTag(id, CACHE_TAGS.products)],
  });
  return cacheFn(id, userId);
}

export async function createProductDb(data: typeof ProducTable.$inferInsert) {
  const [newProduct] = await db
    .insert(ProducTable)
    .values(data)
    .returning({ id: ProducTable.id, userId: ProducTable.clerkUserId });

  try {
    await db
      .insert(ProductCustomizationTable)
      .values({
        productId: newProduct.id,
      })
      .onConflictDoNothing({
        target: ProductCustomizationTable.productId,
      });
  } catch (err) {
    await db.delete(ProducTable).where(eq(ProducTable.id, newProduct.id));
  }
  revalidateDbCache({
    tag: CACHE_TAGS.products,
    userId: newProduct.userId,
    id: newProduct.id,
  });

  return newProduct;
}

export async function deleteProductDb({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const { rowCount } = await db
    .delete(ProducTable)
    .where(and(eq(ProducTable.id, id), eq(ProducTable.clerkUserId, userId)));

  if (rowCount > 0) {
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      userId,
      id,
    });
  }

  return rowCount > 0;
}

function getProductsInternal(userId: string, { limit }: { limit?: number }) {
  return db.query.ProducTable.findMany({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
    limit,
  });
}

function getProductInternal(id: string, userId: string) {
  return db.query.ProducTable.findFirst({
    where: ({ clerkUserId, id: idCol }, { eq, and }) =>
      and(eq(clerkUserId, userId), eq(idCol, id)),
  });
}

export async function updateProductDb(
  data: Partial<typeof ProducTable.$inferInsert>,
  { id, userId }: { id: string; userId: string }
) {
  const { rowCount } = await db
    .update(ProducTable)
    .set(data)
    .where(and(eq(ProducTable.clerkUserId, userId), eq(ProducTable.id, id)));

  if (rowCount > 0) {
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      userId,
      id,
    });
  }

  return rowCount > 0;
}
