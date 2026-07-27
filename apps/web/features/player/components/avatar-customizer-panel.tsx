"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoomStore } from "@/features/room/stores/room-store";
import type { AvatarConfig } from "@/features/room/types";
import { cn } from "@/lib/utils";

const skinTones = [
  { color: "#f8d7bd", name: "light", foreground: "text-slate-950" },
  { color: "#e5b085", name: "warm", foreground: "text-slate-950" },
  { color: "#d49a6a", name: "tan", foreground: "text-slate-950" },
  { color: "#9a6545", name: "brown", foreground: "text-white" },
  { color: "#5c3a2b", name: "deep", foreground: "text-white" },
] as const;

const hairColors = [
  { color: "#1f2937", name: "black", foreground: "text-white" },
  { color: "#5b3a29", name: "brownHair", foreground: "text-white" },
  { color: "#d8b35a", name: "blond", foreground: "text-slate-950" },
  { color: "#9f3f2d", name: "red", foreground: "text-white" },
  { color: "#355c9a", name: "blue", foreground: "text-white" },
] as const;

const shirtColors = [
  { color: "#38bdf8", name: "sky", foreground: "text-slate-950" },
  { color: "#2dd4bf", name: "teal", foreground: "text-slate-950" },
  { color: "#fb7185", name: "coral", foreground: "text-slate-950" },
  { color: "#fbbf24", name: "amber", foreground: "text-slate-950" },
  { color: "#a78bfa", name: "violet", foreground: "text-slate-950" },
] as const;

const pantsColors = [
  { color: "#334155", name: "graphite", foreground: "text-white" },
  { color: "#1e3a8a", name: "navy", foreground: "text-white" },
  { color: "#475569", name: "gray", foreground: "text-white" },
  { color: "#881337", name: "burgundy", foreground: "text-white" },
  { color: "#3f6212", name: "olive", foreground: "text-white" },
] as const;

const shoeColors = [
  { color: "#f8fafc", name: "white", foreground: "text-slate-950" },
  { color: "#1f2937", name: "black", foreground: "text-white" },
  { color: "#ef4444", name: "red", foreground: "text-white" },
  { color: "#fbbf24", name: "amber", foreground: "text-slate-950" },
] as const;

const hairStyles: AvatarConfig["hairStyle"][] = ["short", "spiky", "bob"];
const faceStyles: AvatarConfig["faceStyle"][] = ["neutral", "smile", "focused"];
const shirtStyles: AvatarConfig["shirtStyle"][] = [
  "tshirt",
  "hoodie",
  "jacket",
];

type ColorOption =
  | (typeof skinTones)[number]
  | (typeof hairColors)[number]
  | (typeof shirtColors)[number]
  | (typeof pantsColors)[number]
  | (typeof shoeColors)[number];

type ColorSwatchesProps = {
  label: string;
  options: readonly ColorOption[];
  selectedColor: string;
  selectLabel: (colorName: string) => string;
  onSelect: (color: string) => void;
};

