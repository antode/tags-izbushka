import type { Word } from "@/model/text/type/Word";

export class Selection {
  selectionProxy: Selection;
  
  start: Word | null = null;
  end: Word | null = null;

  constructor(start: Word | null = null, end: Word | null = null) {
    checkWords(start, end);

    this.start = start;
    this.end = end;
  }

  clear(): void {
    this.start = null;
    this.end = null;
  }

  setStart(start: Word): void {
    checkWords(start, this.end);

    this.start = start;
  }

  setEnd(end: Word): void {
    checkWords(this.start, end);

    this.end = end;
  }

  static isWordInSelection(selection: Selection, word: Word): boolean {
    if (selection.start === null) {
      return false;
    }

    const rangeStart: number = selection.start.id;
    const rangeEnd: number =
      selection.end !== null ? selection.end.id : selection.start.id;

    return word.id >= rangeStart && word.id <= rangeEnd;
  }
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
