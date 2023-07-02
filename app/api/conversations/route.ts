import getCurrentUser from "@/actions/getCurrentUser";

import { pusherServer } from "@/libs/pusher";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();

    const { userId, isGroup, members, name } = body;
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (isGroup && (!members || members?.length < 2 || !name)) {
      return new NextResponse("Invalid Request", { status: 400 });
    }

    // creating group conversation

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser?.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      newConversation.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, "conversation:new", newConversation);
        }
      });

      return NextResponse.json(newConversation);
    }

    // matching single conversation
    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser?.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser?.id],
            },
          },
        ],
      },
    });

    const singleConversation = existingConversations[0];
    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    // creating single conversation
    const newConversation = await prisma.conversation.create({
      data: {
        isGroup: false,
        users: {
          connect: [{ id: currentUser?.id }, { id: userId }],
        },
      },
      include: {
        users: true,
      },
    });

    newConversation.users.map((user) => {
      if (user?.email) {
        pusherServer.trigger(user.email, "conversation:new", newConversation);
      }
    });

    return NextResponse.json(newConversation);
  } catch (err: any) {
    console.log("🚀 ~ file: route.ts:8 ~ POST ~ err:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
