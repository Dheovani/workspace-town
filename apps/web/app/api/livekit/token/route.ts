import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";
import { z } from "zod";

const tokenRequestSchema = z.object({
  roomName: z.string().min(1).max(120).default("workspace-town-demo"),
  identity: z.string().min(1).max(120),
  name: z.string().min(1).max(120).optional(),
});

function getLiveKitEnv():
  | { ok: true; apiKey: string; apiSecret: string; url: string }
  | { ok: false; missing: string[] } {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const url = process.env.LIVEKIT_URL;
  const env = {
    LIVEKIT_API_KEY: apiKey,
    LIVEKIT_API_SECRET: apiSecret,
    LIVEKIT_URL: url,
  };
  const missing = Object.entries(env)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0 || !apiKey || !apiSecret || !url) {
    return { ok: false, missing };
  }

  return { ok: true, apiKey, apiSecret, url };
}

export function GET() {
  return NextResponse.json({
    message: "POST roomName, identity, and optional name to generate a token.",
  });
}

export async function POST(request: Request) {
  const env = getLiveKitEnv();

  if (!env.ok) {
    return NextResponse.json(
      { error: "Missing LiveKit environment variables.", missing: env.missing },
      { status: 500 },
    );
  }

  const body = tokenRequestSchema.safeParse(await request.json());

  if (!body.success) {
    return NextResponse.json(
      { error: "Invalid token request.", issues: body.error.flatten() },
      { status: 400 },
    );
  }

  const accessToken = new AccessToken(env.apiKey, env.apiSecret, {
    identity: body.data.identity,
    name: body.data.name,
  });

  accessToken.addGrant({
    room: body.data.roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return NextResponse.json({
    token: await accessToken.toJwt(),
    url: env.url,
    roomName: body.data.roomName,
  });
}
