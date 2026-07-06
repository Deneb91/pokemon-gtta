import "react";
import { useState, type JSX } from "react";
import "../styles/KebabMenu.css";
export interface KebabMenuProps {
  children: JSX.Element[] | null;
}

export function KebabMenu({ children }: KebabMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="kebab-menu-container">
      <button
        className="kebab-menu"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setIsOpen(false)}
      >
        <span className="kebab-icon">|||</span>
      </button>
      <div className={`kebab-dropdown ${isOpen ? "open" : ""}`}>{children}</div>
    </div>
  );
}
