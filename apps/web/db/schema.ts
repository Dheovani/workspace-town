import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { AvatarConfig, MeetingType } from "@/features/room/types";

type JsonRecord = Record<string, unknown>;

export const workspaceRoleEnum = pgEnum("workspace_role", [
  "owner",
  "admin",
  "member",
]);

export const roomRoleEnum = pgEnum("room_role", ["owner", "editor", "viewer"]);

export const chatMessageTypeEnum = pgEnum("chat_message_type", [
  "room",
  "direct",
  "system",
  "meeting",
]);

export const callProviderEnum = pgEnum("call_provider", ["livekit"]);

export const callSessionStatusEnum = pgEnum("call_session_status", [
  "scheduled",
  "active",
  "ended",
]);

export const meetingTypeEnum = pgEnum("meeting_type", [
  "daily",
  "planning",
  "retro",
  "review",
  "pair_programming",
  "ad_hoc",
] satisfies [MeetingType, ...MeetingType[]]);

export const meetingSessionStatusEnum = pgEnum("meeting_session_status", [
  "draft",
  "active",
  "completed",
  "cancelled",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const users = pgTable("users", {
  id: uuid("user_id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  imageUrl: text("image_url"),
  ...timestamps,
});

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", {
    withTimezone: true,
  }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
    withTimezone: true,
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const players = pgTable("players", {
  id: uuid("player_id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(),
  avatarConfig: jsonb("avatar_config").$type<AvatarConfig>().notNull(),
  ...timestamps,
});

export const workspaces = pgTable("workspaces", {
  id: uuid("workspace_id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  ...timestamps,
});

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: workspaceRoleEnum("role").notNull().default("member"),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.workspaceId, table.userId] })],
);

export const rooms = pgTable("rooms", {
  id: uuid("room_id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  width: integer("width").notNull().default(16),
  height: integer("height").notNull().default(10),
  tileSize: integer("tile_size").notNull().default(48),
  isPublic: boolean("is_public").notNull().default(false),
  ...timestamps,
});

export const roomSettings = pgTable("room_settings", {
  roomId: uuid("room_id")
    .primaryKey()
    .references(() => rooms.id, { onDelete: "cascade" }),
  theme: text("theme").notNull().default("default"),
  backgroundColor: text("background_color").notNull().default("#f8fafc"),
  lightMode: text("light_mode").notNull().default("system"),
  guestAccessEnabled: boolean("guest_access_enabled").notNull().default(false),
  chatEnabled: boolean("chat_enabled").notNull().default(true),
  voiceEnabled: boolean("voice_enabled").notNull().default(true),
  videoEnabled: boolean("video_enabled").notNull().default(true),
  screenShareEnabled: boolean("screen_share_enabled").notNull().default(true),
  maxUsers: integer("max_users").notNull().default(50),
  spawnPoint: jsonb("spawn_point")
    .$type<{ x: number; y: number }>()
    .notNull()
    .default({ x: 4, y: 4 }),
  navigationGrid: jsonb("navigation_grid").$type<JsonRecord>().notNull().default({}),
  ...timestamps,
});

export const roomMembers = pgTable(
  "room_members",
  {
    roomId: uuid("room_id")
      .notNull()
      .references(() => rooms.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: roomRoleEnum("role").notNull().default("viewer"),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.roomId, table.userId] })],
);

