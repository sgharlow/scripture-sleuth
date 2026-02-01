/**
 * Game state machine hook
 * Manages the core game flow and state transitions
 */

import { useReducer, useCallback } from 'react';
import type {
  GameState,
  GameContext,
  GameAction,
  GuessResult,
  ShuffledPuzzle,
  UserProgress,
} from '../types';

// Initial context state
const initialContext: GameContext = {
  state: 'LOADING',
  puzzle: null,
  selectedIndex: null,
  result: null,
  userProgress: null,
  error: null,
};

/**
 * Game state reducer
 * Handles all state transitions
 */
function gameReducer(context: GameContext, action: GameAction): GameContext {
  switch (action.type) {
    case 'LOAD_START':
      return {
        ...context,
        state: 'LOADING',
        error: null,
      };

    case 'LOAD_SUCCESS':
      return {
        ...context,
        state: context.userProgress === null ? 'NEW_USER' : 'PLAYING',
        puzzle: action.puzzle,
        userProgress: action.progress,
        selectedIndex: null,
        error: null,
      };

    case 'LOAD_ALREADY_PLAYED':
      return {
        ...context,
        state: 'COMPLETED',
        puzzle: action.puzzle,
        result: action.result,
        userProgress: action.progress,
        error: null,
      };

    case 'LOAD_ERROR':
      return {
        ...context,
        state: 'ERROR',
        error: action.error,
      };

    case 'START_GAME':
      // Transition from NEW_USER to PLAYING
      if (context.state !== 'NEW_USER') return context;
      return {
        ...context,
        state: 'PLAYING',
      };

    case 'SELECT_COMMENT':
      // Can only select while PLAYING
      if (context.state !== 'PLAYING' && context.state !== 'SELECTED') {
        return context;
      }
      return {
        ...context,
        state: 'SELECTED',
        selectedIndex: action.index,
      };

    case 'OPEN_CONFIRM':
      // Can only confirm if comment is selected
      if (context.state !== 'SELECTED' || context.selectedIndex === null) {
        return context;
      }
      return {
        ...context,
        state: 'CONFIRMING',
      };

    case 'CANCEL_CONFIRM':
      // Return to selected state (keep selection)
      if (context.state !== 'CONFIRMING') return context;
      return {
        ...context,
        state: 'SELECTED',
      };

    case 'SUBMIT_GUESS':
      if (context.state !== 'CONFIRMING') return context;
      return {
        ...context,
        state: 'SUBMITTING',
      };

    case 'GUESS_SUCCESS':
      if (context.state !== 'SUBMITTING') return context;
      return {
        ...context,
        state: action.result.wasCorrect ? 'RESULT_CORRECT' : 'RESULT_INCORRECT',
        result: action.result,
      };

    case 'GUESS_ERROR':
      if (context.state !== 'SUBMITTING') return context;
      return {
        ...context,
        state: 'ERROR',
        error: action.error,
      };

    case 'RESET':
      return initialContext;

    default:
      return context;
  }
}

/**
 * Return type for the useGameState hook
 */
export interface UseGameStateReturn {
  // Current state
  state: GameState;
  puzzle: ShuffledPuzzle | null;
  selectedIndex: number | null;
  result: GuessResult | null;
  userProgress: UserProgress | null;
  error: string | null;

  // Actions
  startLoading: () => void;
  loadSuccess: (puzzle: ShuffledPuzzle, progress: UserProgress) => void;
  loadAlreadyPlayed: (puzzle: ShuffledPuzzle, result: GuessResult, progress: UserProgress) => void;
  loadError: (error: string) => void;
  startGame: () => void;
  selectComment: (index: number) => void;
  openConfirm: () => void;
  cancelConfirm: () => void;
  submitGuess: () => void;
  guessSuccess: (result: GuessResult) => void;
  guessError: (error: string) => void;
  reset: () => void;

  // Derived state
  isLoading: boolean;
  canSelect: boolean;
  canConfirm: boolean;
  hasResult: boolean;
}

/**
 * Main game state hook
 */
export function useGameState(): UseGameStateReturn {
  const [context, dispatch] = useReducer(gameReducer, initialContext);

  // Action dispatchers
  const startLoading = useCallback(() => dispatch({ type: 'LOAD_START' }), []);
  const loadSuccess = useCallback(
    (puzzle: ShuffledPuzzle, progress: UserProgress) =>
      dispatch({ type: 'LOAD_SUCCESS', puzzle, progress }),
    []
  );
  const loadAlreadyPlayed = useCallback(
    (puzzle: ShuffledPuzzle, result: GuessResult, progress: UserProgress) =>
      dispatch({ type: 'LOAD_ALREADY_PLAYED', puzzle, result, progress }),
    []
  );
  const loadError = useCallback(
    (error: string) => dispatch({ type: 'LOAD_ERROR', error }),
    []
  );
  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), []);
  const selectComment = useCallback(
    (index: number) => dispatch({ type: 'SELECT_COMMENT', index }),
    []
  );
  const openConfirm = useCallback(() => dispatch({ type: 'OPEN_CONFIRM' }), []);
  const cancelConfirm = useCallback(() => dispatch({ type: 'CANCEL_CONFIRM' }), []);
  const submitGuess = useCallback(() => dispatch({ type: 'SUBMIT_GUESS' }), []);
  const guessSuccess = useCallback(
    (result: GuessResult) => dispatch({ type: 'GUESS_SUCCESS', result }),
    []
  );
  const guessError = useCallback(
    (error: string) => dispatch({ type: 'GUESS_ERROR', error }),
    []
  );
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  // Derived state
  const isLoading = context.state === 'LOADING' || context.state === 'SUBMITTING';
  const canSelect = context.state === 'PLAYING' || context.state === 'SELECTED';
  const canConfirm = context.state === 'SELECTED' && context.selectedIndex !== null;
  const hasResult =
    context.state === 'RESULT_CORRECT' ||
    context.state === 'RESULT_INCORRECT' ||
    context.state === 'COMPLETED';

  return {
    // State
    state: context.state,
    puzzle: context.puzzle,
    selectedIndex: context.selectedIndex,
    result: context.result,
    userProgress: context.userProgress,
    error: context.error,

    // Actions
    startLoading,
    loadSuccess,
    loadAlreadyPlayed,
    loadError,
    startGame,
    selectComment,
    openConfirm,
    cancelConfirm,
    submitGuess,
    guessSuccess,
    guessError,
    reset,

    // Derived
    isLoading,
    canSelect,
    canConfirm,
    hasResult,
  };
}

export default useGameState;
