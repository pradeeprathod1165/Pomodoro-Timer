import { useTimer } from "../hooks/useTimer";

export default function ControlButtons() {
  const { running, start, pause, reset } = useTimer();

  return (
    <div className="flex justify-center gap-4 my-4">
      <button
        onClick={running ? pause : start}
        className="px-6 py-2 rounded-lg bg-black text-white select-none"
      >
        {running ? "Pause" : "Start"}
      </button>

      <button
        onClick={reset}
        className="px-6 py-2 rounded-lg border border-neutral-300 select-none"
      >
        Reset
      </button>
    </div>
  );
}
