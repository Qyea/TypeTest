<template>
  <div class="container">
    <h1>Растения</h1>
    <label for="answer-input">
      {{
        !isStarted
          ? 'Введите начальный признак ("тип", "класс", "семейство")'
          : question
      }}
    </label>
    <el-input
      v-model="initialFeatureInput"
      id="answer-input"
      class="input-wrapper"
      placeholder="Введите начальный признак"
    />

    <el-button
      type="primary"
      id="initial-btn"
      @click="!isStarted ? giveAnswer() : () => {}"
    >
      Ответить
    </el-button>
    <div v-if="result" id="result" class="result">
      Признак: {{ result.feature }}, Значение: {{ result.value }}
    </div>
  </div>

  <div class="btn-container">
    <el-button plain type="primary" @click="showLogs"
      >Показать все логи</el-button
    >
    <el-button @click="hideLogs">Скрыть все логи</el-button>
  </div>

  <div id="logs-container" v-if="logsHtml" v-html="logsHtml"></div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { values } from "../data/values";
import { rules } from "../data/rules";
import { dictValues } from "../data/dict";
import { ElMessage, ElMessageBox } from "element-plus";

interface Feature {
  featureName: string;
  value: string;
  sign: string;
  isFinal: boolean;
}

const rows = 10;
const cols = values.length;
let table = reactive<Feature[][]>([]); // Таблица
let tGoals = reactive<Feature[][]>([]); // Цели
let target = reactive<string[]>([]); // Текущие цели
const results = reactive<{ feature: string; value: string }[]>([]); // Результаты
const contextStack = reactive<string[]>([]); // Логи

const question = ref("");

const initialFeatureInput = ref<string>(""); // Поле для ввода начального признака
const currentFeature = ref<any>(""); // Текущий признак
const indicesToDeleteGoals = ref<number[]>([]);
const indicesToDeleteTable = ref<number[]>([]);
const result = ref<{ feature: string; value: string }>(); // Результат
const logsHtml = ref<string>(""); // Логи в HTML формате

const isStarted = ref<boolean>(false);

const isFinalFeature = (feature: string): boolean => {
  return ["класс", "семейство", "тип"].includes(feature);
};

const getUserInput = (featureName: string): Promise<string> => {
  return new Promise((resolve) => {
    ElMessageBox.prompt(
      `Введите значение признака "${featureName}": ${dictValues[featureName]}`,
      "Ввод значения",
      {
        confirmButtonText: "OK",
        cancelButtonText: "Отмена",
        inputPlaceholder: "Введите значение...",
        inputValidator: (value) => {
          return value ? true : "Значение не может быть пустым";
        },
        inputErrorMessage: "Введите корректное значение",
      }
    )
      .then(({ value }) => {
        resolve(value);
      })
      .catch(() => {
        resolve("");
      });
  });
};

for (let i = 0; i < rows; i++) {
  const row: Feature[] = [];
  for (let j = 0; j < cols; j++) {
    row.push({
      featureName: "",
      value: "",
      sign: " ",
      isFinal: false,
    });
  }
  table.push(row);
}

rules.forEach((rule, index) => {
  rule.if.forEach((condition) => {
    const vIndex = values.indexOf(condition.value);
    if (vIndex !== -1) {
      table[index][vIndex] = {
        featureName: condition.feature,
        value: condition.value,
        sign: "-",
        isFinal: isFinalFeature(condition.feature),
      };
    }
  });

  const vIndex = values.lastIndexOf(rule.then.value);
  if (vIndex !== -1) {
    table[index][vIndex] = {
      featureName: rule.then.feature,
      value: rule.then.value,
      sign: "+",
      isFinal: true,
    };
  }
});

const giveAnswer = async () => {
  if (initialFeatureInput.value) {
    const initialFeature = initialFeatureInput.value;

    target.push(initialFeature);
    await stepOneOne();
  } else {
    ElMessage.error("Введите начальный признак");
    return;
  }
};

const stepOneOne = async () => {
  currentFeature.value = target[target.length - 1];

  for (let i = 0; i < table.length; i++) {
    for (let j = 0; j < cols; j++) {
      if (
        table[i][j].featureName === currentFeature.value &&
        table[i][j].sign === "+"
      ) {
        tGoals.push(table[i]);
      }
    }
  }

  logContext(1.1, `Текущий признак: ${currentFeature.value}`);

  if (tGoals.length === 0) {
    stepOneTwo();
  } else {
    stepTwo();
  }
};

const stepOneTwo = () => {
  logContext(1.2, `Текущий признак: ${currentFeature.value}`);
  ElMessage.error(
    "Ответ не может быть получен т.к. отсутствуют правила, соответствующие текущему признаку"
  );
};

const stepTwo = () => {
  console.log("Шаг 2", tGoals);
  let minNumMinuses = Infinity;
  let min_i = 0;
  let min_j = 0;

  for (let i = 0; i < tGoals.length; i++) {
    let numMinuses = 0;
    for (let j = 0; j < cols; j++) {
      if (tGoals[i][j].sign === "-") {
        numMinuses++;
      } else if (tGoals[i][j].sign === "+") {
        min_i = i;
        min_j = j;
      }
    }

    if (numMinuses < minNumMinuses) {
      minNumMinuses = numMinuses;
    }
  }

  logContext(2, `Номер правила: ${min_i}`);

  if (minNumMinuses > 0) {
    stepThree(min_i);
  } else {
    results.push({
      feature: tGoals[min_i][min_j].featureName,
      value: tGoals[min_i][min_j].value,
    });

    if (target.length === 0) {
      stepFive();
    } else {
      stepFour();
    }
  }
};

