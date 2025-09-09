export function getExistingCredentials() {
  return {
    user: "existing_test_user",
    pass: "existing_test_pass",
  };
}
export function getRandomCredentials() {
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

export async function fillSignUpCredentials(page, { user, pass }) {
  const usernameInput = page.getByLabel("Usuario");
  await usernameInput.click();
  await usernameInput.fill(user);

  const passwordInput = page.getByLabel("Contraseña");
  await passwordInput.click();
  await passwordInput.fill(pass);

  await page.getByRole("button", { name: "Sign Up" }).click();
}
export async function fillLoginCredentials(page, { user, pass }) {
  const usernameInput = page.getByLabel("Usuario");
  await usernameInput.click();
  await usernameInput.fill(user);

  const passwordInput = page.getByLabel("Contraseña");
  await passwordInput.click();
  await passwordInput.fill(pass);

  await page.getByRole("button", { name: "Login" }).click();
}
