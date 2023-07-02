import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id)
      return new NextResponse("Unauthorized!", { status: 401 });

    const body = await request.json();
    const { name, image } = body;

    const updateUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: { name, image },
    });

    return NextResponse.json(updateUser);
  } catch (err: any) {
    console.log("🚀 ~ file: settings.route.ts:21 ~ POST ~ err:", err);
    return new NextResponse("Internal server error!", { status: 500 });
  }
}
