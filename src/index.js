import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faPlay,
  faPause,
  faSync
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

function App() {
  let [breakLength, setBreakLength] = useState(5);
  let [sessionLength, setSessionLength] = useState(25);
  let [isSession, setIsSession] = useState(true);
  let [timerIsRunning, setTimerIsRunning] = useState(false);
  let [timeRemaining, setTimeRemaining] = useState([sessionLength, 0]);
  let beep = React.createRef();

  useEffect(() => {
    function runTimer(time) {
      let [minutes, seconds] = time;

      if (minutes === 0 && seconds === 0) return timerDone();

      if (seconds === 0) {
        seconds = 59;
        minutes--;
      } else {
        seconds--;
      }

      if (minutes === 0 && seconds === 0) beep.current.play();

      setTimeRemaining([minutes, seconds]);
    }

    function timerDone() {
      if (isSession) {
        setIsSession(false);
        setTimeRemaining([breakLength, 0]);
      } else {
        setIsSession(true);
        setTimeRemaining([sessionLength, 0]);
      }
    }

    if (timerIsRunning) {
      const interval = setInterval(() => {
        runTimer(timeRemaining);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [
    timerIsRunning,
    timeRemaining,
    breakLength,
    sessionLength,
    isSession,
    beep
  ]);

  function reset() {
    setBreakLength(5);
    setSessionLength(25);
    setIsSession(true);
    setTimerIsRunning(false);
    setTimeRemaining([25, 0]);
    beep.current.pause();
    beep.current.currentTime = 0;
  }

  return (
    <div id="pomodoro" className="container">
      <div className="row">
        <div className="col-12" id="title">
          Pomodoro Clock
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <div id="break-label">Break Length</div>
          <div>
            <span
              id="break-decrement"
              onClick={() =>
                breakLength > 1 && !timerIsRunning
                  ? setBreakLength(breakLength - 1)
                  : null
              }
              className="clickable"
            >
              <FontAwesomeIcon icon={faArrowDown} />
            </span>

            <span id="break-length">{breakLength}</span>
            <span
              id="break-increment"
              onClick={() =>
                breakLength <= 59 && !timerIsRunning
                  ? setBreakLength(breakLength + 1)
                  : null
              }
              className="clickable"
            >
              <FontAwesomeIcon icon={faArrowUp} />
            </span>
          </div>
        </div>
        <div className="col-6">
          <div id="session-label">Sessions Length</div>
          <div>
            <span
              id="session-decrement"
              onClick={() => {
                if (sessionLength > 1 && !timerIsRunning) {
                  setSessionLength(sessionLength - 1);
                  setTimeRemaining([sessionLength - 1, 0]);
                }
              }}
              className="clickable"
            >
              <FontAwesomeIcon icon={faArrowDown} />
            </span>

            <span id="session-length">{sessionLength}</span>
            <span
              id="session-increment"
              onClick={() => {
                if (sessionLength <= 59 && !timerIsRunning) {
                  setSessionLength(sessionLength + 1);
                  setTimeRemaining([sessionLength + 1, 0]);
                }
              }}
              className="clickable"
            >
              <FontAwesomeIcon icon={faArrowUp} />
            </span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div id="timer">
            <p id="timer-label">{isSession ? "Session" : "Break"}</p>
            <div id="time-left" className="mb-3">
              {`${
                timeRemaining[0] <= 9
                  ? "0" + timeRemaining[0]
                  : timeRemaining[0]
              }:${
                timeRemaining[1] <= 9
                  ? "0" + timeRemaining[1]
                  : timeRemaining[1]
              }`}
            </div>
            <div>
              <span
                id="start_stop"
                onClick={() => setTimerIsRunning(!timerIsRunning)}
                className="clickable"
              >
                <FontAwesomeIcon icon={faPause} className="mr-1" />

                <FontAwesomeIcon icon={faPlay} className="mr-3" />
              </span>
              <span id="reset" className="mx-2 clickable" onClick={reset}>
                <FontAwesomeIcon icon={faSync} />
              </span>
            </div>
            <div />
          </div>
        </div>
      </div>
      <audio id="beep" ref={beep} preload="auto" src="https://goo.gl/65cBl1" />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
