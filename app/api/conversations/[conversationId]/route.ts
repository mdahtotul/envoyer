import getCurrentUser from "@/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

interface IdParams {
  conversationId: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IdParams }
) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { users: true },
    });

    if (!existingConversation) {
      return new NextResponse("Invalid Id", { status: 400 });
    }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    existingConversation.users.forEach((user) => {
      if (user?.email) {
        pusherServer.trigger(
          user?.email,
          "conversation:remove",
          existingConversation
        );
      }
    });

    return NextResponse.json(deletedConversation);
  } catch (error: any) {
    console.log("🚀 ~ file: route.ts:41 ~ error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
