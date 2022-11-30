import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "parallel" });

test("Отображение текста.", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("0 Начальное состояние.png");

  await page
    .getByRole("navigation", { name: "Нумерация страниц" })
    .getByRole("button", { name: "2" })
    .click();

  await expect(page).toHaveScreenshot("1 Нумерация страниц.png");
});

test("Работа с цитатами.", async ({ page }) => {
  await page.goto("/");

  await page
    .getByRole("article", { name: "Текст" })
    .getByText("ехали", { exact: true })
    .click({ modifiers: ["Control"] });
  await expect(page).toHaveScreenshot("2 Установка начала выделения.png");

  await page
    .getByRole("navigation", { name: "Нумерация страниц" })
    .getByRole("button", { name: "2" })
    .click();

  await page
    .getByRole("article", { name: "Текст" })
    .getByText("сибирскими", { exact: true })
    .click({ modifiers: ["Alt"] });
  await expect(page).toHaveScreenshot("3 Установка конца выделения.png");

  await page.keyboard.press("Control+Enter");
  await expect(page).toHaveScreenshot("4 Добавление первой цитаты.png");

  await page
    .getByRole("article", { name: "Текст" })
    .getByText("приехали", { exact: true })
    .click({ modifiers: ["Control"] });

  await page
    .getByRole("article", { name: "Текст" })
    .getByText("отпуске", { exact: true })
    .click({ modifiers: ["Alt"] });

  await page.keyboard.press("Control+Enter");
  await expect(page).toHaveScreenshot("5 Добавление второй цитаты.png");

  await page
    .getByRole("article", { name: "Цитаты" })
    .getByText(
      "ехали на Переславль /л. 1 об./ Залеской, на Ростов, на Ярославль, на Вологду, на Устюг Великий и к Соливычегоцкой, на Кай-городок к Соли Камской, от Соли Камской сибирскими (С:Л.1-1об.)"
    )
    .click({ modifiers: ["Control", "Alt"] });
  await expect(page).toHaveScreenshot("6 Удаление первой цитаты.png");

  await page
    .getByRole("article", { name: "Текст" })
    .getByText("приехали")
    .click({ modifiers: ["Control"] });
  await page.keyboard.press("Escape");
  await expect(page).toHaveScreenshot("7 Отмена начала выделения.png");

  await page
    .getByRole("article", { name: "Текст" })
    .getByText("приехали")
    .click({ modifiers: ["Control"] });
  await page
    .getByRole("article", { name: "Текст" })
    .getByText("отпуске")
    .click({ modifiers: ["Alt"] });
  await page.keyboard.press("Escape");
  await expect(page).toHaveScreenshot("8 Отмена всего выделения.png");
});

test("Переключение тегов.", async ({ page }) => {
  await page.goto("/");

  await page
    .getByRole("article", { name: "Текст" })
    .getByText("Лета")
    .click({ modifiers: ["Control"] });
  await page
    .getByRole("article", { name: "Текст" })
    .getByText("князь")
    .click({ modifiers: ["Alt"] });

  await page.keyboard.press("Control+Enter");

  await expect(page).toHaveScreenshot("9 Первый тег.png");

  await page
    .getByRole("combobox", { name: "Тег" })
    .selectOption({ label: "Артефакт" });
  await expect(page).toHaveScreenshot("10 Тег переключен.png");

  await page
    .getByRole("article", { name: "Текст" })
    .getByText("Великого", { exact: true })
    .click({ modifiers: ["Control"] });

  await page
    .getByRole("article", { name: "Текст" })
    .getByText("передней", { exact: true })
    .click({ modifiers: ["Alt"] });

  await page.keyboard.press("Control+Enter");

  await expect(page).toHaveScreenshot(
    "11 Выделение добавлено во второй тег.png"
  );

  await page
    .getByRole("combobox", { name: "Тег" })
    .selectOption({ label: "Человек" });

  await expect(page).toHaveScreenshot("9 Первый тег.png");
});

test("Переключение источников.", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveScreenshot("12 Первый источник.png");

  await page
    .getByRole("combobox", { name: "Источник" })
    .selectOption({ label: "Байков 1" });

  await expect(page).toHaveScreenshot("13 Второй источник.png");
});

test("Сохранение состояния источника.", async ({ page }) => {
  await page.goto("/");

  await page
    .getByRole("navigation", { name: "Нумерация страниц" })
    .getByRole("button", { name: "2" })
    .click();

  await page
    .getByRole("combobox", { name: "Тег" })
    .selectOption({ label: "Артефакт" });

  await page
    .getByRole("article", { name: "Текст" })
    .getByText("Устюг", { exact: true })
    .click({ modifiers: ["Control"] });
  await page
    .getByRole("article", { name: "Текст" })
    .getByText("Тюмени", { exact: true })
    .click({ modifiers: ["Alt"] });

  await page.keyboard.press("Control+Enter");

  await expect(page).toHaveScreenshot(
    "14 Текущее состояние первого источника.png"
  );

  await page
    .getByRole("combobox", { name: "Источник" })
    .selectOption({ label: "Байков 1" });

  await page
    .getByRole("combobox", { name: "Источник" })
    .selectOption({ label: "Спафарий" });

  await expect(page).toHaveScreenshot(
    "14 Текущее состояние первого источника.png"
  );
});
