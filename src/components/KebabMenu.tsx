import "react";
import { useState, type JSX } from "react";
import "../styles/KebabMenu.css";
export interface KebabMenuProps {
  children: JSX.Element[] | null;
}

export function KebabMenu({ children }: KebabMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <button
      className="kebab-menu"
      onClick={() => setIsOpen(!isOpen)}
      onBlur={() => setIsOpen(false)}
    >
      <span className="kebab-icon">|||</span>
      <div className={`kebab-dropdown ${isOpen ? "open" : ""}`}>{children}</div>
    </button>
  );
}
