import PremiumModal from "@/components/premium/PremiumModal";
import Navbar from "./Navbar";
import { auth } from "@clerk/nextjs/server";
import { getUserSubscriptionLevel } from "@/lib/subscriptions";
import SubscriptionLevelProvider from "./SubscriptionLevelProvider";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  //! we want to pass this to all our child components
  const userSubscriptionLevel = await getUserSubscriptionLevel(userId);

  return (
    <SubscriptionLevelProvider userSubscriptionLevel={userSubscriptionLevel}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        {children}
        <PremiumModal />
      </div>
    </SubscriptionLevelProvider>
  );
}
