import { z } from "zod";

export const meetingTypeSchema = z.enum([
  "daily",
  "planning",
  "retro",
  "review",
  "pair_programming",
  "ad_hoc",
]);

export type MeetingType = z.infer<typeof meetingTypeSchema>;

export const avatarConfigSchema = z.object({
  bodyColor: z.string().min(1).default("#38bdf8"),
  accentColor: z.string().min(1).default("#0f172a"),
  displayName: z.string().min(1).max(80),
});

export type AvatarConfig = z.infer<typeof avatarConfigSchema>;

export const playerPositionSchema = z.object({
  x: z.number().int().min(0),
  y: z.number().int().min(0),
});

export type PlayerPosition = z.infer<typeof playerPositionSchema>;

export const playerDirectionSchema = z.enum(["up", "down", "left", "right"]);

export type PlayerDirection = z.infer<typeof playerDirectionSchema>;

export const playerSchema = z.object({
  id: z.string().min(1),
  roomId: z.string().min(1),
  name: z.string().min(1).max(80),
  avatarConfig: avatarConfigSchema,
  position: playerPositionSchema,
  direction: playerDirectionSchema.default("down"),
});

export type Player = z.infer<typeof playerSchema>;

export const roomSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  tileSize: z.number().int().positive(),
  isPublic: z.boolean().default(false),
});

export type Room = z.infer<typeof roomSchema>;

export const roomObjectSchema = z.object({
  id: z.string().min(1),
  roomId: z.string().min(1),
  itemDefinitionId: z.string().min(1),
  label: z.string().max(120).optional(),
  position: playerPositionSchema,
  rotation: z.number().int().default(0),
  state: z.record(z.string(), z.unknown()).default({}),
});

export type RoomObject = z.infer<typeof roomObjectSchema>;
