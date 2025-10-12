import { test, expect } from "@playwright/test";
import { fillLoginCredentials, getRandomCredentials } from "./utils/auth";
import { createUser } from "./utils/api";

test.describe("Todos", function () {
  test("should complete todo flow successfully: multiple add, delete, toggle, toggle", async ({
    page,
    request,
  }) => {
    await page.goto("/");

    // Debugging purposes
    console.log("Page title:", await page.title());
    console.log("Page URL:", page.url());
    // Check the actual HTML content
    const bodyHTML = await page.locator("body").innerHTML();
    console.log("Body HTML (first 500 chars):", bodyHTML.substring(0, 500));
    // Check for any error messages
    const bodyText = await page.locator("body").textContent();
    console.log("Body text:", bodyText);
    // Check console errors
    page.on("console", (msg) =>
      console.log("Browser console:", msg.type(), msg.text())
    );
    page.on("pageerror", (error) => console.log("Page error:", error.message));
    await page.screenshot({ path: "debug-screenshot.png", fullPage: true });
    await expect(page.locator("body")).toBeVisible({ timeout: 10000 });
    // ------------

    const credentials = getRandomCredentials();
    await createUser(credentials, request);
    await fillLoginCredentials(page, credentials);

    await createTodo(page, "test1");
    await createTodo(page, "test2");
    await createTodo(page, "test3");
    await expectAllVisible(page, ["test1", "test2", "test3"]);

    await deleteTodo(page, "test3");
    await expectAllVisible(page, ["test1", "test2"]);
    await expectAllInvisible(page, ["test3"]);

    await switchTodo(page, "test2");
    await expectAllInvisible(page, ["test2"]);
    await switchTab(page, "Completadas");
    await expectAllVisible(page, ["test2"]);

    await switchTodo(page, "test2");
    await expectAllInvisible(page, ["test2"]);
    await switchTab(page, "Pendientes");
    await expectAllVisible(page, ["test1", "test2"]);
  });

  test("should not show canceled todo in any tab", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    const credentials = getRandomCredentials();
    await createUser(credentials, request);
    await fillLoginCredentials(page, credentials);

    const todoName = "test1";
    await page.getByTestId("create-todo-button").click();
    await page.locator("textarea").click();
    await page.locator("textarea").fill(todoName);
    await page.getByRole("button", { name: "Cancelar" }).click();

    await expectAllInvisible(page, [todoName]);
    await switchTab(page, "Completadas");
    await expectAllInvisible(page, [todoName]);
  });
});

async function switchTab(page, name) {
  await page.getByRole("heading", { name: name }).click();
}

async function createTodo(page, name) {
  await page.getByTestId("create-todo-button").click();
  await page.locator("textarea").click();
  await page.locator("textarea").fill(name);
  await page.getByRole("button", { name: "Crear" }).click();
}
async function switchTodo(page, name) {
  await page
    .getByRole("listitem")
    .filter({ hasText: name })
    .locator(".check")
    .click();
}
async function deleteTodo(page, name) {
  await page
    .getByRole("listitem")
    .filter({ hasText: name })
    .locator(".delete")
    .click();
}

async function expectAllVisible(page, todoNames) {
  await Promise.all(
    todoNames.map((todo) => expect(page.getByText(todo)).toBeVisible())
  );
}

async function expectAllInvisible(page, todoNames) {
  await Promise.all(
    todoNames.map((todo) => expect(page.getByText(todo)).toHaveCount(0))
  );
}
