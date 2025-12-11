import Timer from "../components/Timer";
import ControlButtons from "../components/ControlButtons";
import ModeSwitch from "../components/ModeSwitch";

export default function Home() {
  return (
    <div className="text-center p-6 max-w-xl w-full">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-sm font-medium select-none">Focus</h1>
        <button aria-label="settings" className="text-sm text-neutral-500">
          ⚙️
        </button>
      </header>

      <main>
        <Timer />
        <ControlButtons />
        <ModeSwitch />
      </main>

      <footer className="mt-8 text-xs text-neutral-500 select-none">
        Minimal Pomodoro — built for focus
      </footer>
    </div>
  );
}
