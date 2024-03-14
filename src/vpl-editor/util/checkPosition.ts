import { AbstractStatement as AbstractStatementModel } from "../model/language.model";
import { Language, PreferredPosition } from "../model/meta-language.model";

const checkPosition = (position: number, length: number, language: Language, statement: AbstractStatementModel, parent: AbstractStatementModel, level: number) => {
  const preferredPositions = language.statements[statement.name]?.positions;
  const avoidedPositions = language.statements[statement.name]?.avoidPositions;

  return testPosition(position, length, true, preferredPositions) &&
    testPosition(position, length, false, avoidedPositions) &&
    isInCorrectParent(language, statement, parent) &&
    isInCorrectLevel(language, statement, level);
};

const isInCorrectParent = (language: Language, statement: AbstractStatementModel, parent: AbstractStatementModel) => {
  const parents = language.statements[statement.name]?.parents;
  const avoidParents = language.statements[statement.name]?.avoidParents;

  const hasValidParent = !parents || parents.includes(parent.name);
  const doesNotHaveAvoidedParent = !avoidParents || !avoidParents.includes(parent.name);

  return hasValidParent && doesNotHaveAvoidedParent;
};

const testPosition = (position: number, length: number, preferred: boolean, list?: PreferredPosition[]) => {
  if (!list)
    return true;

  const isInCorrectStringPosition = (position: number, length: number, preferredPosition: PreferredPosition) => {
    if (position === 0 && preferredPosition === "first")
      return true;

    if (position === length - 1 && preferredPosition === "last")
      return true;

    return position > 0 && position < length - 1 && preferredPosition === "middle";
  };

  for (const item of list) {
    const isInCorrectNumericalPosition = typeof item === "number" && position === item;

    const isInCorrectPosition = isInCorrectNumericalPosition || isInCorrectStringPosition(position, length, item);

    if (isInCorrectPosition)
      return preferred;
  }

  return !preferred;
};

const isInCorrectLevel = (language: Language, statement: AbstractStatementModel, level: number) => {
  const levels = language.statements[statement.name]?.levels;
  const avoidLevels = language.statements[statement.name]?.avoidLevels;

  const inValidLevel = !levels || levels.includes(level);
  const isNotInAvoidedLevel = !avoidLevels || !avoidLevels.includes(level);

  return inValidLevel && isNotInAvoidedLevel;
};

export { checkPosition };
