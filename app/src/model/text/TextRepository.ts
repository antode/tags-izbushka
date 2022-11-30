import type { Text } from "@/model/text/type/Text";
import { parseText } from "@/model/text/TextParser";

import { text_s as text_s_raw } from "@/resource/text_s";
import { text_b1 as text_b1_raw } from "@/resource/text_b1";
import { text_b2 as text_b2_raw } from "@/resource/text_b2";
import { text_p1 as text_p1_raw } from "@/resource/text_p1";
import { text_p2 as text_p2_raw } from "@/resource/text_p2";
import { text_p3 as text_p3_raw } from "@/resource/text_p3";

import type { Tag } from "./type/Tag";

const genericPageDelimiter = /\/л\.(?:|\s)\d+(?:|(?:|\s)об\.)\//;
const b1PageDelimiter = /\/с\.\s\d+/;

const parsedTextS = parseText(text_s_raw, genericPageDelimiter);
const text_s: Text = {
  id: 0,
  shortName: "С",
  fullName: "Спафарий",
  words: parsedTextS.words,
  pages: parsedTextS.pages,
};

const parsedTextB1 = parseText(text_b1_raw, b1PageDelimiter);
const text_b1: Text = {
  id: 1,
  shortName: "Б1",
  fullName: "Байков 1",
  words: parsedTextB1.words,
  pages: parsedTextB1.pages,
};

const parsedTextB2 = parseText(text_b2_raw, genericPageDelimiter);
const text_b2: Text = {
  id: 2,
  shortName: "Б2",
  fullName: "Байков 2",
  words: parsedTextB2.words,
  pages: parsedTextB2.pages,
};

const parsedTextP1 = parseText(text_p1_raw, genericPageDelimiter);
const text_p1: Text = {
  id: 3,
  shortName: "П1",
  fullName: "Петлин 1",
  words: parsedTextP1.words,
  pages: parsedTextP1.pages,
};

const parsedTextP2 = parseText(text_p2_raw, genericPageDelimiter);
const text_p2: Text = {
  id: 4,
  shortName: "П2",
  fullName: "Петлин 2",
  words: parsedTextP2.words,
  pages: parsedTextP2.pages,
};

const parsedTextP3 = parseText(text_p3_raw, genericPageDelimiter);
const text_p3: Text = {
  id: 5,
  shortName: "П3",
  fullName: "Петлин 3",
  words: parsedTextP3.words,
  pages: parsedTextP3.pages,
};

export const texts: Text[] = [];
texts[text_s.id] = text_s;
texts[text_b1.id] = text_b1;
texts[text_b2.id] = text_b2;
texts[text_p1.id] = text_p1;
texts[text_p2.id] = text_p2;
texts[text_p3.id] = text_p3;

const tagsRaw: string[] = [
  "Человек",
  "Артефакт",
  "Перевод",
  "Детали",
  "Клише",
  "Неизвестность",
];

export const tags: Tag[] = [];
for (const tagRaw of tagsRaw) {
  const id: number = tags.length;

  tags[id] = { id, value: tagRaw };
}
