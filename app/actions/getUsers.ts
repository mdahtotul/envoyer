import prisma from "@/libs/prismadb";
import getSession from "./getSession";

const getUsers = async () => {
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        NOT: {
          email: session?.user?.email, // Exclude current user
        },
      },
    });

    return users;
  } catch (err: any) {
    console.log("🚀 ~ file: getUsers.ts:25 ~ getUsers ~ err:", err);
    return [];
  }
};

export default getUsers;
