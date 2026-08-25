import React, { useEffect, useState } from 'react';
import { getCurrentUser, logoutUser } from '@site/src/utils/auth';

export default function UserMenu() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  if (!user) {
    return (
      <div>
        <a href="/login">登录</a>
        <span> / </span>
        <a href="/register">注册</a>
      </div>
    );
  }

  function handleLogout() {
    logoutUser();
    setUser(null);
    window.location.href = '/';
  }

  return (
    <div>
      <a href="/profile">{user.username}</a>
      <button type="button" onClick={handleLogout}>登出</button>
    </div>
  );
}