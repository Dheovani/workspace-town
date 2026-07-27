import type { ItemDefinition, Player, Room, RoomObject } from "../types";
import { findRoomPath } from "../domain/find-room-path";
import { createPlayerMove, type PlayerMove } from "../domain/player-movement";

type NavigationState = {
  room: Room;
  localPlayer: Player;
  objects: RoomObject[];
  isEditing: boolean;
  moveLocalPlayer: (move: PlayerMove) => void;
};

type IntervalHandle = ReturnType<typeof setInterval>;

type RoomNavigationControllerOptions = {
  getState: () => NavigationState;
  itemDefinitions: ItemDefinition[];
  onDestinationChange: (destination: { x: number; y: number } | null) => void;
  stepMilliseconds?: number;
  scheduleInterval?: (
    callback: () => void,
    milliseconds: number,
  ) => IntervalHandle;
  cancelInterval?: (handle: IntervalHandle) => void;
};

const DEFAULT_STEP_MILLISECONDS = 140;

export class RoomNavigationController {
  private path: { x: number; y: number }[] = [];
  private timer: IntervalHandle | null = null;
  private destinationActive = false;

  constructor(private readonly options: RoomNavigationControllerOptions) {}

  moveTo(destination: { x: number; y: number }): boolean {
    this.cancel();

    const state = this.options.getState();

    if (state.isEditing) {
      return false;
    }

    this.path = findRoomPath({
      room: state.room,
      objects: state.objects,
      itemDefinitions: this.options.itemDefinitions,
      start: state.localPlayer.position,
      destination,
    });

    if (this.path.length === 0) {
      return false;
    }

    this.options.onDestinationChange(destination);
    this.destinationActive = true;

    if (!this.advance()) {
      return false;
    }

    const scheduleInterval = this.options.scheduleInterval ?? setInterval;
    this.timer = scheduleInterval(
      () => this.advance(),
      this.options.stepMilliseconds ?? DEFAULT_STEP_MILLISECONDS,
    );

    return true;
  }

  cancel(): void {
    this.path = [];

    if (this.timer !== null) {
      const cancelInterval = this.options.cancelInterval ?? clearInterval;
      cancelInterval(this.timer);
      this.timer = null;
    }

    if (this.destinationActive) {
      this.destinationActive = false;
      this.options.onDestinationChange(null);
    }
  }

  private advance(): boolean {
    const next = this.path.shift();

    if (!next) {
      this.cancel();
      return false;
    }

    const state = this.options.getState();
    const move = createPlayerMove(state.localPlayer.position, next);

    if (!move) {
      this.cancel();
      return false;
    }

    state.moveLocalPlayer(move);

    const updatedPosition = this.options.getState().localPlayer.position;
    const reachedStep =
      updatedPosition.x === next.x && updatedPosition.y === next.y;

    if (!reachedStep) {
      this.cancel();
    }

    return reachedStep;
  }
}
