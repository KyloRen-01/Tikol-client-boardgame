import { Profiler, type ProfilerOnRenderCallback, type ReactNode } from "react";
import { diag } from "./diagnosticLog";

const onRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime,
) => {
  diag("render.profile", { id, phase, actualDuration, baseDuration, startTime, commitTime });
};

export function RenderProfiler({ id, children }: { id: string; children: ReactNode }) {
  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  );
}
