import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import CitationList from "@/components/CitationList.vue";

import { setActivePinia, createPinia } from "pinia";
setActivePinia(createPinia());

import { useSourceStore } from "@/stores/source/SourceStore";
const sourceStore = useSourceStore();

const citationsTexts: string[] = sourceStore.citationsTexts;

const wrapper = mount(CitationList, {
  props: {
    citationsTexts,
  },
});

describe("CitationList", () => {
  it("render citations text", () => {
    console.log(wrapper.text());
    console.log(citationsTexts[0]);
    expect(wrapper.text()).toContain(citationsTexts[0]);
    expect(wrapper.text()).toContain(citationsTexts[1]);
  });
  // it("render pages info", () => {
  //   expect(wrapper.text()).toContain(citations[0].pagesInfo);
  //   expect(wrapper.text()).toContain(citations[1].pagesInfo);
  // });
  it("emits citation delete", async () => {
    await wrapper.get("div").trigger("click.ctrl.alt");

    const emitted = wrapper.emitted();

    expect(emitted).toHaveProperty("citationDelete");

    const citationDeleteEvent = emitted.citationDelete[0];

    expect(citationDeleteEvent).toHaveLength(1);
    expect(citationDeleteEvent).toStrictEqual([0]);
  });
});
