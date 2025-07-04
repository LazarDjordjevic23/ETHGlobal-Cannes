import React from "react";
import logo from "@/assets/images/logo.png";
import { Link } from "react-router";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo-link">
          <img src={logo} width={40} height={40} alt="ETHGlobal Cannes" />
        </Link>
        <nav className="header-nav">
          <Link to="/overview" className="nav-link">
            Overview
          </Link>
          <Link to="/proposal" className="nav-link">
            Governance
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
