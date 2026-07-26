CREATE TYPE "public"."call_provider" AS ENUM('livekit');--> statement-breakpoint
CREATE TYPE "public"."call_session_status" AS ENUM('scheduled', 'active', 'ended');--> statement-breakpoint
CREATE TYPE "public"."chat_message_type" AS ENUM('room', 'direct', 'system', 'meeting');--> statement-breakpoint
CREATE TYPE "public"."meeting_session_status" AS ENUM('draft', 'active', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."meeting_type" AS ENUM('daily', 'planning', 'retro', 'review', 'pair_programming', 'ad_hoc');--> statement-breakpoint
CREATE TYPE "public"."room_role" AS ENUM('owner', 'editor', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."workspace_role" AS ENUM('owner', 'admin', 'member');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "call_participants" (
	"call_participant_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"call_session_id" uuid NOT NULL,
	"user_id" uuid,
	"provider_participant_id" text,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"left_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "call_sessions" (
	"call_session_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" uuid,
	"provider" "call_provider" DEFAULT 'livekit' NOT NULL,
	"provider_room_name" text NOT NULL,
	"status" "call_session_status" DEFAULT 'scheduled' NOT NULL,
	"started_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"chat_message_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" uuid,
	"meeting_session_id" uuid,
	"sender_user_id" uuid NOT NULL,
	"receiver_user_id" uuid,
	"type" "chat_message_type" DEFAULT 'room' NOT NULL,
	"content" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_definitions" (
	"item_definition_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"default_state" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"width" integer DEFAULT 1 NOT NULL,
	"height" integer DEFAULT 1 NOT NULL,
	"is_interactive" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "item_definitions_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "meeting_action_items" (
	"meeting_action_item_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meeting_session_id" uuid NOT NULL,
	"assignee_user_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"is_completed" boolean DEFAULT false NOT NULL,
	"due_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meeting_notes" (
	"meeting_note_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meeting_session_id" uuid NOT NULL,
	"author_user_id" uuid,
	"content" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meeting_participants" (
	"meeting_session_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text DEFAULT 'participant' NOT NULL,
	"joined_at" timestamp with time zone,
	"left_at" timestamp with time zone,
	CONSTRAINT "meeting_participants_meeting_session_id_user_id_pk" PRIMARY KEY("meeting_session_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "meeting_sessions" (
	"meeting_session_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"room_id" uuid,
	"meeting_template_id" uuid,
	"call_session_id" uuid,
	"type" "meeting_type" NOT NULL,
	"title" text NOT NULL,
	"status" "meeting_session_status" DEFAULT 'draft' NOT NULL,
	"scheduled_for" timestamp with time zone,
	"started_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meeting_templates" (
	"meeting_template_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid,
	"type" "meeting_type" NOT NULL,
	"name" text NOT NULL,
	"agenda" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "players" (
	"player_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"display_name" text NOT NULL,
	"avatar_config" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "retro_cards" (
	"retro_card_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meeting_session_id" uuid NOT NULL,
	"author_user_id" uuid,
	"column" text NOT NULL,
	"content" text NOT NULL,
	"votes" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "room_members" (
	"room_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "room_role" DEFAULT 'viewer' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "room_members_room_id_user_id_pk" PRIMARY KEY("room_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "room_objects" (
	"room_object_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" uuid NOT NULL,
	"item_definition_id" uuid NOT NULL,
	"label" text,
	"position_x" integer NOT NULL,
	"position_y" integer NOT NULL,
	"rotation" integer DEFAULT 0 NOT NULL,
	"state" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_locked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "room_settings" (
	"room_id" uuid PRIMARY KEY NOT NULL,
	"theme" text DEFAULT 'default' NOT NULL,
	"background_color" text DEFAULT '#f8fafc' NOT NULL,
	"light_mode" text DEFAULT 'system' NOT NULL,
	"guest_access_enabled" boolean DEFAULT false NOT NULL,
	"chat_enabled" boolean DEFAULT true NOT NULL,
	"voice_enabled" boolean DEFAULT true NOT NULL,
	"video_enabled" boolean DEFAULT true NOT NULL,
	"screen_share_enabled" boolean DEFAULT true NOT NULL,
	"max_users" integer DEFAULT 50 NOT NULL,
	"spawn_point" jsonb DEFAULT '{"x":4,"y":4}'::jsonb NOT NULL,
	"navigation_grid" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"room_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"width" integer DEFAULT 16 NOT NULL,
	"height" integer DEFAULT 10 NOT NULL,
	"tile_size" integer DEFAULT 48 NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_members" (
	"workspace_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "workspace_role" DEFAULT 'member' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_members_workspace_id_user_id_pk" PRIMARY KEY("workspace_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"workspace_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workspaces_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "call_participants" ADD CONSTRAINT "call_participants_call_session_id_call_sessions_call_session_id_fk" FOREIGN KEY ("call_session_id") REFERENCES "public"."call_sessions"("call_session_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "call_participants" ADD CONSTRAINT "call_participants_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "call_sessions" ADD CONSTRAINT "call_sessions_room_id_rooms_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("room_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_room_id_rooms_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("room_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_meeting_session_id_meeting_sessions_meeting_session_id_fk" FOREIGN KEY ("meeting_session_id") REFERENCES "public"."meeting_sessions"("meeting_session_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_user_id_users_user_id_fk" FOREIGN KEY ("sender_user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_receiver_user_id_users_user_id_fk" FOREIGN KEY ("receiver_user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_action_items" ADD CONSTRAINT "meeting_action_items_meeting_session_id_meeting_sessions_meeting_session_id_fk" FOREIGN KEY ("meeting_session_id") REFERENCES "public"."meeting_sessions"("meeting_session_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_action_items" ADD CONSTRAINT "meeting_action_items_assignee_user_id_users_user_id_fk" FOREIGN KEY ("assignee_user_id") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_notes" ADD CONSTRAINT "meeting_notes_meeting_session_id_meeting_sessions_meeting_session_id_fk" FOREIGN KEY ("meeting_session_id") REFERENCES "public"."meeting_sessions"("meeting_session_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_notes" ADD CONSTRAINT "meeting_notes_author_user_id_users_user_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_participants" ADD CONSTRAINT "meeting_participants_meeting_session_id_meeting_sessions_meeting_session_id_fk" FOREIGN KEY ("meeting_session_id") REFERENCES "public"."meeting_sessions"("meeting_session_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_participants" ADD CONSTRAINT "meeting_participants_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_sessions" ADD CONSTRAINT "meeting_sessions_workspace_id_workspaces_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("workspace_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_sessions" ADD CONSTRAINT "meeting_sessions_room_id_rooms_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("room_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_sessions" ADD CONSTRAINT "meeting_sessions_meeting_template_id_meeting_templates_meeting_template_id_fk" FOREIGN KEY ("meeting_template_id") REFERENCES "public"."meeting_templates"("meeting_template_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_sessions" ADD CONSTRAINT "meeting_sessions_call_session_id_call_sessions_call_session_id_fk" FOREIGN KEY ("call_session_id") REFERENCES "public"."call_sessions"("call_session_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_templates" ADD CONSTRAINT "meeting_templates_workspace_id_workspaces_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("workspace_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "retro_cards" ADD CONSTRAINT "retro_cards_meeting_session_id_meeting_sessions_meeting_session_id_fk" FOREIGN KEY ("meeting_session_id") REFERENCES "public"."meeting_sessions"("meeting_session_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "retro_cards" ADD CONSTRAINT "retro_cards_author_user_id_users_user_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_members" ADD CONSTRAINT "room_members_room_id_rooms_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("room_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_members" ADD CONSTRAINT "room_members_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_objects" ADD CONSTRAINT "room_objects_room_id_rooms_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("room_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_objects" ADD CONSTRAINT "room_objects_item_definition_id_item_definitions_item_definition_id_fk" FOREIGN KEY ("item_definition_id") REFERENCES "public"."item_definitions"("item_definition_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_settings" ADD CONSTRAINT "room_settings_room_id_rooms_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("room_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_workspace_id_workspaces_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("workspace_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_workspaces_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("workspace_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;