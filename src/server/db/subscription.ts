import { db } from "@/drizzle/db";
import { UserSubscriptionTable } from "@/drizzle/schema";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";

export async function createUserSubscription(
  data: typeof UserSubscriptionTable.$inferInsert
) {
  const [newSubscripttion] = await db
    .insert(UserSubscriptionTable)
    .values(data)
    .onConflictDoNothing({
      target: UserSubscriptionTable.clerkUserId,
    })
    .returning({
      id: UserSubscriptionTable.id,
      userId: UserSubscriptionTable.clerkUserId,
    });

  if (newSubscripttion) {
    revalidateDbCache({
      tag: CACHE_TAGS.subscription,
      id: newSubscripttion.id,
      userId: newSubscripttion.userId,
    });
  }

  return newSubscripttion;
}
