<template>
  <div class="container">
    <h1>Растения</h1>
    <label for="answer-input">
      {{ !isStarted ? "Выберете начальный признак" : question }}
    </label>
    <el-radio-group v-model="featureTypes">
      <el-radio-button label="Тип" value="тип" />
      <el-radio-button label="Класс" value="класс" />
      <el-radio-button label="Семейство" value="семейство" />
    </el-radio-group>
    <el-text>Начальные признаки: {{ dictValues[featureTypes] }}</el-text>
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

  <div
    :class="['logs-container', logsHtml ? 'active' : '']"
    id="logs-container"
    v-html="logsHtml"
  ></div>
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

interface FeatureShortInfo {
  featureName: string;
  value: string;
}

const rows = 10;
const cols = values.length;

let table = reactive<Feature[][]>([]); // Таблица
let tGoals = reactive<Feature[][]>([]); // Цели

let target = reactive<FeatureShortInfo[]>([]); // Текущие цели
const results = reactive<{ feature: string; value: string }[]>([]); // Результаты

const contextStack = reactive<string[]>([]); // Логи

const question = ref("");

const initialFeatureInput = ref<string>(""); // Поле для ввода начального признака
const currentFeature = ref<FeatureShortInfo>({
  featureName: "",
  value: "",
});

const indicesToDeleteGoals = ref<number[]>([]);
const indicesToDeleteTable = ref<number[]>([]);

const result = ref<{ feature: string; value: string }>(); // Результат
const logsHtml = ref<string>(""); // Логи в HTML формате

const isStarted = ref<boolean>(false);

const featureTypes = ref("тип");

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

const isInAPos = (featureName: string, rule: Feature[]) => {
  for (let j = 0; j < cols; j++) {
    if (rule[j].featureName === featureName && rule[j].sign === "-") {
      return { is: true, index: j };
    }
  }
  return { is: false };
};

const isInAFinal = (featureName: string, rule: Feature[]) => {
  for (let j = 0; j < cols; j++) {
    if (rule[j].featureName === featureName && rule[j].sign === "+") {
      return { is: true, index: j };
    }
  }
  return { is: false };
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
  if (featureTypes.value && initialFeatureInput.value) {
    const initialFeature = {
      featureName: featureTypes.value,
      value: initialFeatureInput.value,
    };

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
        table[i][j].featureName === currentFeature.value.featureName &&
        table[i][j].value === currentFeature.value.value &&
        table[i][j].sign === "+"
      ) {
        tGoals.push(table[i]);
      }
    }
  }

  logContext(
    1.1,
    ` <p>Текущий признак: ${currentFeature.value.featureName},</p>
              <p>Текущее значение: ${currentFeature.value.value}</p>`
  );

  if (tGoals.length === 0) {
    stepOneTwo();
  } else {
    stepTwo();
  }
};

const stepOneTwo = () => {
  logContext(
    1.2,
    ` <p>Текущий признак:${currentFeature.value.featureName},</p>
              <p>Текущее значение: ${currentFeature.value.value}</p>`
  );

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

  logContext(2, `Номер правила:${min_i}`);

  if (minNumMinuses > 0) {
    stepThree(min_i);
  } else if (minNumMinuses === 0) {
    results.push({
      feature: tGoals[min_i][min_j].featureName,
      value: tGoals[min_i][min_j].value,
    });
    console.log(results);
    if (target.length === 0) stepFive();
    else if (target.length > 0) stepFour();
  }
};

const stepThree = async (ruleIndex: number) => {
  const firstFeature = tGoals[ruleIndex].find(
    (feature) => feature.sign === "-"
  )!;

  logContext(
    3,
    `<p>1-ый признак в анализируемом правиле:</p> ${firstFeature.featureName},<br/>
              <p>Значение 1-го признака:</p> ${firstFeature.value}`
  );

  if (!firstFeature.isFinal) {
    results.push({
      feature: firstFeature.featureName,
      value: firstFeature.value,
    });

    const logMessage = `<b>Номер шага:</b> ${3},<br/>
              <b>Текущие результаты:</b> ${JSON.stringify(results)},<br/>`; // хз как вывести T_Goals

    contextStack.push(logMessage);

    stepFour();
  } else {
    currentFeature.value = {
      featureName: firstFeature.featureName,
      value: firstFeature.value,
    };
    target.push(currentFeature.value);
    tGoals = [];
    stepOneOne();
  }
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
  logContext(4.3, ` <p>Стэк St_target: ${JSON.stringify(target)}</p>`);

  const justKnew = results[results.length - 1];
  if (
    currentFeature.value.featureName === justKnew.feature &&
    currentFeature.value.value === justKnew.value
  ) {
    target = target.filter(
      (targetFeature) =>
        !(
          targetFeature.featureName === currentFeature.value.featureName &&
          targetFeature.value === currentFeature.value.value
        )
    );

    if (target.length === 0) stepFive();
    else stepOneOne();
  } else {
    console.log(target);
    stepTwo();
  }
};

const stepFour = () => {
  let A_v_pair = results[results.length - 1];

  logContext(4, `<p>Полученная информация:${JSON.stringify(A_v_pair)}</p>`);

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

  logContext(5, `<p>Итоговые результаты: ${JSON.stringify(results)}</p>`);
};

const logContext = (step: number, message: string) => {
  const logMessage = `<p>Номер шага:${step},</p>
  ${message}`;

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
