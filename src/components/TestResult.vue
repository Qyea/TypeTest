<template>
  <div class="results">
    <!-- <h5>Your profile</h5> -->
    <!-- <div class="chart-container mx-auto">
      <doughnut-chart :chart-data="chartData" :options="chartOptions" />
    </div> -->

    <div class="result-info">
      <h5>Your dominant color is {{ dominantColor }}</h5>
      <!-- <a href="#" @click.prevent="() => (triggerReview = true)"
        >Review your answers</a
      > -->
    </div>

    <el-tabs v-model="activeColor" tab-position="top">
      <el-tab-pane
        v-for="(color, index) in Tabs"
        :key="index"
        :name="color.value"
        ><template #label>
          <span :class="`personality-test-${color.value.toLowerCase()}`">{{
            color.value.toUpperCase()
          }}</span>
        </template>

        <component :is="color.tab" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits } from "vue";
import { useVModel } from "@vueuse/core";
// import DoughnutChart from "@/components/DoughnutChart.vue";
import RedMeaning from "./PersonalityColorMeaning/Red.vue";
import BlueMeaning from "./PersonalityColorMeaning/Blue.vue";
import GreenMeaning from "./PersonalityColorMeaning/Green.vue";
import YellowMeaning from "./PersonalityColorMeaning/Yellow.vue";

import {
  PersonalityTestResponse,
  PersonalityTestResult,
  PersonalityColor,
  TestWordGroup,
} from "../../types";

const Tabs = [
  {
    value: "red",
    tab: RedMeaning,
  },
  {
    value: "blue",
    tab: BlueMeaning,
  },
  {
    value: "green",
    tab: GreenMeaning,
  },
  {
    value: "yellow",
    tab: YellowMeaning,
  },
];

const props = defineProps<{
  groups: TestWordGroup[];
  response: PersonalityTestResponse;
}>();

const result = ref<PersonalityTestResult>({
  [PersonalityColor.Red]: 0,
  [PersonalityColor.Green]: 0,
  [PersonalityColor.Blue]: 0,
  [PersonalityColor.Yellow]: 0,
});

let dominantColor = ref<PersonalityColor>();

const activeColor = ref<string>("red");

let chartData = ref<Record<string, unknown>>();

let personalityColors = ref<string[]>([]);

const chartOptions = {
  legend: {
    display: false,
  },
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    datalabels: {
      color: "#fff",
    },
  },
};

const buildTestResult = () => {
  props.response.forEach((value, key) => {
    const item = props.groups[key].find((groupItem) => groupItem.id === value);

    if (!item) {
      return;
    }

    //const colorEnumKey: PersonalityColor = item;
    //result.value[colorEnumKey] += 1;
  });

  const keys = Object.keys(result.value) as PersonalityColor[];
  keys.sort((a, b) => result.value[b] - result.value[a]);
  dominantColor.value = keys[0];
};

const isColorDominant = (color: string) => dominantColor.value === color;

const getKeyResultByOrder = () => {
  const keys = Object.keys(result.value) as PersonalityColor[];
  keys.sort((a, b) => result.value[b] - result.value[a]);
  return keys;
};

const fillChartData = () => {
  const colors = {
    [PersonalityColor.Red]: "#FF4136",
    [PersonalityColor.Green]: "#2ECC40",
    [PersonalityColor.Blue]: "#0074D9",
    [PersonalityColor.Yellow]: "#FFDC00",
  };

  const keys = getKeyResultByOrder();

  const chartKeys = keys.filter((k: PersonalityColor) => result.value[k] > 0);

  chartData.value = {
    labels: chartKeys,
    datasets: [
      {
        backgroundColor: chartKeys.map(
          (k: PersonalityColor) => colors[k] || "#ddd"
        ),
        data: chartKeys.map((k) => result.value[k]),
      },
    ],
  };
};

onMounted(() => {
  buildTestResult();
  fillChartData();
  personalityColors.value = Object.keys(result.value);
  if (dominantColor.value)
    activeColor.value = dominantColor.value.toLocaleLowerCase();
});
</script>

<style lang="scss" scoped>
.chart-container {
  width: 200px;
  height: 200px;
}

.results {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  padding: 1rem 2rem;
}

.result-info {
  text-align: center;
}

// .personality-test-red {
//   color: #e65b54;
// }

// .personality-test-blue {
//   color: #69b8fd;
// }

// .personality-test-green {
//   color: #6cce77;
// }

// .personality-test-yellow {
//   color: #fff3a7;
// }
</style>
