export const DIAG_PREFIX = "[TIKOL_DIAG]";

export function diag(step: string, data?: unknown) {
  const payload = data === undefined ? "" : ` ${safeStringify(data)}`;
  console.log(`${DIAG_PREFIX} ${new Date().toISOString()} ${step}${payload}`);
}

export function diagError(step: string, error: unknown) {
  console.error(`${DIAG_PREFIX} ${new Date().toISOString()} ${step}`, normalizeError(error));
}

export function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack };
  }
  return { message: safeStringify(error) };
}

function safeStringify(value: unknown) {
  try {
    return typeof value === "string" ? value : JSON.stringify(value);
  } catch {
    return String(value);
  }
}