const stepThree = async (ruleIndex: number) => {
  const firstFeature = tGoals[ruleIndex].find(
    (feature) => feature.sign === "-"
  )!;
  logContext(
    3,
    `1-ый признак в анализируемом правиле: ${firstFeature.featureName}`
  );
  if (!firstFeature.isFinal) {
    const answer = await getUserInput(firstFeature.featureName);
    results.push({ feature: firstFeature.featureName, value: answer });
    stepFour();
  } else {
    currentFeature.value = firstFeature.featureName;
    target.push(currentFeature.value);
    tGoals.length = 0;
    await stepOneOne();
  }
  // const firstFeatureIndex = tGoals[ruleIndex].findIndex((feature) => {
  //   return feature.sign === "-";
  // });
  // const firstFeature = tGoals[ruleIndex][firstFeatureIndex]; // feature A_v
  // const logMessage = `<b>Номер шага:</b> ${3},<br/>
  //               <b>1-ый признак в анализируемом правиле:</b> ${
  //                 firstFeature.featureName
  //               },<br/>
  //               <b>Значение 1-го признака:</b> ${firstFeature.value}<br/>`; // хз как вывести T_Goals
  // contextStack.push(logMessage);
  // if (!firstFeature.isFinal) {
  //   results.push({
  //     feature: firstFeature.featureName,
  //     value: firstFeature.value,
  //   });
  //   const logMessage = `<b>Номер шага:</b> ${3},<br/>
  //               <b>Текущие результаты:</b> ${JSON.stringify(results)},<br/>`; // хз как вывести T_Goals
  //   contextStack.push(logMessage);
  //   stepFour();
  // } else {
  //   currentFeature.value = {
  //     feature: firstFeature.featureName,
  //     value: firstFeature.value,
  //   };
  //   target.push(currentFeature.value);
  //   tGoals = [];
  //   stepOneOne();
  // }
};

const stepFourTwo = () => {
  let temp = [];
  for (let i = 0; i < tGoals.length; i++) {
    if (!indicesToDeleteGoals.value.includes(i)) {
      temp.push(tGoals[i]);
    }
  }
  tGoals = temp;

  temp = [];
  for (let i = 0; i < table.length; i++) {
    if (!indicesToDeleteTable.value.includes(i)) {
      temp.push(table[i]);
    }
  }
  table = temp;

  indicesToDeleteGoals.value = [];
  indicesToDeleteTable.value = [];
  console.log("four two");
  console.log(tGoals);
  stepFourThree();
};

const stepFourThree = () => {
  const logMessage = `
  <div>
  <div>
    <p>Номер шага:</p> ${4.3},
  </div>
  <p>Стэк St_target:${target}</p>,
  </div>`;

  contextStack.push(logMessage);

  console.log("four three");
  const justKnew = results[results.length - 1].feature;
  if (currentFeature.value === justKnew) {
    target = target.filter((feature) => feature !== currentFeature.value);
    console.log(target);
    if (target.length === 0) stepFive();
    else stepOneOne();
  } else {
    console.log(target);
    stepTwo();
  }
};

const stepFour = () => {
  let A_v_pair = results[results.length - 1];

  const logMessage = `<div><p>Номер шага:</p> ${4},</div>
                <p>Полученная информация:</p> ${JSON.stringify(
                  A_v_pair
                )},<br/>`;

  contextStack.push(logMessage);
  for (let P_u = 0; P_u < tGoals.length; P_u++) {
    console.log(tGoals[P_u]);

    for (let i = 0; i < cols; i++) {
      if (tGoals[P_u][i].featureName === A_v_pair.feature) {
        if (tGoals[P_u][i].sign === "-") {
          if (tGoals[P_u][i].value !== A_v_pair.value) {
            indicesToDeleteGoals.value.push(P_u);
          } else {
            tGoals[P_u][i].sign = " ";
          }
        }
        if (tGoals[P_u][i].sign === "+") {
          indicesToDeleteGoals.value.push(P_u);
          continue;
        }
      }
    }
  }

  for (let i = 0; i < table.length; i++) {
    for (let j = 0; j < cols; j++) {
      if (table[i][j].featureName === A_v_pair.feature) {
        if (table[i][j].sign === "-") {
          if (table[i][j].value !== A_v_pair.value) {
            indicesToDeleteTable.value.push(i);
          } else {
            table[i][j].sign = " ";
          }
        }
        if (table[i][j].sign === "+") {
          indicesToDeleteTable.value.push(i);
          continue;
        }
      }
    }
  }

  stepFourTwo();
};

const stepFive = () => {
  result.value = results[results.length - 1];
  logContext(5, `Итоговые результаты: ${JSON.stringify(result.value)}`);
};

const logContext = (step: number, message: string) => {
  const logMessage = `<div> <p>Номер шага:${step}</p>, </div><p>${message}</p><br/><br/>`;
  contextStack.push(logMessage);
};

const showLogs = () => {
  logsHtml.value = contextStack.join("");
};

const hideLogs = () => {
  logsHtml.value = "";
};
</script>

<style scoped>
.input-wrapper {
  margin-bottom: 0.5rem;
}
</style>
