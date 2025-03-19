import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing",
};
const BillingPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <h1 className="text-3xl font-bold">Billing</h1>
    </main>
  );
};

export default BillingPage;
