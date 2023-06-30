import prisma from "@/libs/prismadb";

const getMessages = async (conversationId: string) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return messages;
  } catch (err: any) {
    console.log("🚀 ~ file: getMessages.ts:20 ~ getMessages ~ err:", err);
    return [];
  }
};

export default getMessages;
