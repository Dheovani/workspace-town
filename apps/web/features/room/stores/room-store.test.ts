import { beforeEach, describe, expect, test } from "bun:test";
import { useRoomStore } from "./room-store";

const initialState = useRoomStore.getState();

beforeEach(() => {
  useRoomStore.setState({
    localPlayer: initialState.localPlayer,
    objects: initialState.objects,
    isEditing: false,
    selectedItemDefinitionId: null,
    selectedObjectId: null,
  });
});

describe("room store movement integration", () => {
  test("stops the local player before the blocking demo table", () => {
    const moveRight = () =>
      useRoomStore
        .getState()
        .moveLocalPlayer({ dx: 1, dy: 0, direction: "right" });

    moveRight();
    moveRight();
    moveRight();
    moveRight();

    expect(useRoomStore.getState().localPlayer.position).toEqual({
      x: 7,
      y: 4,
    });
    expect(useRoomStore.getState().localPlayer.direction).toBe("right");
  });

  test("does not place an editor object on the local player", () => {
    const store = useRoomStore.getState();
    const initialObjectCount = store.objects.length;

    store.setEditing(true);
    useRoomStore.getState().selectItemDefinition("chair");
    useRoomStore
      .getState()
      .placeSelectionAt(useRoomStore.getState().localPlayer.position);

    expect(useRoomStore.getState().objects).toHaveLength(initialObjectCount);
  });
});

describe("room store avatar integration", () => {
  test("updates the avatar appearance without changing player identity or position", () => {
    const playerBeforeUpdate = useRoomStore.getState().localPlayer;

    useRoomStore.getState().updateLocalAvatar({
      ...playerBeforeUpdate.avatarConfig,
      hairStyle: "bob",
      shirtColor: "#fb7185",
      pantsColor: "#1e3a8a",
    });

    const playerAfterUpdate = useRoomStore.getState().localPlayer;

    expect(playerAfterUpdate.avatarConfig).toEqual({
      ...playerBeforeUpdate.avatarConfig,
      hairStyle: "bob",
      shirtColor: "#fb7185",
      pantsColor: "#1e3a8a",
    });
    expect(playerAfterUpdate.id).toBe(playerBeforeUpdate.id);
    expect(playerAfterUpdate.position).toEqual(playerBeforeUpdate.position);
  });
});
