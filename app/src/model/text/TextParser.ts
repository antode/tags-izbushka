import type { Word } from "@/model/text/type/Word";
import type { Page } from "@/model/text/type/Page";

export function parseText(
  text: string,
  pageDelimiterRE: RegExp
): { words: Word[]; pages: Page[] } {
  const pagesRawRE = new RegExp(
    `${pageDelimiterRE.source}.+?(?=(?:${pageDelimiterRE.source})|$)`,
    "gs"
  );

  const wordsRE = new RegExp(
    `(?<text>(?<page>${pageDelimiterRE.source}).+)`,
    "s"
  );

  const wordsSplitRE = new RegExp(`(${pageDelimiterRE.source})|(\\s)|(\\n)`);

  const pagesRaw = text.match(pagesRawRE);

  if (pagesRaw === null) {
    console.log("Warning! Pages can not be parsed!");
    return { pages: [], words: [] };
  }

  let wordId = 0;
  const words: Word[] = [];
  const pages: Page[] = [];

  for (const [index, pageRaw] of pagesRaw.entries()) {
    const match = pageRaw.match(wordsRE);

    if (match === null || match.groups === undefined) {
      console.log(`Text parsing notice! Page: ${index} is empty.`);
      continue;
    }

    const page = { id: index, value: match.groups.page };
    pages.push(page);

    for (const word of match.groups.text.split(wordsSplitRE)) {
      if (word === "" || word === undefined) continue;

      words[wordId] = { page, value: word, id: wordId };

      wordId++;
    }
  }

  const charsInText = text.length;

  let charsParsed = 0;
  for (const word of words) {
    charsParsed += word.value.length;
  }

  console.log(`charsInText: ${charsInText}, charsParsed: ${charsParsed}`);

  return { pages, words };
}

export function formatPages(
  startPage: string,
  endPage: string,
  textShortName: string
) {
  let startPageFormatted = startPage.replace(/\//g, "").replace(/\s+/g, "");

  const startPageParts = startPageFormatted.match(
    /(?<leadLetter>[а-я])(?<rest>.+)/i
  )?.groups;

  if (startPageParts === undefined) {
    throw new Error("Unexpected start page value.");
  }

  startPageFormatted =
    startPageParts.leadLetter.toUpperCase() + startPageParts.rest;

  let endPageFormatted = "";
  if (startPage !== endPage) {
    endPageFormatted = endPage.replace(/\//g, "").replace(/\s+/g, "");

    const endPageParts = endPageFormatted.match(/[а-я]\.(?<rest>.+)/i)?.groups;
    if (endPageParts === undefined) {
      throw new Error("Unexpected end page value.");
    }

    endPageFormatted = `-${endPageParts.rest}`;
  }

  return ` (${textShortName}:${startPageFormatted}${endPageFormatted})`;
}
