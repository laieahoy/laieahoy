import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import { getCurrentUser, logoutUser } from '@site/src/utils/auth';

export default function UserMenu() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  function handleLogout() {
    logoutUser();
    setUser(null);
    window.location.assign('/');
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Link className="navbar__item navbar__link" to="/profile">
        {user.username}
      </Link>
      <button
        className="button button--secondary button--sm"
        type="button"
        onClick={handleLogout}
      >
        登出
      </button>
    </>
  );
}