import React from "react";
import logo from "@/assets/images/logo2.png";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "ETHGlobal Cannes" }) => {
  return (
    <header className="header">
      <div className="header-content">
        {/* <h1 className="header-title">{title}</h1> */}
        <img src={logo} width={60} height={60} alt="ETHGlobal Cannes" />
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
