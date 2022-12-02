import type { Tag } from "@/model/text/type/Tag";
import type { Word } from "@/model/text/type/Word";

export interface Citation {
  id: number;
  start: Word;
  end: Word;
  tag: Tag;
}

// export class Citation {
//   id: number;
//   start: Word;
//   end: Word;
//   tag: Tag;

//   constructor(id: number, start: Word, end: Word, tag: Tag) {
//     checkWords(start, end);

//     this.id = id;
//     this.start = start;
//     this.end = end;
//     this.tag = tag;
//   }
// }

// function checkWords(start: Word | null, end: Word | null): void {
//   if (start === null && end === null) {
//     return;
//   }

//   if (start === null && end !== null) {
//     throw new Error("End can't exists without start.");
//   }

//   if (start !== null && end !== null && start.id === end.id) {
//     throw new Error("Start can't be equal to end.");
//   }

//   if (start !== null && end !== null && start.id > end.id) {
//     throw new Error("Start can't be greater than end.");
//   }
// }
