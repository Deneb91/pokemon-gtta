import { useState, useEffect } from 'react'
import { TaskList } from './components/TaskList'
import { PokemonCollection } from './components/PokemonCollection'
import {
  loadState,
  saveState,
  addTask,
  completeTask,
  deleteTask,
  trainPokemon,
} from './lib/storage'
import type { Task, AppState } from './lib/types'
import './App.css'

function App() {
  const [state, setState] = useState<AppState | null>(null)
  const [currentTab, setCurrentTab] = useState<'tasks' | 'collection'>('tasks')

  // Load state on mount
  useEffect(() => {
    setState(loadState())
  }, [])

  // Save state whenever it changes
  useEffect(() => {
    if (state) {
      saveState(state)
    }
  }, [state])

  if (!state) {
    return <div className="loading">Loading...</div>
  }

  const handleAddTask = (task: Task) => {
    setState(addTask(state, task))
  }

  const handleCompleteTask = (taskId: string) => {
    setState(completeTask(state, taskId))
  }

  const handleDeleteTask = (taskId: string) => {
    setState(deleteTask(state, taskId))
  }

  const handleTrainPokemon = (pokemonId: string) => {
    setState(trainPokemon(state, pokemonId, 10))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎮 Pokémon Tidy-Up Quest</h1>
        <p>Clean your place and catch Pokémon!</p>
      </header>

      <nav className="tab-navigation">
        <button
          className={`tab-btn ${currentTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setCurrentTab('tasks')}
        >
          📋 Tasks
        </button>
        <button
          className={`tab-btn ${currentTab === 'collection' ? 'active' : ''}`}
          onClick={() => setCurrentTab('collection')}
        >
          🎁 Collection ({state.pokemons.length})
        </button>
      </nav>

      <main className="app-main">
        {currentTab === 'tasks' ? (
          <TaskList
            tasks={state.tasks}
            onAddTask={handleAddTask}
            onCompleteTask={handleCompleteTask}
            onDeleteTask={handleDeleteTask}
          />
        ) : (
          <PokemonCollection
            pokemons={state.pokemons}
            onTrain={handleTrainPokemon}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Keep your place tidy and grow your Pokémon! 🌟</p>
      </footer>
    </div>
  )
}

export default App