export const itemDefinitions = pgTable("item_definitions", {
  id: uuid("item_definition_id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  defaultState: jsonb("default_state").$type<JsonRecord>().notNull().default({}),
  width: integer("width").notNull().default(1),
  height: integer("height").notNull().default(1),
  isInteractive: boolean("is_interactive").notNull().default(false),
  ...timestamps,
});

export const roomObjects = pgTable("room_objects", {
  id: uuid("room_object_id").primaryKey().defaultRandom(),
  roomId: uuid("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "cascade" }),
  itemDefinitionId: uuid("item_definition_id")
    .notNull()
    .references(() => itemDefinitions.id, { onDelete: "restrict" }),
  label: text("label"),
  positionX: integer("position_x").notNull(),
  positionY: integer("position_y").notNull(),
  rotation: integer("rotation").notNull().default(0),
  state: jsonb("state").$type<JsonRecord>().notNull().default({}),
  isLocked: boolean("is_locked").notNull().default(false),
  ...timestamps,
});

export const chatMessages = pgTable("chat_messages", {
  id: uuid("chat_message_id").primaryKey().defaultRandom(),
  roomId: uuid("room_id").references(() => rooms.id, { onDelete: "cascade" }),
  meetingSessionId: uuid("meeting_session_id").references(
    () => meetingSessions.id,
    { onDelete: "cascade" },
  ),
  senderUserId: uuid("sender_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  receiverUserId: uuid("receiver_user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  type: chatMessageTypeEnum("type").notNull().default("room"),
  content: text("content").notNull(),
  metadata: jsonb("metadata").$type<JsonRecord>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const callSessions = pgTable("call_sessions", {
  id: uuid("call_session_id").primaryKey().defaultRandom(),
  roomId: uuid("room_id").references(() => rooms.id, { onDelete: "set null" }),
  provider: callProviderEnum("provider").notNull().default("livekit"),
  providerRoomName: text("provider_room_name").notNull(),
  status: callSessionStatusEnum("status").notNull().default("scheduled"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  metadata: jsonb("metadata").$type<JsonRecord>().notNull().default({}),
  ...timestamps,
});

export const callParticipants = pgTable("call_participants", {
  id: uuid("call_participant_id").primaryKey().defaultRandom(),
  callSessionId: uuid("call_session_id")
    .notNull()
    .references(() => callSessions.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  providerParticipantId: text("provider_participant_id"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  leftAt: timestamp("left_at", { withTimezone: true }),
  metadata: jsonb("metadata").$type<JsonRecord>().notNull().default({}),
});

export const meetingTemplates = pgTable("meeting_templates", {
  id: uuid("meeting_template_id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, {
    onDelete: "cascade",
  }),
  type: meetingTypeEnum("type").notNull(),
  name: text("name").notNull(),
  agenda: jsonb("agenda").$type<JsonRecord>().notNull().default({}),
  isDefault: boolean("is_default").notNull().default(false),
  ...timestamps,
});

export const meetingSessions = pgTable("meeting_sessions", {
  id: uuid("meeting_session_id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  roomId: uuid("room_id").references(() => rooms.id, { onDelete: "set null" }),
  templateId: uuid("meeting_template_id").references(() => meetingTemplates.id, {
    onDelete: "set null",
  }),
  callSessionId: uuid("call_session_id").references(() => callSessions.id, {
    onDelete: "set null",
  }),
  type: meetingTypeEnum("type").notNull(),
  title: text("title").notNull(),
  status: meetingSessionStatusEnum("status").notNull().default("draft"),
  scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
  startedAt: timestamp("started_at", { withTimezone: true }),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  metadata: jsonb("metadata").$type<JsonRecord>().notNull().default({}),
  ...timestamps,
});

export const meetingParticipants = pgTable(
  "meeting_participants",
  {
    meetingSessionId: uuid("meeting_session_id")
      .notNull()
      .references(() => meetingSessions.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("participant"),
    joinedAt: timestamp("joined_at", { withTimezone: true }),
    leftAt: timestamp("left_at", { withTimezone: true }),
  },
  (table) => [primaryKey({ columns: [table.meetingSessionId, table.userId] })],
);

export const meetingNotes = pgTable("meeting_notes", {
  id: uuid("meeting_note_id").primaryKey().defaultRandom(),
  meetingSessionId: uuid("meeting_session_id")
    .notNull()
    .references(() => meetingSessions.id, { onDelete: "cascade" }),
  authorUserId: uuid("author_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  content: text("content").notNull(),
  metadata: jsonb("metadata").$type<JsonRecord>().notNull().default({}),
  ...timestamps,
});

export const meetingActionItems = pgTable("meeting_action_items", {
  id: uuid("meeting_action_item_id").primaryKey().defaultRandom(),
  meetingSessionId: uuid("meeting_session_id")
    .notNull()
    .references(() => meetingSessions.id, { onDelete: "cascade" }),
  assigneeUserId: uuid("assignee_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  description: text("description"),
  isCompleted: boolean("is_completed").notNull().default(false),
  dueAt: timestamp("due_at", { withTimezone: true }),
  ...timestamps,
});

export const retroCards = pgTable("retro_cards", {
  id: uuid("retro_card_id").primaryKey().defaultRandom(),
  meetingSessionId: uuid("meeting_session_id")
    .notNull()
    .references(() => meetingSessions.id, { onDelete: "cascade" }),
  authorUserId: uuid("author_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  column: text("column").notNull(),
  content: text("content").notNull(),
  votes: integer("votes").notNull().default(0),
  metadata: jsonb("metadata").$type<JsonRecord>().notNull().default({}),
  ...timestamps,
});
