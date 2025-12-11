import { useState, useEffect } from "react";

let listeners = [];
let timerState = {
  minutes: 25,
  seconds: 0,
  running: false,
  mode: "focus", // focus | short | long
};

function notify() {
  listeners.forEach((cb) => cb({ ...timerState }));
}

function setState(partial) {
  timerState = { ...timerState, ...partial };
  notify();
}

export function useTimer() {
  const [state, setLocal] = useState(timerState);

  useEffect(() => {
    // subscribe
    listeners.push(setLocal);
    // push current state immediately
    setLocal(timerState);
    return () => {
      listeners = listeners.filter((l) => l !== setLocal);
    };
  }, []);

  useEffect(() => {
    let interval;
    if (state.running) {
      interval = setInterval(() => {
        let { minutes, seconds } = timerState;

        if (seconds === 0) {
          if (minutes === 0) {
            // session finished
            setState({ running: false });
            return;
          }
          minutes = minutes - 1;
          seconds = 59;
        } else {
          seconds = seconds - 1;
        }

        setState({ minutes, seconds });
      }, 1000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.running, state.mode]);

  const defaults = { focus: 25, short: 5, long: 15 };

  return {
    ...state,
    start: () => setState({ running: true }),
    pause: () => setState({ running: false }),
    reset: () =>
      setState({
        minutes: defaults[timerState.mode],
        seconds: 0,
        running: false,
      }),
    setMode: (m) =>
      setState({
        mode: m,
        minutes: defaults[m],
        seconds: 0,
        running: false,
      }),
  };
}
