import { test, expect } from "@playwright/test";

const WEB_URL = "http://localhost:3000";
const API_URL = "http://localhost:1340";

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

function getExistingCredentials() {
  return {
    user: "existing_test_user",
    pass: "existing_test_pass",
  };
}
function getRandomCredentials() {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
  const getRandomInt = (min, max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  };

  const now = Date.now();
  const randomId = getRandomInt(0, 9999);
  return {
    user: `test_user_${now}_${randomId}`,
    pass: `test_pass_${now}_${randomId}`,
  };
}

async function fillSignUpCredentials(page, { user, pass }) {
  const usernameInput = page.getByLabel("Usuario");
  await usernameInput.click();
  await usernameInput.fill(user);

  const passwordInput = page.getByLabel("Contraseña");
  await passwordInput.click();
  await passwordInput.fill(pass);

  await page.getByRole("button", { name: "Sign Up" }).click();
}
async function fillLoginCredentials(page, { user, pass }) {
  const usernameInput = page.getByLabel("Usuario");
  await usernameInput.click();
  await usernameInput.fill(user);

  const passwordInput = page.getByLabel("Contraseña");
  await passwordInput.click();
  await passwordInput.fill(pass);

  await page.getByRole("button", { name: "Login" }).click();
}

// https://playwright.dev/docs/api/class-apirequestcontext
// https://playwright.dev/docs/api/class-apiresponse
async function getCsrfToken(request) {
  const response = await request.get(`${API_URL}/auth/csrf`);
  const parsedBody = await response.json();
  return parsedBody.csrfToken;
}
async function createUser({ user, pass }, request) {
  const csrf = await getCsrfToken(request);
  // If the user already exists, it returns 400 status, which is fine for this case
  await request.post(`${API_URL}/auth/signup`, {
    data: { user, pass },
    headers: {
      "X-CSRF-Token": csrf,
    },
  });
}
