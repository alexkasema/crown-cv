import useDebounce from "@/hooks/useDebounce";
import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { saveResume } from "./actions";
import { fileReplacer } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function useAutoSaveResume(resumeData: ResumeValues) {
  const searchParams = useSearchParams();

  const debouncedResumeData = useDebounce(resumeData, 1500);

  const [resumeId, setResumeId] = useState(resumeData.id);

  //! Clones the data
  //! we cna check is new resume data is different from the last saved data then only then trigger the save
  const [lastSavedData, setLastSavedData] = useState(
    structuredClone(resumeData),
  );

  //! show the saving text
  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsError(false);
  }, [debouncedResumeData]);

  useEffect(() => {
    async function save() {
      try {
        setIsSaving(true);
        setIsError(false);

        const newData = structuredClone(debouncedResumeData);

        //! if the new data is same as the last saved data then we don't need to save
        const updatedResume = await saveResume({
          ...newData,
          ...(JSON.stringify(lastSavedData.photo, fileReplacer) ===
            JSON.stringify(newData.photo, fileReplacer) && {
            photo: undefined,
          }),
          id: resumeId,
        });

        setResumeId(updatedResume.id);
        setLastSavedData(newData);

        if (searchParams.get("resumeId") !== updatedResume.id) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("resumeId", updatedResume.id);
          window.history.replaceState(
            null,
            "",
            `?${newSearchParams.toString()}`,
          );
        }
      } catch (error) {
        setIsError(true);
        console.error(error);
        toast.custom((t) => (
          <div className="space-y-3 border border-r-4 border-red-500 p-3 backdrop-blur-3xl">
            <p className="text-red-500">Could not save changes.</p>
            <Button
              variant="secondary"
              onClick={() => {
                toast.dismiss(t);
                save();
              }}
            >
              Retry
            </Button>
          </div>
        ));
      } finally {
        setIsSaving(false);
      }
    }
    // console.log(
    //   "debouncedResumeData",
    //   JSON.stringify(debouncedResumeData, fileReplacer),
    // );
    // console.log("lastSavedData", JSON.stringify(lastSavedData, fileReplacer));

    const hasUnsavedChanges =
      JSON.stringify(debouncedResumeData, fileReplacer) !==
      JSON.stringify(lastSavedData, fileReplacer);

    if (hasUnsavedChanges && debouncedResumeData && !isSaving && !isError) {
      save();
    }
  }, [
    debouncedResumeData,
    isSaving,
    lastSavedData,
    isError,
    resumeId,
    searchParams,
    toast,
  ]);
  return {
    isSaving,
    hasUnsavedChanges:
      JSON.stringify(resumeData) !== JSON.stringify(lastSavedData),
  };
}
