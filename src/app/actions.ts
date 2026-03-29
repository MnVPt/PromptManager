"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPrompts() {
  try {
    return await prisma.prompt.findMany({
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" },
      ],
    });
  } catch (error) {
    console.error("Failed to fetch prompts:", error);
    return [];
  }
}

export async function createPrompt(data: {
  title: string;
  content: string;
  category?: string;
  tags?: string;
  isPinned?: boolean;
}) {
  try {
    const prompt = await prisma.prompt.create({
      data,
    });
    revalidatePath("/");
    return { success: true, prompt };
  } catch (error) {
    console.error("Failed to create prompt:", error);
    return { success: false, error: "Failed to create prompt" };
  }
}

export async function updatePrompt(id: number, data: {
  title?: string;
  content?: string;
  category?: string;
  tags?: string;
  isPinned?: boolean;
}) {
  try {
    const prompt = await prisma.prompt.update({
      where: { id },
      data,
    });
    revalidatePath("/");
    return { success: true, prompt };
  } catch (error) {
    console.error("Failed to update prompt:", error);
    return { success: false, error: "Failed to update prompt" };
  }
}

export async function deletePrompt(id: number) {
  try {
    await prisma.prompt.delete({
      where: { id },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete prompt:", error);
    return { success: false, error: "Failed to delete prompt" };
  }
}
