export type EffectsPreference = "auto" | "off";
export type EffectsPolicy = { ambient: boolean; pointer: boolean };
export type EffectsConditions = {
  preference: EffectsPreference;
  reducedMotion: boolean;
  finePointer: boolean;
  hover: boolean;
  visible: boolean;
  documentVisible: boolean;
};

export function resolveEffectsPolicy({ preference, reducedMotion, finePointer, hover, visible, documentVisible }: EffectsConditions): EffectsPolicy {
  const ambient = preference === "auto" && !reducedMotion && visible && documentVisible;
  return { ambient, pointer: ambient && finePointer && hover };
}
