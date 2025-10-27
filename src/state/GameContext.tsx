import React, { createContext, useContext, useMemo, useState } from 'react';
import { scenariosByAct, strategies, RoleKey, Scenario, roleMultipliers } from '../store/content';

export type Meters = { water: number; equity: number; cost: number };

export type GameState = {
  role?: RoleKey;
  meters: Meters;
  actIndex: number;       // 0: Intro, 1: Challenges, 2: Strategies
  scenarioIndex: number;  // index inside act
  chosenOptions: { scenarioId: string; optionId: string }[];
  chosenStrategies: string[];
  reflections: string[];
};

const initialState: GameState = {
  meters: { water: 60, equity: 60, cost: 60 },
  actIndex: 0,
  scenarioIndex: 0,
  chosenOptions: [],
  chosenStrategies: [],
  reflections: [],
};

type GameCtx = {
  state: GameState;
  setRole: (r: RoleKey) => void;
  applyOption: (s: Scenario, optionId: string) => void;
  goNext: () => void;
  goToStrategies: () => void;
  toggleStrategy: (id: string) => void;
  finishGame: () => void;
  reset: () => void;
};

const C = createContext<GameCtx | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(initialState);

  const setRole = (r: RoleKey) => setState(s => ({
    ...initialState,   // fresh run when role changes
    role: r
  }));

  const clamp = (n: number) => Math.max(0, Math.min(100, n));

  const applyDeltas = (m: Meters, d: Partial<Meters>, role?: RoleKey) => {
    const mult = role ? roleMultipliers[role] ?? {} : {};
    const wm = (d.water ?? 0) * (mult.water ?? 1);
    const em = (d.equity ?? 0) * (mult.equity ?? 1);
    const cm = (d.cost ?? 0) * (mult.cost ?? 1);
    return {
      water: clamp(m.water + wm),
      equity: clamp(m.equity + em),
      cost: clamp(m.cost + cm),
    };
  };

  const applyOption = (scenario: Scenario, optionId: string) => {
    const opt = scenario.options.find(o => o.id === optionId);
    if (!opt) return;
    setState(s => ({
      ...s,
      meters: applyDeltas(s.meters, opt.delta, s.role),
      chosenOptions: [...s.chosenOptions, { scenarioId: scenario.id, optionId }],
    }));
  };

  const goNext = () => {
    setState(s => {
      const act = scenariosByAct[s.actIndex];
      const nextScenarioIndex = s.scenarioIndex + 1;
      if (act && nextScenarioIndex < act.length) {
        return { ...s, scenarioIndex: nextScenarioIndex };
      }
      const nextAct = s.actIndex + 1;
      if (nextAct <= 1) {
        return { ...s, actIndex: nextAct, scenarioIndex: 0 };
      }
      return { ...s, actIndex: 2 };
    });
  };

  const goToStrategies = () => setState(s => ({ ...s, actIndex: 2 }));

  const toggleStrategy = (id: string) =>
    setState(s => {
      const exists = s.chosenStrategies.includes(id);
      if (exists) return { ...s, chosenStrategies: s.chosenStrategies.filter(x => x !== id) };
      if (s.chosenStrategies.length >= 3) return s;
      return { ...s, chosenStrategies: [...s.chosenStrategies, id] };
    });

  const finishGame = () => {
    setState(s => {
      const totalDelta = s.chosenStrategies
        .map(id => strategies.find(st => st.id === id)?.delta)
        .filter(Boolean)
        .reduce<Partial<Meters>>(
          (acc, d = {}) => ({
            water: (acc.water ?? 0) + (d.water ?? 0),
            equity: (acc.equity ?? 0) + (d.equity ?? 0),
            cost: (acc.cost ?? 0) + (d.cost ?? 0),
          }),
          {}
        );
      return { ...s, meters: applyDeltas(s.meters, totalDelta, s.role) };
    });
  };

  const reset = () => setState(initialState);

  const value = useMemo(
    () => ({ state, setRole, applyOption, goNext, goToStrategies, toggleStrategy, finishGame, reset }),
    [state]
  );

  return <C.Provider value={value}>{children}</C.Provider>;
};

export const useGame = () => {
  const ctx = useContext(C);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};