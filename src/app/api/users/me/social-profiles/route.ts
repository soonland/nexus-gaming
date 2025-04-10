import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UserSocialProfileData } from "@/types/social";
import { cleanUsername, generatePlatformUrl } from "@/lib/social";
import { getCurrentUser } from "@/lib/jwt";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userWithProfiles = await prisma.user.findUnique({
    where: { id: user.id },
    include: { socialProfiles: true }
  });

  if (!userWithProfiles) {
    return new NextResponse("User not found", { status: 404 });
  }

  return NextResponse.json(userWithProfiles.socialProfiles);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body: UserSocialProfileData = await request.json();
    const cleanedUsername = cleanUsername(body.username);

    const existingProfile = await prisma.userSocialProfile.findFirst({
      where: {
        userId: user.id,
        platform: body.platform,
      },
    });

    if (existingProfile) {
      return new NextResponse("Profile already exists for this platform", { status: 400 });
    }

    const profile = await prisma.userSocialProfile.create({
      data: {
        userId: user.id,
        platform: body.platform,
        username: cleanedUsername,
        url: generatePlatformUrl(body.platform, cleanedUsername),
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error creating social profile:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
