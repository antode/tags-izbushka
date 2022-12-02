import type { Word } from "@/model/text/type/Word";

export interface ISelection {
  start: Word | null;
  end: Word | null;
}

export function clear(selection: ISelection): void {
  selection.start = null;
  selection.end = null;
}

export function setStart(selection: ISelection, start: Word): void {
  checkWords(start, selection.end);

  selection.start = start;
}

export function setEnd(selection: ISelection, end: Word): void {
  checkWords(selection.start, end);

  selection.end = end;
}

export function isWordInSelection(selection: ISelection, word: Word): boolean {
  if (selection.start === null) {
    return false;
  }

  const rangeStart: number = selection.start.id;
  const rangeEnd: number =
    selection.end !== null ? selection.end.id : selection.start.id;

  return word.id >= rangeStart && word.id <= rangeEnd;
}

function checkWords(start: Word | null, end: Word | null): void {
  if (start === null && end === null) {
    return;
  }

  if (start === null && end !== null) {
    throw new Error("End can't exists without start.");
  }

  if (start !== null && end !== null && start.id === end.id) {
    throw new Error("Start can't be equal to end.");
  }

  if (start !== null && end !== null && start.id > end.id) {
    throw new Error("Start can't be greater than end.");
  }
}
