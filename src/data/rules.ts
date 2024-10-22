export const rules = [
  {
    if: [
      { feature: "класс", value: "голосеменные" },
      { feature: "структура листа", value: "чешуеобразная" },
    ],
    then: { feature: "семейство", value: "кипарисовые" },
  },
  {
    if: [
      { feature: "класс", value: "голосеменные" },
      { feature: "структура листа", value: "иглоподобная" },
      { feature: "конфигурация", value: "хаотическая" },
    ],
    then: { feature: "семейство", value: "сосновые" },
  },
  {
    if: [
      { feature: "класс", value: "голосеменные" },
      { feature: "структура листа", value: "иглоподобная" },
      { feature: "конфигурация", value: "2 ровных ряда" },
    ],
    then: { feature: "семейство", value: "еловые" },
  },
  {
    if: [
      { feature: "класс", value: "голосеменные" },
      { feature: "структура листа", value: "иглоподобная" },
      { feature: "конфигурация", value: "2 ровных ряда" },
      { feature: "серебристая полоса", value: "нет" },
    ],
    then: { feature: "семейство", value: "болотный кипарис" },
  },
  {
    if: [
      { feature: "тип", value: "деревья" },
      { feature: "форма листа", value: "широкая и плоская" },
    ],
    then: { feature: "класс", value: "покрытосеменные" },
  },
  {
    if: [
      { feature: "тип", value: "деревья" },
      { feature: "форма листа", value: "не (широкая и плоская)" },
    ],
    then: { feature: "класс", value: "голосеменные" },
  },
  {
    if: [{ feature: "стебель", value: "зеленый" }],
    then: { feature: "тип", value: "травянистые" },
  },
  {
    if: [
      { feature: "стебель", value: "древесный" },
      { feature: "положение", value: "стелющееся" },
    ],
    then: { feature: "тип", value: "лианы" },
  },
  {
    if: [
      { feature: "стебель", value: "древесный" },
      { feature: "положение", value: "прямостоящее" },
      { feature: "один основной ствол", value: "да" },
    ],
    then: { feature: "тип", value: "деревья" },
  },
  {
    if: [
      { feature: "стебель", value: "древесный" },
      { feature: "положение", value: "прямостоящее" },
      { feature: "один основной ствол", value: "нет" },
    ],
    then: { feature: "тип", value: "кустарниковые" },
  },
];
