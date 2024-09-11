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
    buildTestResult(num: number, signs: string) {
      // const item = this.selection[key].find(
      //   (groupItem) => groupItem.id === value
      // );
      // if (!item) {
      //   return;
      // }
      // const colorEnumKey: PersonalityColor = item;
      // result.value[colorEnumKey] += 1;
    },
  },
});

export function setupPersonalityTestStore() {
  return usePersonalityTestStore();
}
