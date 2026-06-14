import Link from "next/link";
import { RoomCanvas } from "@/features/room/components/room-canvas";
import { RoomStatusPanel } from "@/features/room/components/room-status-panel";

export default function DemoRoomPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-6 text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <header className="flex flex-col justify-between gap-3 border-b pb-5 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Workspace Town
            </Link>
            <h1 className="mt-2 text-3xl font-semibold">Demo Room</h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Move with arrow keys or WASD. This is local-only presence for the
            MVP foundation.
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <RoomCanvas />
          <RoomStatusPanel />
        </div>
      </div>
    </main>
  );
}
