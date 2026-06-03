import React from 'react';
import { useRace } from '../race/RaceContext';
import { useEnvironment } from '../EnvironmentContext';
import { useGameAudio } from '../audio/AudioContext';

export function HUD() {
  const { raceState, startRace } = useRace();
  const { isNight, toggleDayNight } = useEnvironment();
  const { muted, toggleMute } = useGameAudio();

  return (
    <div className="ui-layer">
      {/* Speedometer */}
      <div className="speedometer">
        <div id="speed-value" className="speed-value">0</div>
        <div className="speed-unit">km/h</div>
      </div>

      {/* Race Info */}
      <div className="race-info">
        {!raceState.active ? (
          <button className="start-btn" onClick={() => startRace('circuit', 3, 4)}>
            START RACE
          </button>
        ) : (
          <div className="race-stats">
            <div className="lap-counter">
              Lap {raceState.lapCount} / {raceState.maxLaps}
            </div>
            <div className="checkpoint-counter">
              Checkpoint {raceState.currentCheckpoint} / {raceState.totalCheckpoints}
            </div>
            <div className="timer">
              Time: {(raceState.elapsedTime / 1000).toFixed(1)}s
            </div>
          </div>
        )}
      </div>

      {/* Environment Controls */}
      <div className="top-controls">
        <button className="env-btn" onClick={toggleMute}>
          {muted ? '🔈 Unmute Audio' : '🔊 Mute Audio'}
        </button>
        <button className="env-btn" onClick={toggleDayNight}>
          {isNight ? '🌞 Switch to Day' : '🌙 Switch to Night'}
        </button>
      </div>
    </div>
  );
}
