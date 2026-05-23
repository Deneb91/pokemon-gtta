import type { AppState, Task, Pokemon } from './types';

const STORAGE_KEY = 'pokemon-gtta-state';

export const getInitialState = (): AppState => ({
  tasks: [],
  pokemons: [],
  totalTasksCompleted: 0,
});

export const loadState = (): AppState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : getInitialState();
  } catch {
    return getInitialState();
  }
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state:', error);
  }
};

export const addTask = (state: AppState, task: Task): AppState => {
  return {
    ...state,
    tasks: [...state.tasks, task],
  };
};

export const completeTask = (state: AppState, taskId: string): AppState => {
  const updatedTasks = state.tasks.map((task) =>
    task.id === taskId
      ? { ...task, completed: true, completedAt: Date.now() }
      : task
  );

  // Add a Pokémon reward for completing a task
  const task = state.tasks.find((t) => t.id === taskId);
  const newPokemons = [...state.pokemons];

  if (task && !task.completed) {
    const newPokemon: Pokemon = {
      id: `pokemon-${Date.now()}`,
      name: task.reward || 'Pikachu',
      type: task.reward || 'Electric',
      level: 1,
      experience: 0,
      capturedAt: Date.now(),
    };
    newPokemons.push(newPokemon);
  }

  return {
    ...state,
    tasks: updatedTasks,
    pokemons: newPokemons,
    totalTasksCompleted: state.totalTasksCompleted + 1,
  };
};

export const trainPokemon = (
  state: AppState,
  pokemonId: string,
  experience: number
): AppState => {
  const updatedPokemons = state.pokemons.map((pokemon) => {
    if (pokemon.id === pokemonId) {
      const newExp = pokemon.experience + experience;
      const newLevel = Math.floor(newExp / 100) + 1;
      return {
        ...pokemon,
        experience: newExp,
        level: newLevel,
      };
    }
    return pokemon;
  });

  return {
    ...state,
    pokemons: updatedPokemons,
  };
};

export const deleteTask = (state: AppState, taskId: string): AppState => {
  return {
    ...state,
    tasks: state.tasks.filter((task) => task.id !== taskId),
  };
};
