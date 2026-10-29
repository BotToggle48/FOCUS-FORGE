import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { SessionMode, TimerSettings } from '../types/timer';
import { soundEngine } from '../utils/audio';
import { sendDesktopNotification } from '../utils/notifications';

interface UsePomodoroTimerProps {
  settings: TimerSettings;
  activeTaskId: string | null;
  activeTaskTitle: string | null;
  onSessionComplete: (mode: SessionMode, durationMinutes: number, taskId?: string, taskTitle?: string) => void;
}

export function usePomodoroTimer({
  settings,
  activeTaskId,
  activeTaskTitle,
  onSessionComplete,
}: UsePomodoroTimerProps) {
  const [mode, setMode] = useState<SessionMode>('focus');
  const [status, setStatus] = useState<'idle' | 'running' | 'paused'>('idle');
  
  // Total duration in seconds for current mode
  const getDurationForMode = useCallback(
    (m: SessionMode) => {
      switch (m) {
        case 'focus':
          return settings.focusDuration * 60;
        case 'shortBreak':
          return settings.shortBreakDuration * 60;
        case 'longBreak':
          return settings.longBreakDuration * 60;
      }
    },
    [settings.focusDuration, settings.shortBreakDuration, settings.longBreakDuration]
  );

  const [timeLeft, setTimeLeft] = useState<number>(() => getDurationForMode('focus'));
  const [completedCycles, setCompletedCycles] = useState<number>(0); // 0 to settings.longBreakInterval (default 4)
  const [sessionsCompletedToday, setSessionsCompletedToday] = useState<number>(0);

  // High precision timestamp refs
  const endTimeRef = useRef<number | null>(null);
  const remainingSecondsRef = useRef<number>(timeLeft);
  const timerIntervalRef = useRef<number | null>(null);

  // Keep remainingSecondsRef in sync
  useEffect(() => {
    remainingSecondsRef.current = timeLeft;
  }, [timeLeft]);

  // When settings change while idle, update timeLeft
  useEffect(() => {
    if (status === 'idle') {
      const dur = getDurationForMode(mode);
      setTimeLeft(dur);
      remainingSecondsRef.current = dur;
    }
  }, [settings.focusDuration, settings.shortBreakDuration, settings.longBreakDuration, mode, status, getDurationForMode]);

  // Clean interval helper
  const clearCurrentTimer = useCallback(() => {
    if (timerIntervalRef.current !== null) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  // Finish session handler
  const handleSessionFinished = useCallback(() => {
    clearCurrentTimer();
    const finishedMode = mode;
    const durationMins = Math.round(getDurationForMode(finishedMode) / 60);

    // Audio chime
    soundEngine.playChime(settings.chimeSound, settings.soundVolume);

    if (finishedMode === 'focus') {
      // Confetti celebration
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#10b981', '#6366f1', '#ec4899', '#f59e0b'],
        });
      } catch {}

      // Desktop notification
      if (settings.enableNotifications) {
        sendDesktopNotification(
          'Focus Session Complete! 🎉',
          activeTaskTitle
            ? `Great job focusing on "${activeTaskTitle}"! Time for a well-deserved break.`
            : 'Focus session completed! Time for a well-deserved break.'
        );
      }

      setSessionsCompletedToday((prev) => prev + 1);
      const nextCycle = completedCycles + 1;
      setCompletedCycles(nextCycle);

      // Record to history and update active task
      onSessionComplete(
        'focus',
        durationMins,
        activeTaskId || undefined,
        activeTaskTitle || undefined
      );

      // Check for long break recommendation
      if (nextCycle >= settings.longBreakInterval) {
        setMode('longBreak');
        const nextDur = getDurationForMode('longBreak');
        setTimeLeft(nextDur);
        remainingSecondsRef.current = nextDur;
        setCompletedCycles(0);

        if (settings.autoStartBreaks) {
          startCountdown(nextDur);
        } else {
          setStatus('idle');
        }
      } else {
        setMode('shortBreak');
        const nextDur = getDurationForMode('shortBreak');
        setTimeLeft(nextDur);
        remainingSecondsRef.current = nextDur;

        if (settings.autoStartBreaks) {
          startCountdown(nextDur);
        } else {
          setStatus('idle');
        }
      }
    } else {
      // Break finished
      if (settings.enableNotifications) {
        sendDesktopNotification(
          'Break Finished! ⚡',
          'Ready to dive back into your next focus session?'
        );
      }

      onSessionComplete(finishedMode, durationMins);

      setMode('focus');
      const nextDur = getDurationForMode('focus');
      setTimeLeft(nextDur);
      remainingSecondsRef.current = nextDur;

      if (settings.autoStartPomodoros) {
        startCountdown(nextDur);
      } else {
        setStatus('idle');
      }
    }
  }, [
    clearCurrentTimer,
    mode,
    getDurationForMode,
    settings.chimeSound,
    settings.soundVolume,
    settings.enableNotifications,
    settings.longBreakInterval,
    settings.autoStartBreaks,
    settings.autoStartPomodoros,
    activeTaskTitle,
    completedCycles,
    onSessionComplete,
    activeTaskId,
  ]);

  // Start countdown logic with timestamp to prevent background drift
  const startCountdown = useCallback(
    (secondsToCount: number) => {
      clearCurrentTimer();
      const targetEndTime = Date.now() + secondsToCount * 1000;
      endTimeRef.current = targetEndTime;
      setStatus('running');

      timerIntervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const diffMs = targetEndTime - now;
        const diffSeconds = Math.max(0, Math.ceil(diffMs / 1000));

        setTimeLeft(diffSeconds);
        remainingSecondsRef.current = diffSeconds;

        if (diffSeconds <= 0) {
          handleSessionFinished();
        }
      }, 250); // 250ms check ensures rapid sync after tab switch
    },
    [clearCurrentTimer, handleSessionFinished]
  );

  // Actions
  const startTimer = useCallback(() => {
    if (status === 'running') return;
    startCountdown(timeLeft);
  }, [status, startCountdown, timeLeft]);

  const pauseTimer = useCallback(() => {
    if (status !== 'running') return;
    clearCurrentTimer();
    setStatus('paused');
    endTimeRef.current = null;
  }, [status, clearCurrentTimer]);

  const resumeTimer = useCallback(() => {
    if (status !== 'paused') return;
    startCountdown(remainingSecondsRef.current);
  }, [status, startCountdown]);

  const resetTimer = useCallback(() => {
    clearCurrentTimer();
    setStatus('idle');
    endTimeRef.current = null;
    const dur = getDurationForMode(mode);
    setTimeLeft(dur);
    remainingSecondsRef.current = dur;
  }, [clearCurrentTimer, getDurationForMode, mode]);

  const skipSession = useCallback(() => {
    clearCurrentTimer();
    setStatus('idle');
    endTimeRef.current = null;

    // Switch to appropriate next mode without recording as completed
    if (mode === 'focus') {
      const nextCycle = completedCycles + 1;
      if (nextCycle >= settings.longBreakInterval) {
        setMode('longBreak');
        const dur = getDurationForMode('longBreak');
        setTimeLeft(dur);
        remainingSecondsRef.current = dur;
        setCompletedCycles(0);
      } else {
        setMode('shortBreak');
        const dur = getDurationForMode('shortBreak');
        setTimeLeft(dur);
        remainingSecondsRef.current = dur;
        setCompletedCycles(nextCycle);
      }
    } else {
      setMode('focus');
      const dur = getDurationForMode('focus');
      setTimeLeft(dur);
      remainingSecondsRef.current = dur;
    }
  }, [clearCurrentTimer, mode, completedCycles, settings.longBreakInterval, getDurationForMode]);

  const switchMode = useCallback(
    (newMode: SessionMode) => {
      clearCurrentTimer();
      setStatus('idle');
      endTimeRef.current = null;
      setMode(newMode);
      const dur = getDurationForMode(newMode);
      setTimeLeft(dur);
      remainingSecondsRef.current = dur;
    },
    [clearCurrentTimer, getDurationForMode]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearCurrentTimer();
    };
  }, [clearCurrentTimer]);

  // Tab visibility sync: when tab regains focus, immediately recalculate
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && status === 'running' && endTimeRef.current) {
        const now = Date.now();
        const diffMs = endTimeRef.current - now;
        const diffSeconds = Math.max(0, Math.ceil(diffMs / 1000));
        setTimeLeft(diffSeconds);
        remainingSecondsRef.current = diffSeconds;
        if (diffSeconds <= 0) {
          handleSessionFinished();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [status, handleSessionFinished]);

  const totalDuration = getDurationForMode(mode);
  const progressPercent = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;

  return {
    mode,
    status,
    timeLeft,
    totalDuration,
    progressPercent,
    completedCycles,
    sessionsCompletedToday,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    skipSession,
    switchMode,
    setSessionsCompletedToday,
  };
}
