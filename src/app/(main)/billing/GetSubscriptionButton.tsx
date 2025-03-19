"use client";

import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";

export default function GetSubscriptionButton() {
  const premiumModal = usePremiumModal();

  return (
    <Button
      className="cursor-pointer"
      onClick={() => premiumModal.setOpen(true)}
      variant="premium"
    >
      Get Premium subscription
    </Button>
  );
}
