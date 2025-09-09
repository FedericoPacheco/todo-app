import { test, expect } from "@playwright/test";
import {
  getRandomCredentials,
  getExistingCredentials,
  fillSignUpCredentials,
  fillLoginCredentials,
} from "./utils/auth";
import { createUser } from "./utils/api";
import { WEB_URL } from "./constants";

test.describe("Authentication", function () {
  test("should complete new user auth flow successfully: sign up, log out, log in, log out", async ({
    page,
  }) => {
    await page.goto(WEB_URL);
    await expect(page.getByText("Ingrese sus credenciales")).toBeVisible();

    const credentials = getRandomCredentials();
    await fillSignUpCredentials(page, credentials);
    await expect(page.getByText("ToDo App")).toBeVisible();

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByText("ToDo App")).toBeVisible();

    await page.getByRole("button", { name: "Salir" }).click();
    await expect(page.getByText("Ingrese sus credenciales")).toBeVisible();

    await fillLoginCredentials(page, credentials);
    await expect(page.getByText("ToDo App")).toBeVisible();

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByText("ToDo App")).toBeVisible();

    await page.getByRole("button", { name: "Salir" }).click();
    await expect(page.getByText("Ingrese sus credenciales")).toBeVisible();
  });

  test("should show an error when signing up with an existing username", async ({
    request,
    page,
  }) => {
    await page.goto(WEB_URL);
    await expect(page.getByText("Ingrese sus credenciales")).toBeVisible();
    // Create a user on the backend first if not present
    const credentials = getExistingCredentials();
    await createUser(credentials, request);

    await fillSignUpCredentials(page, credentials);

    await expect(page.getByText(/usuario ya existente/i)).toBeVisible();
  });

  test("should show an error when logging in with an incorrect password", async ({
    request,
    page,
  }) => {
    await page.goto(WEB_URL);
    await expect(page.getByText("Ingrese sus credenciales")).toBeVisible();
    // Create a user on the backend first if not present
    const credentials = getExistingCredentials();
    await createUser(credentials, request);

    const wrongCredentials = {
      user: credentials.user,
      pass: credentials.pass + "_wrong",
    };
    await fillLoginCredentials(page, wrongCredentials);

    await expect(page.getByText(/credenciales incorrectas/i)).toBeVisible();
  });
});
