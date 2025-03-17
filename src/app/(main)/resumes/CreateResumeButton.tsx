import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import Link from "next/link";
import React from "react";

interface CreateResumeButtonProps {
  canCreate: boolean;
}

const CreateResumeButton = ({ canCreate }: CreateResumeButtonProps) => {
  if (canCreate) {
    return (
      <Button asChild className="mx-auto w-fit gap-2">
        <Link href="/editor">
          <PlusSquare className="size-5" />
          New Resume
        </Link>
      </Button>
    );
  }

  return (
    <Button className="mx-auto w-fit gap-2">
      <PlusSquare className="size-5" />
      New Resume
    </Button>
  );
};

export default CreateResumeButton;
