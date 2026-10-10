import { memo } from "react";

function Header({ name }) {
  return (
    <header className="site-header">
      <div className="header-content">
        <h1>{name}</h1>
        <p>Computer Science &amp; Engineering Student</p>
      </div>
    </header>
  );
}

export default memo(Header);