<template>
  <div class="questions">
    <h1>The Quiz</h1>
    <div
      class="word-group-container"
      v-if="store.groupNumber !== groups.length"
    >
      <el-progress
        :percentage="progressValue"
        :format="getProgressLabel"
        striped
      />
      <p>Select one word or phrase:</p>
      <TransitionGroup class="q-list" name="list" tag="ul">
        <el-button
          v-for="(item, index) in currentGroup"
          :key="`${item.id}-${index}`"
          :variant="isWordSelected(item) ? 'success' : 'primary'"
          text
          @click.prevent="onSelectWord(item)"
        >
          {{ item.word }}
        </el-button>
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
import { TestWordGroup, TestWord } from "../../types";
import { usePersonalityTestStore } from "../store/test";

const store = usePersonalityTestStore();

let currentGroup = ref<TestWordGroup | null>(null);
let progressValue = ref(0);
const groups = questionGroups;

const setProgress = () => {
  if (store.groupNumber === -1) {
    store.setGroupNumber(0);
    return;
  }

  currentGroup.value = groups[store.groupNumber];
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
.questions {
  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: var(--el-bg-color);
  border: var(--el-border);

  margin: 2rem 2rem;
}

.q-list {
  width: 1200px;
  display: flex;
  flex-direction: column;
}

.word-group-container {
  display: flex;
  flex-direction: column;
  padding: 2rem 0 0 0;
}

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
