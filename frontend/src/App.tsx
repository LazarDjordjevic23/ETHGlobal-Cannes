import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./index.scss";
import Header from "./components/Header";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <main className="main-content">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-4">
            <a href="https://vite.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>ETHGlobal Cannes</h1>
          <p className="text-center">
            A modern governance platform built with React + Vite
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="card">
            <div className="text-center">
              <h2
                className="mb-4"
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#111827",
                }}
              >
                Interactive Counter
              </h2>
              <button
                onClick={() => setCount((count) => count + 1)}
                className="mb-4"
              >
                Count is {count}
              </button>
              <p
                className="text-center"
                style={{ fontSize: "0.9rem", color: "#6b7280" }}
              >
                Edit <code>src/App.tsx</code> and save to test HMR
              </p>
            </div>
          </div>

          <div className="card">
            <h3
              className="mb-4"
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              Getting Started
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="status-badge active">Ready</span>
                <span>React + TypeScript setup</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="status-badge active">Ready</span>
                <span>Vite development server</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="status-badge pending">Pending</span>
                <span>Your awesome features</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3
              className="mb-4"
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              Resources
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="https://react.dev"
                target="_blank"
                className="nav-link"
                style={{
                  padding: "0.5rem 0",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                📚 Learn React
              </a>
              <a
                href="https://vite.dev"
                target="_blank"
                className="nav-link"
                style={{
                  padding: "0.5rem 0",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                ⚡ Vite Documentation
              </a>
              <a
                href="https://www.tally.xyz"
                target="_blank"
                className="nav-link"
                style={{ padding: "0.5rem 0" }}
              >
                🏛️ Tally Governance
              </a>
            </div>
          </div>
        </div>

        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </main>
    </>
  );
}

export default App;
