import { Platform } from "react-native";
import { diag, diagError } from "./diagnosticLog";

type ErrorUtilsShape = {
  getGlobalHandler?: () => (error: Error, isFatal?: boolean) => void;
  setGlobalHandler?: (handler: (error: Error, isFatal?: boolean) => void) => void;
};

declare const global: typeof globalThis & {
  ErrorUtils?: ErrorUtilsShape;
  HermesInternal?: unknown;
};

export function installGlobalDiagnostics() {
  diag("global.install", {
    platform: Platform.OS,
    hermes: !!global.HermesInternal,
  });

  const previous = global.ErrorUtils?.getGlobalHandler?.();
  global.ErrorUtils?.setGlobalHandler?.((error, isFatal) => {
    diagError(`global.error isFatal=${isFatal ? "true" : "false"}`, error);
    previous?.(error, isFatal);
  });

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const rejectionTracker = require("promise/setimmediate/rejection-tracking");
  rejectionTracker.enable({
    allRejections: true,
    onUnhandled: (_id: number, error: unknown) => diagError("promise.unhandled", error),
    onHandled: (id: number) => diag("promise.handled", { id }),
  });
}
