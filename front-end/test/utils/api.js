import { API_URL } from "../constants";

// https://playwright.dev/docs/api/class-apirequestcontext
// https://playwright.dev/docs/api/class-apiresponse

async function getCsrfToken(request) {
  const response = await request.get(`${API_URL}/auth/csrf`);
  const parsedBody = await response.json();
  return parsedBody.csrfToken;
}

export async function createUser({ user, pass }, request) {
  const csrf = await getCsrfToken(request);
  // If the user already exists, it returns 400 status, which is fine for this case
  await request.post(`${API_URL}/auth/signup`, {
    data: { user, pass },
    headers: {
      "X-CSRF-Token": csrf,
    },
  });
}
