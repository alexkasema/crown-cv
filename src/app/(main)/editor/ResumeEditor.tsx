"use client";

import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";
import { steps } from "./steps";

const ResumeEditor = () => {
  const searchParams = useSearchParams();

  const [resumeData, setResumeData] = useState<ResumeValues>({});

  const currentStep = searchParams.get("step") || steps[0].key;

  //! update the URL with the current step
  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", key);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }

  const FormComponent = steps.find(
    (step) => step.key === currentStep,
  )?.component;

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
            <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && (
              <FormComponent
                resumeData={resumeData}
                setResumeData={setResumeData}
              />
            )}
          </div>
          <div className="grow md:border-r" />
          <div className="hidden w-1/2 md:flex">
            Resume preview
            <pre>{JSON.stringify(resumeData, null, 2)}</pre>
          </div>
        </div>
      </main>
      <Footer currentStep={currentStep} setCurrentStep={setStep} />
    </div>
  );
};

export default ResumeEditor;
