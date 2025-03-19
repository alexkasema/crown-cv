"use server";

import { canCreateResume, canUseCustomizations } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { getUserSubscriptionLevel } from "@/lib/subscriptions";
import { resumeSchema, ResumeValues } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";

import { del, put } from "@vercel/blob";
import path from "path";

//! this function will take care of creating or saving resumes
export async function saveResume(values: ResumeValues) {
  const { id } = values;

  //! This will take the values and run them through the schema for validation
  const { photo, workExperiences, educations, ...resumeValues } =
    resumeSchema.parse(values);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  //! Check resume count for non-premium users
  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  //! we have to check because we are creating a new resume
  if (!id) {
    const resumeCount = await prisma.resume.count({ where: { userId } });

    if (!canCreateResume(subscriptionLevel, resumeCount)) {
      throw new Error(
        "Maximum resume count reached for this subscription level",
      );
    }
  }

  //! if the id is present then we will update the resume else we will create a new resume
  const existingResume = id
    ? await prisma.resume.findUnique({ where: { id, userId } })
    : null;

  if (id && !existingResume) {
    throw new Error("Resume not found");
  }

  //! A user should be able to edit their resume and keep their border and color style if they unsubscribed
  //! from the payment plan.
  //! They should not be able to change the border and color style if they are on the free plan.
  //! only if these conditions are true we have new customizations
  const hasCustomizations =
    (resumeValues.borderStyle &&
      resumeValues.borderStyle !== existingResume?.borderStyle) ||
    (resumeValues.colorHex &&
      resumeValues.colorHex !== existingResume?.colorHex);

  //! Check if the user is allowed to apply these customizations
  if (hasCustomizations && !canUseCustomizations(subscriptionLevel)) {
    throw new Error("Customizations not allowed for this subscription level");
  }

  //! before inserting the resume data into the db, we have to upload the photo to the blob storage because
  //! it is a file, we need the url of the photo to store it in the db
  //! undefined means we don't have the photo uploaded
  //! null means the user has removed the photo(delete the current photo)
  let newPhotoUrl: string | undefined | null = undefined;

  if (photo instanceof File) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }

    const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
      access: "public",
    });

    //! we will get the url of the photo from the blob
    newPhotoUrl = blob.url;
  } else if (photo === null) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }
    newPhotoUrl = null;
  }

  //! Saving the changes to the db
  if (id) {
    return prisma.resume.update({
      where: { id },
      data: {
        ...resumeValues,
        photoUrl: newPhotoUrl,
        workExperiences: {
          deleteMany: {},
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        educations: {
          deleteMany: {},
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
        updatedAt: new Date(),
      },
    });
  } else {
    return prisma.resume.create({
      data: {
        ...resumeValues,
        userId,
        photoUrl: newPhotoUrl,
        workExperiences: {
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        educations: {
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
      },
    });
  }
}
