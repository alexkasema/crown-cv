"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createCustomerPortalSession } from "./actions";
import LoadingButton from "@/components/LoadingButton";

const ManageSubscriptionButton = () => {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);
      const redirectUrl = await createCustomerPortalSession();
      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoadingButton onClick={handleClick} loading={loading}>
      Manage subscription
    </LoadingButton>
  );
};

export default ManageSubscriptionButton;
