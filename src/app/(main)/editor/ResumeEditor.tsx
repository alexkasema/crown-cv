"use client";

import { cn } from "@/lib/utils";
import Footer from "./Footer";
import GeneralInfoForm from "./forms/GeneralInfoForm";

const ResumeEditor = () => {
  return (
    <div className="flex grow flex-col">
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <h1 className="text-2xl font-bold">Design your resume</h1>
        <p className="text-muted-foreground text-sm text-pretty">
          Follow the steps below to create your resume. Your progress will be
          saved automatically.
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute top-0 bottom-0 flex w-full">
          <div
            className={cn(
              "w-full space-y-6 overflow-y-auto p-3 md:block md:w-1/2",
            )}
          >
            <GeneralInfoForm />
          </div>
          <div className="grow md:border-r" />
          <div className="hidden w-1/2 md:flex">Resume preview</div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResumeEditor;
