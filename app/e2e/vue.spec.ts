import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "parallel" });

// See here how to get started:
// https://playwright.dev/docs/intro
test("Отображение текста.", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("0 Начальное состояние.png");

  await page.getByRole("button", { name: "2" }).click();
  await expect(page).toHaveScreenshot("1 Пагинация.png");
});

test("Работа с цитатами.", async ({ page }) => {
  await page.goto("/");

  await page
    .getByRole("article", { name: "текст" })
    .getByText("Лета")
    .click({ modifiers: ["Control"] });
  await expect(page).toHaveScreenshot("2 Установка начала выделения.png");

  await page
    .getByRole("article", { name: "текст" })
    .getByText("князь")
    .click({ modifiers: ["Alt"] });
  await expect(page).toHaveScreenshot("3 Установка конца выделения.png");

  await page.keyboard.press("Control+Shift+Enter");
  await expect(page).toHaveScreenshot("4 Добавление первой цитаты.png");

  await page
    .getByRole("article", { name: "текст" })
    .getByText("Да", { exact: true })
    .click({ modifiers: ["Control"] });

  await page
    .getByRole("article", { name: "текст" })
    .getByText("списку")
    .click({ modifiers: ["Alt"] });

  await page.keyboard.press("Control+Shift+Enter");
  await expect(page).toHaveScreenshot("5 Добавление второй цитаты.png");

  await page
    .getByRole("article", { name: "цитаты" })
    .getByText(
      "Лета 7183-го февраля в 20 день великий государь царь и великий князь"
    )
    .click({ modifiers: ["Control", "Alt"] });
  await expect(page).toHaveScreenshot("6 Удаление первой цитаты.png");

  await page
    .getByRole("article", { name: "текст" })
    .getByText("Лета")
    .click({ modifiers: ["Control"] });
  await page.keyboard.press("Escape");
  await expect(page).toHaveScreenshot("7 Отмена начала выделения.png");

  await page
    .getByRole("article", { name: "текст" })
    .getByText("Лета")
    .click({ modifiers: ["Control"] });
  await page
    .getByRole("article", { name: "текст" })
    .getByText("князь")
    .click({ modifiers: ["Alt"] });
  await page.keyboard.press("Escape");
  await expect(page).toHaveScreenshot("8 Отмена всего выделения.png");
});
