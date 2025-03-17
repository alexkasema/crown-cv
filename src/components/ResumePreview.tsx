import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { useRef } from "react";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  className?: string;
}

const ResumePreview = ({ resumeData, className }: ResumePreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  //   @ts-ignore
  const { width } = useDimensions(containerRef);
  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full bg-white text-black",
        className,
      )}
      ref={containerRef}
    >
      {/* This div wraps all the content of our resume */}
      <div
        className={cn("space-y-6 p-6", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
      >
        <h1 className="p-6 text-3xl font-bold">
          This text should change with the size of the container div
        </h1>
      </div>
    </div>
  );
};

export default ResumePreview;
