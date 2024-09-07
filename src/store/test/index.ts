import { defineStore } from "pinia";
import {
  PersonalityTestState,
  RootState,
  AddSelectionPayload,
} from "../../../types";

export const usePersonalityTestStore = defineStore("personalityTest", {
  state: (): PersonalityTestState => ({
    startedAt: null,
    groupNumber: -1,
    selection: new Map<number, number>(),
  }),

  getters: {},
  actions: {
    setGroupNumber(payload: number) {
      this.groupNumber = payload;
    },
    addSelection(payload: AddSelectionPayload) {
      this.selection.set(payload.groupId, payload.value);
    },
  },
});

export function setupPersonalityTestStore() {
  return usePersonalityTestStore();
}
