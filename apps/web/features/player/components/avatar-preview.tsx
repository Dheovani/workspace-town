import type { AvatarConfig } from "@/features/room/types";
import { cn } from "@/lib/utils";

type AvatarPreviewProps = {
  config: AvatarConfig;
  className?: string;
};

export function AvatarPreview({ config, className }: AvatarPreviewProps) {
  return (
    <div
      className={cn(
        "relative h-28 w-24 shrink-0 overflow-hidden rounded-md border border-emerald-900/10 bg-emerald-50",
        className,
      )}
      aria-hidden="true"
    >
      <span className="absolute inset-x-0 bottom-0 h-9 bg-emerald-100/70" />
      <span className="absolute bottom-2 left-1/2 h-2 w-14 -translate-x-1/2 rounded-full bg-slate-900/15 blur-[1px]" />

      <span
        className="absolute bottom-4 left-[31px] h-7 w-3 rounded-b-sm border border-slate-800"
        style={{ backgroundColor: config.pantsColor }}
      />
      <span
        className="absolute bottom-4 right-[31px] h-7 w-3 rounded-b-sm border border-slate-800"
        style={{ backgroundColor: config.pantsColor }}
      />
      <span
        className="absolute bottom-3 left-[27px] h-3 w-5 rounded-sm border border-slate-800"
        style={{ backgroundColor: config.shoeColor }}
      />
      <span
        className="absolute bottom-3 right-[27px] h-3 w-5 rounded-sm border border-slate-800"
        style={{ backgroundColor: config.shoeColor }}
      />

      {config.shirtStyle === "hoodie" ? (
        <span
          className="absolute bottom-[57px] left-1/2 size-9 -translate-x-1/2 rounded-full border border-slate-800"
          style={{ backgroundColor: config.shirtColor }}
        />
      ) : null}
      <span
        className="absolute bottom-[35px] left-[20px] h-9 w-3 rotate-[7deg] rounded-b-md border border-slate-800"
        style={{ backgroundColor: config.shirtColor }}
      />
      <span
        className="absolute bottom-[35px] right-[20px] h-9 w-3 -rotate-[7deg] rounded-b-md border border-slate-800"
        style={{ backgroundColor: config.shirtColor }}
      />
      <span
        className={cn(
          "absolute bottom-[36px] left-1/2 h-10 w-10 -translate-x-1/2 border border-slate-800",
          config.shirtStyle === "tshirt" &&
            "[clip-path:polygon(14%_0,86%_0,100%_18%,87%_38%,82%_100%,18%_100%,13%_38%,0_18%)]",
          config.shirtStyle === "hoodie" && "rounded-t-md",
          config.shirtStyle === "jacket" &&
            "[clip-path:polygon(15%_0,85%_0,100%_20%,87%_38%,84%_100%,16%_100%,13%_38%,0_20%)]",
        )}
        style={{ backgroundColor: config.shirtColor }}
      />
      {config.shirtStyle === "jacket" ? (
        <span className="absolute bottom-[36px] left-1/2 h-9 w-px -translate-x-1/2 bg-slate-800" />
      ) : null}

      <span
        className="absolute bottom-[68px] left-1/2 h-9 w-8 -translate-x-1/2 rounded-[42%] border border-slate-800"
        style={{ backgroundColor: config.skinTone }}
      >
        <span className="absolute left-[7px] top-[14px] size-1 rounded-full bg-slate-900" />
        <span className="absolute right-[7px] top-[14px] size-1 rounded-full bg-slate-900" />
        <span
          className={cn(
            "absolute bottom-[6px] left-1/2 h-1.5 w-3 -translate-x-1/2 border-b-2 border-slate-800",
            config.faceStyle === "smile" && "rounded-b-full",
            config.faceStyle === "neutral" && "h-0",
            config.faceStyle === "focused" && "rotate-[-8deg]",
          )}
        />
      </span>
      <span
        className={cn(
          "absolute left-1/2 -translate-x-1/2 border border-slate-800",
          config.hairStyle === "short" &&
            "bottom-[94px] h-3 w-8 rounded-t-[50%]",
          config.hairStyle === "spiky" &&
            "bottom-[94px] h-5 w-10 [clip-path:polygon(0_100%,10%_35%,25%_65%,40%_0,58%_60%,78%_15%,100%_100%)]",
          config.hairStyle === "bob" &&
            "bottom-[68px] h-10 w-10 rounded-t-[50%] [clip-path:polygon(0_0,100%_0,100%_100%,78%_100%,78%_35%,22%_35%,22%_100%,0_100%)]",
        )}
        style={{ backgroundColor: config.hairColor }}
      />
    </div>
  );
}
