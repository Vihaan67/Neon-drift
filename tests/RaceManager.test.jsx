import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { RaceProvider, useRace } from '../src/race/RaceContext';

describe('RaceContext logic', () => {
  const wrapper = ({ children }) => <RaceProvider>{children}</RaceProvider>;

  it('should start a race with correct initial state', () => {
    const { result } = renderHook(() => useRace(), { wrapper });

    act(() => {
      result.current.startRace('circuit', 3, 4);
    });

    expect(result.current.raceState.active).toBe(true);
    expect(result.current.raceState.mode).toBe('circuit');
    expect(result.current.raceState.lapCount).toBe(1);
    expect(result.current.raceState.currentCheckpoint).toBe(0);
  });

  it('should handle checkpoint progression correctly', () => {
    const { result } = renderHook(() => useRace(), { wrapper });

    act(() => {
      result.current.startRace('circuit', 3, 4);
    });

    // Hit the first checkpoint
    act(() => {
      result.current.hitCheckpoint(0);
    });
    
    expect(result.current.raceState.currentCheckpoint).toBe(1);
    expect(result.current.raceState.lapCount).toBe(1);

    // Hit out of order (should ignore)
    act(() => {
      result.current.hitCheckpoint(3);
    });
    
    expect(result.current.raceState.currentCheckpoint).toBe(1);

    // Hit remaining checkpoints to complete lap
    act(() => {
      result.current.hitCheckpoint(1);
      result.current.hitCheckpoint(2);
      result.current.hitCheckpoint(3);
    });
    
    // Should advance to lap 2, checkpoint 0
    expect(result.current.raceState.lapCount).toBe(2);
    expect(result.current.raceState.currentCheckpoint).toBe(0);
  });
});
