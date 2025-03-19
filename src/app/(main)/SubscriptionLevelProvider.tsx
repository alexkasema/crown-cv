"use client";

import { SubscriptionLevel } from "@/lib/subscriptions";
import { createContext, ReactNode, useContext } from "react";

const SubscriptionLevelContext = createContext<SubscriptionLevel | undefined>(
  undefined,
);

interface SubscriptionLevelProviderProps {
  children: ReactNode;
  userSubscriptionLevel: SubscriptionLevel;
}

export default function SubscriptionLevelProvider({
  children,
  userSubscriptionLevel,
}: SubscriptionLevelProviderProps) {
  return (
    <SubscriptionLevelContext.Provider value={userSubscriptionLevel}>
      {children}
    </SubscriptionLevelContext.Provider>
  );
}

//! the context is undefined if we don't pass a user subscription level
//! the only case this can happen is when we forget to add this provider to our layout
export function useSubscriptionLevel() {
  const context = useContext(SubscriptionLevelContext);
  if (context === undefined) {
    throw new Error(
      "useSubscriptionLevel must be used within a SubscriptionLevelProvider",
    );
  }
  return context;
}
