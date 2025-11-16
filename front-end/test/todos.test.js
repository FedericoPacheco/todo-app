import { test, expect } from "@playwright/test";
import { fillLoginCredentials, getRandomCredentials } from "./utils/auth";
import { createUser } from "./utils/api";

test.describe("Todos", function () {
  test("should complete todo flow successfully: multiple add, delete, update, toggle, update, toggle", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    //await logDebugData(page);
    const credentials = getRandomCredentials();
    await createUser(credentials, request);
    await fillLoginCredentials(page, credentials);

    await createTodo(page, "test1");
    await createTodo(page, "test2");
    await createTodo(page, "test3");
    await expectAllVisible(page, ["test1", "test2", "test3"]);

    await deleteTodo(page, "test3");
    await expectAllInvisible(page, ["test3"]);

    await updateTodo(page, "test1", "test1-ed");
    await expectAllVisible(page, ["test1-ed", "test2"]);

    await switchTodo(page, "test2");
    await expectAllInvisible(page, ["test2"]);

    await switchTab(page, "Completadas");
    await expectAllVisible(page, ["test2"]);

    await updateTodo(page, "test2", "test2-ed");
    await expectAllVisible(page, ["test2-ed"]);

    await switchTodo(page, "test2-ed");
    await expectAllInvisible(page, ["test2-ed"]);

    await switchTab(page, "Pendientes");
    await expectAllVisible(page, ["test1-ed", "test2-ed"]);
  });

  test("should not show canceled todo creations nor updates in any tab", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    const credentials = getRandomCredentials();
    await createUser(credentials, request);
    await fillLoginCredentials(page, credentials);

    await cancelCreateTodo(page, "test1");
    await expectAllInvisible(page, ["test1"]);
    await switchTab(page, "Completadas");
    await expectAllInvisible(page, ["test1"]);

    await createTodo(page, "test1");
    await cancelUpdateTodo(page, "test1", "test1-ed");
    await expectAllInvisible(page, ["test1-ed"]);
    await switchTab(page, "Pendientes");
    await expectAllInvisible(page, ["test1", "test1-ed"]);
  });
});

// eslint-disable-next-line no-unused-vars
async function logDebugData(page) {
  console.log("Page URL:", page.url());
  console.log("Page title:", await page.title());
  console.log("Page body HTML:", await page.locator("body").innerHTML());
  page.on("console", (msg) =>
    console.log("Browser console:", msg.type(), msg.text())
  );
  page.on("pageerror", (error) => console.log("Page error:", error.message));
}

async function switchTab(page, name) {
  await page.getByRole("heading", { name: name }).click();
}

async function createTodo(page, text) {
  await page.getByTestId("create-todo-button").click();
  await page.locator("textarea").click();
  await page.locator("textarea").fill(text);
  await page.getByRole("button", { name: "Crear" }).click();
}
async function cancelCreateTodo(page, text) {
  await page.getByTestId("create-todo-button").click();
  await page.locator("textarea").click();
  await page.locator("textarea").fill(text);
  await page.getByRole("button", { name: "Cancelar" }).click();
}
async function updateTodo(page, oldText, newText) {
  await page.getByRole("listitem").filter({ hasText: oldText }).dblclick();
  await page.locator("textarea").click();
  await page.locator("textarea").fill(newText);
  await page.getByRole("button", { name: "Editar" }).click();
}
async function cancelUpdateTodo(page, oldText, newText) {
  await page.getByRole("listitem").filter({ hasText: oldText }).dblclick();
  await page.locator("textarea").click();
  await page.locator("textarea").fill(newText);
  await page.getByRole("button", { name: "Cancelar" }).click();
}
async function switchTodo(page, text) {
  await page
    .getByRole("listitem")
    .filter({ hasText: text })
    .locator(".check")
    .click();
}
async function deleteTodo(page, text) {
  await page
    .getByRole("listitem")
    .filter({ hasText: text })
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
