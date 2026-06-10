import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const SESSION_TOKEN_KEY = "tikol.activeSessionToken";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24;

function getCookieToken() {
  if (typeof document === "undefined") {
    return null;
  }

  return (
    document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${SESSION_TOKEN_KEY}=`))
      ?.split("=")[1] ?? null
  );
}

function setCookieToken(token: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${SESSION_TOKEN_KEY}=${token}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

function deleteCookieToken() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${SESSION_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

function createToken() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function getSessionToken() {
  if (Platform.OS === "web") {
    return getCookieToken();
  }

  return SecureStore.getItemAsync(SESSION_TOKEN_KEY);
}

export async function createSessionToken() {
  const token = createToken();

  if (Platform.OS === "web") {
    setCookieToken(token);
    return token;
  }

  await SecureStore.setItemAsync(SESSION_TOKEN_KEY, token);

  return token;
}

export async function clearSessionToken() {
  if (Platform.OS === "web") {
    deleteCookieToken();
    return;
  }

  await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
}
