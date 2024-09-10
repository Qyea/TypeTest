export enum PersonalityColor {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
  Yellow = "YELLOW",
}

export type TestWord = {
  id: number;
  word: string;
  color: PersonalityColor;
};

export type TestQuestion = {
  id: number;
  question: string;
  options: TestWord[];
};

export type TestWordGroup = TestQuestion[];

export type PersonalityTestResponse = Map<number, number>;

export type PersonalityTestState = {
  startedAt: Date | null;
  groupNumber: number;
  selection: PersonalityTestResponse;
};

export type PersonalityTestResult = {
  [key in PersonalityColor]: number;
};

export type RootState = {
  test: PersonalityTestState;
};

export type AddSelectionPayload = {
  groupId: number;
  value: number;
};
