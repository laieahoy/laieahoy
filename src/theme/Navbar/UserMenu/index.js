import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import { getCurrentUser, logoutUser } from '@site/src/utils/auth';

export default function UserMenu() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  if (!user) {
    return null;
  }

  function handleLogout() {
    logoutUser();
    setUser(null);
    window.location.href = '/';
  }

  return (
    <div>
      <Link to="/profile">{user.username}</Link>
      <button type="button" onClick={handleLogout}>登出</button>
    </div>
  );
}