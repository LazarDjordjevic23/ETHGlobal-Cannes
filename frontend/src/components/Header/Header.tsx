import React from "react";
import logo from "@/assets/images/logo.png";
import { Link, useLocation } from "react-router";
import { wait } from "@/utils/time";
import { cn } from "@/utils/className";
import ConnectButton from "../ConnectButton/ConnectButton";

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

  const isActiveLink = (linkPath: string) => {
    return pathname === linkPath;
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="flex-1">
          <Link to="/" className="logo-link">
            <img src={logo} width={40} height={40} alt="ETHGlobal Cannes" />
          </Link>
        </div>
        <nav className="header-nav flex-1 flex justify-center">
          <Link
            to="/overview"
            className={cn(
              "nav-link",
              isActiveLink("/overview") && "nav-link-active"
            )}
            onClick={handleScrollToTop}
          >
            Overview
          </Link>
          <Link
            to="/proposal"
            className={cn(
              "nav-link",
              isActiveLink("/proposal") && "nav-link-active"
            )}
            onClick={handleScrollToTop}
          >
            Governance
          </Link>
        </nav>
        <div className="flex-1">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
