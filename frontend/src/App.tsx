import "./index.scss";
import Header from "./components/Header/Header";
import { Outlet, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";

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
      <Toaster richColors position="bottom-right" duration={3 * 1000} expand />
    </>
  );
}

export default App;
