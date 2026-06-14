export type MockWorkspace = {
  id: string;
  name: string;
  slug: string;
  description: string;
  translationKey: "productTown" | "engineeringHub" | "retroSquare";
  memberCount: number;
  roomCount: number;
  defaultRoomId: string;
};

export const mockWorkspaces: MockWorkspace[] = [
  {
    id: "workspace-product-town",
    name: "Product Town",
    slug: "product-town",
    description:
      "Cidade mockada para discovery, planning e revisões de produto.",
    translationKey: "productTown",
    memberCount: 18,
    roomCount: 5,
    defaultRoomId: "product-main-room",
  },
  {
    id: "workspace-engineering-hub",
    name: "Engineering Hub",
    slug: "engineering-hub",
    description:
      "Espaço para daily, pair programming e acompanhamento técnico do time.",
    translationKey: "engineeringHub",
    memberCount: 32,
    roomCount: 8,
    defaultRoomId: "engineering-main-room",
  },
  {
    id: "workspace-retro-square",
    name: "Retro Square",
    slug: "retro-square",
    description:
      "Ambiente dedicado a retrospectivas, action items e melhorias contínuas.",
    translationKey: "retroSquare",
    memberCount: 11,
    roomCount: 3,
    defaultRoomId: "retro-main-room",
  },
];

export function getMockWorkspaceBySlug(
  slug: string,
): MockWorkspace | undefined {
  return mockWorkspaces.find((workspace) => workspace.slug === slug);
}
