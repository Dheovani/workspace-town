"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRoomStore } from "@/features/room/stores/room-store";
import {
  avatarFaceStyleSchema,
  avatarHairStyleSchema,
  avatarShirtStyleSchema,
  type AvatarConfig,
} from "@/features/room/types";
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

const hairStyles = ["short", "spiky", "bob"] as const;
const faceStyles = ["neutral", "smile", "focused"] as const;
const shirtStyles = ["tshirt", "hoodie", "jacket"] as const;

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
                "grid size-7 place-items-center rounded-full border border-black/15 shadow-sm transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected && "ring-2 ring-foreground ring-offset-2",
              )}
              style={{ backgroundColor: option.color }}
              aria-label={selectLabel(option.name)}
              aria-pressed={isSelected}
              title={selectLabel(option.name)}
              onClick={() => onSelect(option.color)}
            >
              {isSelected ? (
                <Check
                  className={cn("size-3.5", option.foreground)}
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

type StyleSelectProps = {
  label: string;
  value: string;
  options: readonly string[];
  optionLabel: (option: string) => string;
  onChange: (value: string) => void;
};

function StyleSelect({
  label,
  value,
  options,
  optionLabel,
  onChange,
}: StyleSelectProps) {
  return (
    <label className="grid gap-1.5 text-xs font-medium text-muted-foreground">
      {label}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-background text-foreground">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {optionLabel(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

export function AvatarCustomizerPanel() {
  const t = useTranslations("room.avatar");
  const avatarConfig = useRoomStore((state) => state.localPlayer.avatarConfig);
  const updateLocalAvatar = useRoomStore((state) => state.updateLocalAvatar);

  const updateAvatar = (patch: Partial<AvatarConfig>) => {
    updateLocalAvatar({
      ...avatarConfig,
      ...patch,
    });
  };

  return (
    <section className="border-b p-4">
      <h2 className="text-base font-semibold">{t("title")}</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <StyleSelect
          label={t("hairStyle")}
          value={avatarConfig.hairStyle}
          options={hairStyles}
          optionLabel={(option) => t(`styles.hair.${option}`)}
          onChange={(value) =>
            updateAvatar({ hairStyle: avatarHairStyleSchema.parse(value) })
          }
        />
        <StyleSelect
          label={t("faceStyle")}
          value={avatarConfig.faceStyle}
          options={faceStyles}
          optionLabel={(option) => t(`styles.face.${option}`)}
          onChange={(value) =>
            updateAvatar({ faceStyle: avatarFaceStyleSchema.parse(value) })
          }
        />
        <div className="col-span-2">
          <StyleSelect
            label={t("shirtStyle")}
            value={avatarConfig.shirtStyle}
            options={shirtStyles}
            optionLabel={(option) => t(`styles.shirt.${option}`)}
            onChange={(value) =>
              updateAvatar({ shirtStyle: avatarShirtStyleSchema.parse(value) })
            }
          />
        </div>
      </div>
      <div className="mt-4 grid gap-4">
        <ColorSwatches
          label={t("skinTone")}
          options={skinTones}
          selectedColor={avatarConfig.skinTone}
          selectLabel={(colorName) =>
            t("selectColor", { color: t(`colors.${colorName}`) })
          }
          onSelect={(skinTone) => updateAvatar({ skinTone })}
        />
        <ColorSwatches
          label={t("hairColor")}
          options={hairColors}
          selectedColor={avatarConfig.hairColor}
          selectLabel={(colorName) =>
            t("selectColor", { color: t(`colors.${colorName}`) })
          }
          onSelect={(hairColor) => updateAvatar({ hairColor })}
        />
        <ColorSwatches
          label={t("shirtColor")}
          options={shirtColors}
          selectedColor={avatarConfig.shirtColor}
          selectLabel={(colorName) =>
            t("selectColor", { color: t(`colors.${colorName}`) })
          }
          onSelect={(shirtColor) => updateAvatar({ shirtColor })}
        />
        <ColorSwatches
          label={t("pantsColor")}
          options={pantsColors}
          selectedColor={avatarConfig.pantsColor}
          selectLabel={(colorName) =>
            t("selectColor", { color: t(`colors.${colorName}`) })
          }
          onSelect={(pantsColor) => updateAvatar({ pantsColor })}
        />
        <ColorSwatches
          label={t("shoeColor")}
          options={shoeColors}
          selectedColor={avatarConfig.shoeColor}
          selectLabel={(colorName) =>
            t("selectColor", { color: t(`colors.${colorName}`) })
          }
          onSelect={(shoeColor) => updateAvatar({ shoeColor })}
        />
      </div>
    </section>
  );
}
