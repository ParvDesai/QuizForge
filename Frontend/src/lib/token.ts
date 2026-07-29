/** Tiny auth helpers that read/write the token from localStorage */

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("quizforge_token");
}

export function setToken(token: string): void {
  localStorage.setItem("quizforge_token", token);
}

export function removeToken(): void {
  localStorage.removeItem("quizforge_token");
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
