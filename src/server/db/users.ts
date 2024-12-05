import { db } from "@/drizzle/db";
import { ProducTable, UserSubscriptionTable } from "@/drizzle/schema";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";
import { eq } from "drizzle-orm";

export async function deleteUser(clerkUserId: string) {
  const [userSubscription, products] = await db.batch([
    db
      .delete(UserSubscriptionTable)
      .where(eq(UserSubscriptionTable.clerkUserId, clerkUserId))
      .returning({
        id: UserSubscriptionTable.id,
      }),
    db
      .delete(ProducTable)
      .where(eq(ProducTable.clerkUserId, clerkUserId))
      .returning({ id: ProducTable.id }),
  ]);

  userSubscription.forEach((subscription) => {
    revalidateDbCache({
      tag: CACHE_TAGS.subscription,
      id: subscription.id,
      userId: clerkUserId,
    });
  });

  products.forEach((product) => {
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      id: product.id,
      userId: clerkUserId,
    });
  });

  return [userSubscription, products];
}
