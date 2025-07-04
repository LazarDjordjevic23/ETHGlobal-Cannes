import React from "react";
import logo from "@/assets/images/logo.png";
import { Link, useLocation } from "react-router";
import { wait } from "@/utils/time";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = () => {
  const { pathname } = useLocation();
  if (pathname === "/home" || pathname === "/") {
    return null;
  }

  const handleScrollToTop = async () => {
    await wait(300);
    window.scrollTo({ top: 0 });
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo-link">
          <img src={logo} width={40} height={40} alt="ETHGlobal Cannes" />
        </Link>
        <nav className="header-nav">
          <Link to="/overview" className="nav-link" onClick={handleScrollToTop}>
            Overview
          </Link>
          <Link to="/proposal" className="nav-link" onClick={handleScrollToTop}>
            Governance
          </Link>
          {/* <Link to="/agents" className="nav-link" onClick={handleScrollToTop}>
            Agents
          </Link> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
