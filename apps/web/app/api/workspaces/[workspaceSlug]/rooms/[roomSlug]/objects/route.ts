import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import {
  getRoomLayout,
  InvalidRoomLayoutError,
  replaceRoomLayout,
} from "@/features/room/server/room-layout-repository";
import { roomLayoutInputSchema } from "@/features/room/types";

type RoomObjectsRouteContext = {
  params: Promise<{
    workspaceSlug: string;
    roomSlug: string;
  }>;
};

async function hasSession(request: Request): Promise<boolean> {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return Boolean(session);
}

export async function GET(
  request: Request,
  context: RoomObjectsRouteContext,
) {
  if (!(await hasSession(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { workspaceSlug, roomSlug } = await context.params;
  const objects = await getRoomLayout(workspaceSlug, roomSlug);

  if (!objects) {
    return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }

  return NextResponse.json({ objects });
}

export async function PUT(
  request: Request,
  context: RoomObjectsRouteContext,
) {
  if (!(await hasSession(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = roomLayoutInputSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid room layout.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { workspaceSlug, roomSlug } = await context.params;

  try {
    const objects = await replaceRoomLayout(
      workspaceSlug,
      roomSlug,
      parsed.data.objects,
    );

    if (!objects) {
      return NextResponse.json({ error: "Room not found." }, { status: 404 });
    }

    return NextResponse.json({ objects });
  } catch (error) {
    if (error instanceof InvalidRoomLayoutError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    throw error;
  }
}
