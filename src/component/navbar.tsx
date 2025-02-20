const Navbar = () => {

  return (
    <header className="nav-container">
      <aside className="nav-header">
        <a href="/">
          <p >Sale Dashboard</p>
        </a>
      </aside>
      <nav className="nav-link">
        <ul className="flex items-center gap-12 list-none">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/download">Download</a>
          </li>
          <li>
            <a href="/summary">Summary</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
