<template>
  <div id="app">
    <div class="container">
      <div v-if="activeSignsNumber !== 0 && show && activeSignsNumber !== 3">
        <TransitionGroup class="q-list" name="list" tag="ul">
          <h3 :key="activeSignsNumber">
            Выберете {{ activeSigns[activeSignsNumber - 1].attribute }}
          </h3>
          <button
            v-for="(option, answer) of activeSigns[activeSignsNumber - 1]
              .options"
            :key="option"
            @click.prevent="onClick(option, answer)"
          >
            {{ answer }}. {{ option }}
          </button>
        </TransitionGroup>
      </div>
      <div v-if="activeSignsNumber === 0">
        <div class="header">
          <h2>Что вы желаете определить?</h2>
          <label>Выберите параметр</label>
        </div>

        <button
          v-for="option in options"
          :key="option"
          @click.prevent="chosenOption(option)"
        >
          {{ option }}
        </button>
      </div>

      <div class="log">
        <h3>Лог:</h3>
        <pre>{{ log }}</pre>
      </div>
      <div v-if="activeSignsNumber === 3">
        <h3>Ответ {{ answer }}</h3>
        <p class="log">Do you want to restarts? OwO</p>
        <button @click="restart">Restart</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const log = ref("");
const activeSignsNumber = ref(0);

interface Signs {
  id: number;
  attribute: string;
  options: string[];
}

const activeSigns = ref<Signs[]>([]);
const active = ref<number>(0);
const answer = ref<number>(0);
const show = ref<boolean>(true);

const options = ["Характеристика 1", "Характеристика 2", "Характеристика 3"];

const chosenOption = (option: string) => {
  activeSignsNumber.value = 1;
  switch (option) {
    case "Характеристика 1":
      activeSigns.value = [
        {
          id: 0,
          attribute: "Признак 1.1",
          options: ["свойство 1.1.1", "свойство 1.1.2"],
        },
        {
          id: 1,
          attribute: "Признак 1.2",
          options: ["свойство 1.2.1", "свойство 1.2.2"],
        },
      ];
      active.value = 0;
      log.value +=
        "Другие свойства (Признак 2.1, Признак 2.2 и Признак 3.1, Признак 3.2) не учитываются \n";
      break;
    case "Характеристика 2":
      activeSigns.value = [
        {
          id: 0,
          attribute: "Признак 2.1",
          options: ["Cвойство 2.1.1", "Cвойство 2.1.2"],
        },
        {
          id: 1,
          attribute: "Признак 2.2",
          options: ["Cвойство 2.2.1", "Cвойство 2.2.2"],
        },
      ];
      active.value = 1;
      log.value +=
        "Другие свойства (Признак 1.1, Признак 1.2 и Признак 3.1, Признак 3.2) не учитываются \n";
      break;
    case "Характеристика 3":
      activeSigns.value = [
        {
          id: 0,
          attribute: "Признак 3.1",
          options: ["Cвойство 3.1.1", "Cвойство 3.1.2"],
        },
        {
          id: 1,
          attribute: "Признак 3.2",
          options: ["Cвойство 3.2.1", "Cвойство 3.2.2"],
        },
      ];
      active.value = 2;
      log.value +=
        "Другие свойства (Признак 1.1, Признак 1.2) и (Признак 2.1, Признак 2.2) не учитываются \n";
      break;
    default:
      active.value = 4;
      activeSigns.value = [];
  }
};

const signs = ref<
  {
    attribute: string;
    answer: number;
  }[]
>([]);

const onClick = (attribute: string, answer: number) => {
  console.log(activeSignsNumber.value);
  signs.value.push({ attribute, answer });
  log.value += `Выбран ответ ${attribute} \n`;
  console.log(signs.value);
  activeSignsNumber.value++;
  if (signs.value.length === 2) {
    buildResults();
  }
};

const buildResults = () => {
  log.value += "Формирование ответа";
  switch (active.value) {
    case 0:
      console.log(signs.value);
      if (signs.value[0].answer === 1 && signs.value[1].answer === 1) {
        answer.value = 0;
      } else if (signs.value[0].answer === 0 && signs.value[1].answer === 1) {
        answer.value = 1;
      } else if (signs.value[0].answer === 1 && signs.value[1].answer === 0) {
        answer.value = 2;
      } else {
        answer.value = 3;
      }
      break;
    case 1:
      if (signs.value[0].answer !== 2 && signs.value[1].answer !== 2) {
        if (signs.value[0].answer === 1 && signs.value[1].answer === 1) {
          answer.value = 4;
        } else if (signs.value[0].answer === 0 && signs.value[1].answer === 1) {
          answer.value = 5;
        } else if (signs.value[0].answer === 1 && signs.value[1].answer === 0) {
          answer.value = 6;
        } else {
          answer.value = 7;
        }
      }
      break;
    case 2:
      if (signs.value[0].answer !== 2 && signs.value[1].answer !== 2) {
        if (signs.value[0].answer === 1 && signs.value[1].answer === 1) {
          answer.value = 8;
        } else if (signs.value[0].answer === 0 && signs.value[1].answer === 1) {
          answer.value = 9;
        } else if (signs.value[0].answer === 1 && signs.value[1].answer === 0) {
          answer.value = 10;
        } else {
          answer.value = 11;
        }
      }

      break;
  }
};

const restart = () => {
  activeSigns.value = [];
  signs.value = [];
  activeSignsNumber.value = 0;
  show.value = true;
  active.value = 0;
  log.value = "";
};
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-bottom: 1rem;
}

.container {
  margin: 20px;
}
.log {
  margin-bottom: 2rem;
  font-family: "Classic Console Neue";
}

.log pre {
  font-family: "Classic Console Neue";
}

.q-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
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
