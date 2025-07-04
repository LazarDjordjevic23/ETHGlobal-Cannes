import "./index.scss";
import Header from "./components/Header/Header";
import { Outlet, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";

function App() {
  const location = useLocation();

  return (
    <>
      <Header />
      <main className="container">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
    </>
  );
}

export default App;
