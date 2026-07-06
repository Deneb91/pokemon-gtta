import { useEffect, useState } from "react";
import "./App.css";
import { ErrorRecoveryModal } from "./components/ErrorRecoveryModal";
import { HeaderActions } from "./components/HeaderActions";
import { PokemonCollection } from "./components/PokemonCollection";
import { TaskList } from "./components/TaskList";
import {
  addTask,
  completeTask,
  deleteTask,
  downloadSaveFileForRecovery,
  getInitialState,
  loadState,
  saveState,
  trainPokemon,
  updatePokemonName,
  useImportedState,
} from "./lib/storage/storage";
import type { Task } from "./lib/tasks";
import type { AppState } from "./lib/types";

function App() {
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [state, setState] = useState<AppState | null>(() => {
    try {
      return loadState();
    } catch (error) {
      setLoadError(
        error instanceof Error ? error : new Error("Failed to load state"),
      );
      return null;
    }
  });
  const [currentTab, setCurrentTab] = useState<"tasks" | "collection">("tasks");
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Save state whenever it changes
  useEffect(() => {
    if (state) {
      saveState(state);
    }
  }, [state]);

  // Listen for import state events from HeaderActions
  useImportedState(setState);

  const handleDismissError = () => {
    setLoadError(null);
    setState(getInitialState());
  };

  const handleDownloadSaveFile = () => {
    const stored = localStorage.getItem("pokemon-gtta-state");
    if (stored) {
      downloadSaveFileForRecovery(stored);
    }
  };

  // Show error modal if load failed
  if (loadError && !state) {
    return (
      <div className="app">
        <ErrorRecoveryModal
          isOpen={true}
          error={loadError}
          onDismiss={handleDismissError}
          onDownload={handleDownloadSaveFile}
        />
      </div>
    );
  }

  if (!state) {
    return <div className="loading">Loading...</div>;
  }

  const handleAddTask = (task: Task) => {
    setState(addTask(state, task));
  };

  const handleCompleteTask = (taskId: string) => {
    setState(completeTask(state, taskId));
  };

  const handleDeleteTask = (taskId: string) => {
    setState(deleteTask(state, taskId));
  };

  const handleTrainPokemon = (pokemonId: string) => {
    setState(trainPokemon(state, pokemonId, 10));
  };

  const handleUpdatePokemonName = (pokemonId: string, newName: string) => {
    setState(updatePokemonName(state, pokemonId, newName));
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>🎮 Pokémon Tidy-Up Quest</h1>
            <p>Clean your place and catch Pokémon!</p>
          </div>
          <HeaderActions state={state} onStatusMessage={setStatusMessage} />
        </div>
        {statusMessage && (
          <div className={`status-message status-${statusMessage.type}`}>
            <span className="status-text">{statusMessage.text}</span>
            <button
              className="status-close"
              onClick={() => setStatusMessage(null)}
              aria-label="Close status message"
            >
              ✕
            </button>
          </div>
        )}
      </header>

      <nav className="tab-navigation">
        <button
          className={`tab-btn ${currentTab === "tasks" ? "active" : ""}`}
          onClick={() => setCurrentTab("tasks")}
        >
          📋 Tasks
        </button>
        <button
          className={`tab-btn ${currentTab === "collection" ? "active" : ""}`}
          onClick={() => setCurrentTab("collection")}
        >
          🎁 Collection ({state.pokemons.length})
        </button>
      </nav>

      <main className="app-main">
        {currentTab === "tasks" ? (
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
            onUpdateName={handleUpdatePokemonName}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Keep your place tidy and grow your Pokémon! 🌟</p>
      </footer>
    </div>
  );
}

export default App;
