import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";

import TextSelection from "@/components/TextSelection.vue";

import * as TextRepository from "@/model/text/TextRepository";
import * as StorePersistance from "@/stores/source/StorePersistance";

import type { Word } from "@/model/text/type/Word";
import type { Selection } from "@/stores/source/type/Selection";

const words: Word[] = TextRepository.texts[0].words.slice(0, 2000);
const selection: Selection = StorePersistance.currentSource.selection;

describe("TextSelection", () => {
  it("renders text", () => {
    expect(true).toStrictEqual(true);
  });
});

const wrapper = mount(TextSelection, {
  props: {
    words: words,
    selectionStart: selection.start,
    selectionEnd: selection.end,
  },
});

describe("TextSelection", () => {
  it("renders text", () => {
    let expectedText = "";
    for (const word of words) {
      expectedText += word.value;
    }

    expect(wrapper.text()).toStrictEqual(expectedText.trim());
  });
  it("make spans", () => {
    const wordsSpans = wrapper.get("span.text").findAll("span");

    expect(wordsSpans).toHaveLength(words.length);
  });
  it("set spans colors", () => {
    const wordsSpans = wrapper.get("span.text").findAll("span");

    for (let index = 0; index < wordsSpans.length; index++) {
      if (selection.start === null) {
        expect(wordsSpans[index].attributes("style")).toBe(
          `background-color: White;`
        );

        continue;
      }

      if (selection.start.id === index && selection.end === null) {
        expect(wordsSpans[index].attributes("style")).toBe(
          `background-color: White;`
        );

        continue;
      }

      if (selection.start !== null && selection.end === null) {
        throw new Error("End without start!");
      }

      if (selection.end === null) {
        expect(wordsSpans[index].attributes("style")).toBe(
          `background-color: White;`
        );

        continue;
      }

      if (index >= selection.start.id && index <= selection.end.id) {
        expect(wordsSpans[index].attributes("style")).toBe(
          `background-color: Wheat;`
        );

        continue;
      }

      expect(wordsSpans[index].attributes("style")).toBe(
        `background-color: White;`
      );
    }
  });
  it("emits selection start", async () => {
    await wrapper.get("span.text").get("span").trigger("click.ctrl");

    const emitted = wrapper.emitted();

    expect(emitted).toHaveProperty("selectionStartChange");

    const selectionStartEvent = emitted.selectionStartChange[0];

    expect(selectionStartEvent).toHaveLength(1);
    expect(selectionStartEvent).toStrictEqual([words[0]]);
  });
  it("emits selection end", async () => {
    await wrapper.get("span.text").findAll("span").at(5)?.trigger("click.alt");

    const emitted = wrapper.emitted();

    expect(emitted).toHaveProperty("selectionEndChange");

    const selectionEndedEvent = emitted.selectionEndChange[0];

    expect(selectionEndedEvent).toHaveLength(1);
    expect(selectionEndedEvent).toStrictEqual([words[5]]);
  });
});
