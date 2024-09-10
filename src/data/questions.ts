import { TestWordGroup, PersonalityColor, TestQuestion } from "../../types";

export const questionGroups: TestQuestion[] = [
  {
    id: 1,
    question: "После вечеринки другие, вероятно, скажут, что я:",
    options: [
      {
        id: 1,
        word: "Разговаривал(-а) слишком много и не давал(-а) другим высказаться.",
        color: PersonalityColor.Red,
      },
      {
        id: 2,
        word: "В основном молчал(-а) и слушал(-а) других.",
        color: PersonalityColor.Green,
      },
      {
        id: 3,
        word: "Сидел(-а) в прострации.",
        color: PersonalityColor.Blue,
      },
      {
        id: 4,
        word: "Я не выхожу из дома и тем более не общаюсь с людьми.",
        color: PersonalityColor.Yellow,
      },
    ],
  },
  {
    id: 2,
    question: "",
    options: [
      { id: 5, word: "от 18 до 25", color: PersonalityColor.Red },
      { id: 6, word: "от 26 до 35", color: PersonalityColor.Yellow },
      { id: 7, word: "от 36 до 49", color: PersonalityColor.Blue },
      { id: 8, word: "больше 50", color: PersonalityColor.Green },
    ],
  },
  {
    id: 3,
    question: "",
    options: [
      {
        id: 9,
        word: "Я - реалист, который наделен здравым смыслом.",
        color: PersonalityColor.Yellow,
      },
      {
        id: 10,
        word: "Я - мечтатель, который склонен руководствоваться только догадками.",
        color: PersonalityColor.Green,
      },
      {
        id: 11,
        word: "Я - дотер.",
        color: PersonalityColor.Red,
      },
      {
        id: 12,
        word: "Я - баланс. Стремлюсь к лучшему, готовлюсь к худшему.",
        color: PersonalityColor.Blue,
      },
    ],
  },
  {
    id: 4,
    question: "",
    options: [
      { id: 37, word: "logical", color: PersonalityColor.Green },
      { id: 38, word: "contented", color: PersonalityColor.Blue },
      { id: 39, word: "friendly", color: PersonalityColor.Yellow },
      { id: 40, word: "bold/audacious", color: PersonalityColor.Red },
    ],
  },
  {
    id: 5,
    question: "",
    options: [
      {
        id: 13,
        word: "Мне нравится этот предмет.",
        color: PersonalityColor.Green,
      },
      {
        id: 14,
        word: "Жду когда она уже уйдет из моей жизни...",
        color: PersonalityColor.Red,
      },
      {
        id: 15,
        word: "Понимаю, что она нужна мне.",
        color: PersonalityColor.Yellow,
      },
      {
        id: 16,
        word: "Я ГОТОВ ЗДЕСЬ И СЕЙЧАС ПОСТРОИТЬ ВСЕ ВОЗМОЖНЫЕ МАТЕМАТИЧЕСКИЕ ГРАФИКИ!",
        color: PersonalityColor.Blue,
      },
    ],
  },
  {
    id: 6,
    question: "",
    options: [
      {
        id: 17,
        word: "Они равнодушны к чувствам других людей и не понимают своих собственных.",
        color: PersonalityColor.Red,
      },
      {
        id: 18,
        word: "Не знают, кто такой папич.",
        color: PersonalityColor.Yellow,
      },
      {
        id: 19,
        word: "Они ошибаются в фактах и ​​не думают логично.",
        color: PersonalityColor.Green,
      },
      {
        id: 20,
        word: "Не уделяют внимания собеседнику.",
        color: PersonalityColor.Blue,
      },
    ],
  },
  {
    id: 7,
    question: "",
    options: [
      { id: 21, word: "Сладкий", color: PersonalityColor.Green },
      { id: 22, word: "Соленый", color: PersonalityColor.Blue },
      { id: 23, word: "Острый", color: PersonalityColor.Yellow },
      { id: 24, word: "Горький", color: PersonalityColor.Red },
    ],
  },
  {
    id: 8,
    question: "",
    options: [
      { id: 25, word: "Чезабретто.", color: PersonalityColor.Yellow },
      {
        id: 26,
        word: "А я все ждал когда же ты появишься. ",
        color: PersonalityColor.Red,
      },
      { id: 27, word: "Чиназес.", color: PersonalityColor.Green },
      {
        id: 28,
        word: "У меня уникальный лексикон, он не поддается трендам.",
        color: PersonalityColor.Blue,
      },
    ],
  },
  {
    id: 9,
    question: "",
    options: [
      {
        id: 29,
        word: "Просто уходишь, показывая собеседнику, что тебе все равно и ты не собираешься с ним больше общаться.",
        color: PersonalityColor.Yellow,
      },
      {
        id: 30,
        word: "Вы открыто высказываете свои аргументы и контраргументы. Кроме того, ты и твой собеседник должны беспристрастно воспринимать слова своего оппонента.",
        color: PersonalityColor.Red,
      },
      {
        id: 31,
        word: "Вы должны учитывать взгляды и чувства друг друга, учитывая почему именно этих взглядов он придерживается. Вы должны предоставить друг другу возможность высказать свое мнение и пытаться понять взгляды оппонента.",
        color: PersonalityColor.Green,
      },
      {
        id: 32,
        word: "Пропустишь этот момент и согласишься с мнением собеседника.",
        color: PersonalityColor.Blue,
      },
    ],
  },
  {
    id: 10,
    question: "",
    options: [
      { id: 33, word: "daring", color: PersonalityColor.Red },
      { id: 34, word: "idealist", color: PersonalityColor.Blue },
      { id: 35, word: "dutiful", color: PersonalityColor.Green },
      { id: 36, word: "playful", color: PersonalityColor.Yellow },
    ],
  },
];
