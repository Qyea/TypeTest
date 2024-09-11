<template>
  <div class="questions">
    <h1>Тест на тип личности (IDE версия)</h1>
    <div
      class="word-group-container"
      v-if="store.groupNumber !== groups.length"
    >
      <el-progress
        :percentage="progressValue"
        :format="getProgressLabel"
        striped
      />

      <p>{{ currentGroup?.question }}</p>

      <TransitionGroup class="q-list" name="list" tag="ul">
        <button
          v-for="(item, index) in currentGroup?.options"
          :key="`${item.id}-${index}`"
          @click="onSelectWord(item)"
        >
          {{ item.word }}
        </button>
      </TransitionGroup>
    </div>
    <personality-test-result-view
      v-if="store.groupNumber === groups.length"
      :response="store.selection"
      :groups="groups"
      v-on:review-test="onReviewTest"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

import { questionGroups } from "./../data/questions";
import PersonalityTestResultView from "./TestResult.vue";
import { TestWord, TestQuestion } from "../../types";
import { usePersonalityTestStore } from "../store/test";

const store = usePersonalityTestStore();

let currentGroup = ref<TestQuestion | null>(null);
let progressValue = ref(0);
const groups = questionGroups;

const setProgress = () => {
  if (store.groupNumber === -1) {
    store.setGroupNumber(0);
    return;
  }

  currentGroup.value = groups[store.groupNumber] ?? null;
  progressValue.value = parseFloat(
    (((store.groupNumber + 1) / groups.length) * 100).toFixed(2)
  );
};

const onReviewTest = () => {
  store.setGroupNumber(0);
};

const getProgressLabel = () => {
  if (store.groupNumber >= groups.length) {
    return "Finished";
  }

  return `${store.groupNumber + 1} / ${groups.length}`;
};

const onSelectWord = (item: TestWord) => {
  store.addSelection({ groupId: store.groupNumber, value: item.id });
  store.setGroupNumber(store.groupNumber + 1);
};

const isWordSelected = (item: TestWord) => {
  return (
    Array.from(store.selection.entries()).find(
      ([key, value]) => value === item.id
    ) !== undefined
  );
};

watch(
  () => store.groupNumber,
  () => {
    setProgress();
  }
);
onMounted(() => {
  setProgress();
});
</script>

<style lang="scss" scoped>
// .questions {
//   display: flex;
//   flex-direction: column;
//   align-items: center;

//   background-color: var(--el-bg-color);
//   border: var(--el-border);

//   margin: 2rem 2rem;
// }

.q-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

// .word-group-container {
//   display: flex;
//   flex-direction: column;
//   padding: 2rem 0 0 0;
// }

.list-enter-active {
  transition: opacity 1.2s;
}

.list-enter {
  opacity: 0;
}

.list-leave,
.list-leave-active,
.list-leave-to {
  opacity: 0;
  position: absolute;
}
</style>
