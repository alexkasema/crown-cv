import { Metadata } from "next";
import ResumeEditor from "./ResumeEditor";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { resumeDataInclude } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ resumeId?: string }>;
}

export const metadata: Metadata = {
  title: "Design your resume",
};

const EditorPage = async ({ searchParams }: PageProps) => {
  const { resumeId } = await searchParams;

  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const resumeToEdit = resumeId
    ? await prisma.resume.findUnique({
        where: { id: resumeId, userId },
        include: resumeDataInclude,
      })
    : null;
  return <ResumeEditor resumeToEdit={resumeToEdit} />;
};

export default EditorPage;
