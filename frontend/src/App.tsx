import "./index.scss";
import Header from "./components/Header/Header";
import { Outlet } from "react-router";

function App() {
  return (
    <>
      <Header />
      <main className="w-full h-full">
        <Outlet />
      </main>
    </>
  );
}

export default App;
