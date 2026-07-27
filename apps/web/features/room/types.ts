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

export const roomModeSchema = z.enum(["user", "editor", "debug"]);
export type RoomMode = z.infer<typeof roomModeSchema>;

export const avatarHairStyleSchema = z.enum(["short", "spiky", "bob"]);
export const avatarFaceStyleSchema = z.enum(["neutral", "smile", "focused"]);
export const avatarShirtStyleSchema = z.enum(["tshirt", "hoodie", "jacket"]);

export const avatarConfigSchema = z.object({
  skinTone: z.string().min(1).default("#d49a6a"),
  hairStyle: avatarHairStyleSchema.default("short"),
  hairColor: z.string().min(1).default("#1f2937"),
  faceStyle: avatarFaceStyleSchema.default("smile"),
  shirtStyle: avatarShirtStyleSchema.default("hoodie"),
  shirtColor: z.string().min(1).default("#38bdf8"),
  pantsColor: z.string().min(1).default("#334155"),
  shoeColor: z.string().min(1).default("#f8fafc"),
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

export const itemDefinitionKindSchema = z.enum([
  "table",
  "chair",
  "whiteboard",
  "plant",
]);

export type ItemDefinitionKind = z.infer<typeof itemDefinitionKindSchema>;

export const itemDefinitionSchema = z.object({
  id: z.string().min(1),
  kind: itemDefinitionKindSchema,
  translationKey: itemDefinitionKindSchema,
  color: z.string().min(1),
  blocksMovement: z.boolean().default(true),
});

export type ItemDefinition = z.infer<typeof itemDefinitionSchema>;

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

export const roomLayoutObjectInputSchema = roomObjectSchema
  .pick({
    itemDefinitionId: true,
    label: true,
    position: true,
    rotation: true,
    state: true,
  })
  .extend({
    id: z.string().min(1).optional(),
    rotation: z
      .number()
      .int()
      .min(0)
      .max(270)
      .refine((rotation) => rotation % 90 === 0),
  });

export type RoomLayoutObjectInput = z.infer<typeof roomLayoutObjectInputSchema>;

export const roomLayoutInputSchema = z.object({
  objects: z.array(roomLayoutObjectInputSchema).max(500),
});

export type RoomLayoutInput = z.infer<typeof roomLayoutInputSchema>;

export const roomLayoutResponseSchema = z.object({
  objects: z.array(roomObjectSchema),
});

export type RoomLayoutResponse = z.infer<typeof roomLayoutResponseSchema>;
