import React from "react";
import logo from "@/assets/images/logo.png";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="header">
      <div className="header-content">
        <img src={logo} width={40} height={40} alt="ETHGlobal Cannes" />
        <nav className="header-nav">
          <a href="#" className="nav-link">
            Home
          </a>
          <a href="#" className="nav-link">
            About
          </a>
          <a href="#" className="nav-link">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
