import hammockLogo from "../assets/hammock-white.svg";

export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="glass">
      <div className="header-links">
        <img className="logo" src={hammockLogo} alt="Hammock Logo" />
        <div className="header-link">Continent</div>
        <div className="header-link">Century</div>
        <div className="header-link">Gender</div>
        <div className="header-link">Tags</div>
        <div className="header-link">Awards</div>
      </div>
      {children}
    </header>
  );
}
