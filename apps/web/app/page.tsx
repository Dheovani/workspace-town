import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-8 px-6 py-12">
        <div className="max-w-2xl space-y-5">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Workspace Town MVP
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            A shared virtual room for software teams to gather, move, and meet.
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Start with a local PixiJS room prototype, a movable player, and clean
            domain boundaries for rooms, calls, and meeting workflows.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/rooms/demo">Enter demo room</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/api/livekit/token">LiveKit token route</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