function ColorSwatches({
  label,
  options,
  selectedColor,
  selectLabel,
  onSelect,
}: ColorSwatchesProps) {
  return (
    <fieldset>
      <legend className="text-xs font-medium text-muted-foreground">
        {label}
      </legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option.color === selectedColor;

          return (
            <button
              key={option.color}
              type="button"
              className={cn(
                "grid size-8 place-items-center rounded-full border border-black/15 shadow-sm transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected && "ring-2 ring-teal-800 ring-offset-2",
              )}
              style={{ backgroundColor: option.color }}
              aria-label={selectLabel(option.name)}
              aria-pressed={isSelected}
              title={selectLabel(option.name)}
              onClick={() => onSelect(option.color)}
            >
              {isSelected ? (
                <Check
                  className={cn("size-4", option.foreground)}
                  strokeWidth={3}
                  aria-hidden="true"
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

type StyleOptionsProps<T extends string> = {
  label: string;
  options: readonly T[];
  selectedOption: T;
  optionLabel: (option: T) => string;
  renderThumbnail: (option: T) => React.ReactNode;
  onSelect: (option: T) => void;
};

function StyleOptions<T extends string>({
  label,
  options,
  selectedOption,
  optionLabel,
  renderThumbnail,
  onSelect,
}: StyleOptionsProps<T>) {
  return (
    <fieldset>
      <legend className="text-xs font-medium text-muted-foreground">
        {label}
      </legend>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {options.map((option) => {
          const isSelected = option === selectedOption;

          return (
            <button
              key={option}
              type="button"
              className={cn(
                "grid min-w-0 place-items-center gap-1 rounded-md border bg-background px-1 py-2 text-[11px] font-medium transition hover:border-teal-500 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected &&
                  "border-teal-700 bg-teal-50 text-teal-950 shadow-sm",
              )}
              aria-pressed={isSelected}
              onClick={() => onSelect(option)}
            >
              {renderThumbnail(option)}
              <span className="max-w-full truncate">{optionLabel(option)}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function HairThumbnail({
  config,
  style,
}: {
  config: AvatarConfig;
  style: AvatarConfig["hairStyle"];
}) {
  return (
    <span className="relative block h-10 w-9" aria-hidden="true">
      <span
        className="absolute bottom-0 left-1/2 h-8 w-7 -translate-x-1/2 rounded-[45%] border border-slate-700"
        style={{ backgroundColor: config.skinTone }}
      />
      <span
        className={cn(
          "absolute left-1/2 -translate-x-1/2 border border-slate-800",
          style === "short" && "top-0 h-3 w-7 rounded-t-[50%]",
          style === "spiky" &&
            "top-0 h-4 w-8 [clip-path:polygon(0_100%,10%_30%,25%_65%,40%_0,58%_60%,78%_15%,100%_100%)]",
          style === "bob" && "top-0 h-8 w-9 rounded-t-[50%]",
        )}
        style={{ backgroundColor: config.hairColor }}
      />
      {style === "bob" ? (
        <span
          className="absolute bottom-0 left-1/2 h-6 w-6 -translate-x-1/2 rounded-[45%]"
          style={{ backgroundColor: config.skinTone }}
        />
      ) : null}
    </span>
  );
}

function FaceThumbnail({
  config,
  expression,
}: {
  config: AvatarConfig;
  expression: AvatarConfig["faceStyle"];
}) {
  return (
    <span
      className="relative block size-9 rounded-[45%] border border-slate-700"
      style={{ backgroundColor: config.skinTone }}
      aria-hidden="true"
    >
      <span className="absolute left-2 top-3 size-1 rounded-full bg-slate-900" />
      <span className="absolute right-2 top-3 size-1 rounded-full bg-slate-900" />
      <span
        className={cn(
          "absolute bottom-2 left-1/2 h-1.5 w-3 -translate-x-1/2 border-b-2 border-slate-800",
          expression === "smile" && "rounded-b-full",
          expression === "neutral" && "h-0",
          expression === "focused" && "rotate-[-8deg]",
        )}
      />
    </span>
  );
}

function ShirtThumbnail({
  color,
  style,
}: {
  color: string;
  style: AvatarConfig["shirtStyle"];
}) {
  return (
    <span className="relative block h-10 w-10" aria-hidden="true">
      {style === "hoodie" ? (
        <span
          className="absolute left-1/2 top-0 size-5 -translate-x-1/2 rounded-full border border-slate-700"
          style={{ backgroundColor: color }}
        />
      ) : null}
      <span
        className={cn(
          "absolute bottom-0 left-1/2 h-8 w-8 -translate-x-1/2 border border-slate-700",
          style === "tshirt" &&
            "[clip-path:polygon(18%_0,82%_0,100%_25%,82%_42%,78%_100%,22%_100%,18%_42%,0_25%)]",
          style === "hoodie" && "rounded-t-md",
          style === "jacket" &&
            "[clip-path:polygon(18%_0,82%_0,100%_22%,84%_38%,82%_100%,18%_100%,16%_38%,0_22%)]",
        )}
        style={{ backgroundColor: color }}
      />
      {style === "jacket" ? (
        <span className="absolute bottom-0 left-1/2 h-7 w-px -translate-x-1/2 bg-slate-700" />
      ) : null}
    </span>
  );
}

export function AvatarCustomizerPanel() {
  const t = useTranslations("room.avatar");
  const avatarConfig = useRoomStore((state) => state.localPlayer.avatarConfig);
  const roomMode = useRoomStore((state) => state.roomMode);
  const updateLocalAvatar = useRoomStore((state) => state.updateLocalAvatar);

  const updateAvatar = (patch: Partial<AvatarConfig>) => {
    updateLocalAvatar({
      ...avatarConfig,
      ...patch,
    });
  };

  if (roomMode !== "user") {
    return null;
  }

  const colorLabel = (colorName: string) =>
    t("selectColor", { color: t(`colors.${colorName}`) });

  return (
    <section className="border-b p-4">
      <h2 className="text-base font-semibold">{t("title")}</h2>
      <Tabs defaultValue="character" className="mt-3">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="character">{t("tabs.character")}</TabsTrigger>
          <TabsTrigger value="outfit">{t("tabs.outfit")}</TabsTrigger>
        </TabsList>
        <TabsContent value="character" className="mt-4 grid gap-5">
          <StyleOptions
            label={t("hairStyle")}
            options={hairStyles}
            selectedOption={avatarConfig.hairStyle}
            optionLabel={(option) => t(`styles.hair.${option}`)}
            renderThumbnail={(option) => (
              <HairThumbnail config={avatarConfig} style={option} />
            )}
            onSelect={(hairStyle) => updateAvatar({ hairStyle })}
          />
          <StyleOptions
            label={t("faceStyle")}
            options={faceStyles}
            selectedOption={avatarConfig.faceStyle}
            optionLabel={(option) => t(`styles.face.${option}`)}
            renderThumbnail={(option) => (
              <FaceThumbnail config={avatarConfig} expression={option} />
            )}
            onSelect={(faceStyle) => updateAvatar({ faceStyle })}
          />
          <ColorSwatches
            label={t("skinTone")}
            options={skinTones}
            selectedColor={avatarConfig.skinTone}
            selectLabel={colorLabel}
            onSelect={(skinTone) => updateAvatar({ skinTone })}
          />
          <ColorSwatches
            label={t("hairColor")}
            options={hairColors}
            selectedColor={avatarConfig.hairColor}
            selectLabel={colorLabel}
            onSelect={(hairColor) => updateAvatar({ hairColor })}
          />
        </TabsContent>
        <TabsContent value="outfit" className="mt-4 grid gap-5">
          <StyleOptions
            label={t("shirtStyle")}
            options={shirtStyles}
            selectedOption={avatarConfig.shirtStyle}
            optionLabel={(option) => t(`styles.shirt.${option}`)}
            renderThumbnail={(option) => (
              <ShirtThumbnail color={avatarConfig.shirtColor} style={option} />
            )}
            onSelect={(shirtStyle) => updateAvatar({ shirtStyle })}
          />
          <ColorSwatches
            label={t("shirtColor")}
            options={shirtColors}
            selectedColor={avatarConfig.shirtColor}
            selectLabel={colorLabel}
            onSelect={(shirtColor) => updateAvatar({ shirtColor })}
          />
          <ColorSwatches
            label={t("pantsColor")}
            options={pantsColors}
            selectedColor={avatarConfig.pantsColor}
            selectLabel={colorLabel}
            onSelect={(pantsColor) => updateAvatar({ pantsColor })}
          />
          <ColorSwatches
            label={t("shoeColor")}
            options={shoeColors}
            selectedColor={avatarConfig.shoeColor}
            selectLabel={colorLabel}
            onSelect={(shoeColor) => updateAvatar({ shoeColor })}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
