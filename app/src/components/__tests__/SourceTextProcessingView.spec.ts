import { createPinia } from "pinia";

import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";

import * as Repository from "@/model/text/TextRepository";
import type { Word } from "@/model/text/type/Word";

import SourceTextProcessingView from "@/views/SourceTextProcessingView.vue";
import TextSelection from "@/components/TextSelection.vue";
import VPagination from "@hennge/vue3-pagination";

describe("TextSelection", () => {
  const wrapper = mount(SourceTextProcessingView, {
    global: {
      plugins: [createPinia()],
    },
  });
  const VPaginationWrapper = wrapper.findComponent(VPagination);

  it("renders text", () => {
    const repoWords: Word[] = Repository.texts[0].words.filter(
      (w: Word) => w.page.id === 0
    );

    const compWords: Word[] = wrapper
      .findComponent(TextSelection)
      .props().words;

    for (let index = 0; index < repoWords.length; index++) {
      expect(repoWords[index]).equal(compWords[index]);
    }
  });
  it("paginate", async () => {
    const repoWords: Word[] = Repository.texts[0].words.filter(
      (w: Word) => w.page.id === 1
    );

    const page2Button = VPaginationWrapper.findAll("button.Page").find(
      (b) => b.text() === "2"
    );

    expect(page2Button).not.undefined;

    await page2Button?.trigger("click");

    const compWords: Word[] = wrapper
      .findComponent(TextSelection)
      .props().words;

    for (let index = 0; index < repoWords.length; index++) {
      expect(repoWords[index]).equal(compWords[index]);
    }
  });
});
