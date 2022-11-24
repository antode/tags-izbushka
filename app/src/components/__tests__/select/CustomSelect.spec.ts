import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import CustomSelect from "@/components/select/CustomSelect.vue";

const customOptions = [
  "string1",
  "string2",
  "string3",
  "string4",
  "string5",
  "string6",
];

const initialValue = customOptions[0];

const wrapper = mount(CustomSelect, {
  props: {
    options: customOptions,
    initialValue,
  },
});

describe("CustomSelect", () => {
  it("render select element", () => {
    const select = wrapper.find("select");

    expect(select).not.toBeNull();
  });
  it("render options", () => {
    const options = wrapper.get("select").findAll("option");

    expect(options).toHaveLength(customOptions.length);

    for (let index = 0; index < options.length; index++) {
      expect(options[index].text()).toStrictEqual(customOptions[index]);
    }
  });
  it("set initial value", () => {
    const select = wrapper.get("select");

    expect(select.element.value).toStrictEqual(initialValue);
  });
  it("emits source change", async () => {
    const select = wrapper.get("select");

    await select.setValue(customOptions[5]);

    const emitted = wrapper.emitted();
    expect(emitted).toHaveProperty("valueChanged");

    const sourceChangedEvent = emitted.valueChanged[0];

    expect(sourceChangedEvent).toStrictEqual([customOptions[5]]);
  });
});
