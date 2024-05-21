import { Author } from "..";
import chevronUpIcon from "../assets/chevron-up.svg";

export default function Sidebar({
  children,
  active,
  setActive,
}: {
  children: React.ReactNode;
  active: boolean;
  setActive: (author: Author | null) => void;
}) {
  return (
    <div id="sidebar" className="sidebar glass">
      <div className="sidebar-title">
        <span id="sidebar-title">{active ? "Back to Results" : "Results"}</span>
        <button
          className="button button-primary"
          onClick={() => {
            if (active) {
              setActive(null);
            }
          }}
        >
          <img
            id="chevron"
            width="16px"
            src={chevronUpIcon}
            alt="Toggle Sidebar"
            style={{ transform: active ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>
      </div>
      {children}
    </div>
  );
}
