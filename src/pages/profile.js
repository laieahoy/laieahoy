import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import {
  getCurrentUser,
  updateCurrentUser,
} from '@site/src/utils/auth';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      window.location.assign('/login');
      return;
    }

    setUser(currentUser);
    setUsername(currentUser.username);
    setBio(currentUser.bio || '');
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    const updatedUser = updateCurrentUser({ username, bio });
    setUser(updatedUser);
    setMessage('个人资料已保存。');
  }

  if (!user) {
    return null;
  }

  return (
    <Layout title="个人资料">
      <main className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <h1>个人资料</h1>

            <img
              src={user.avatar}
              alt={`${user.username} 的头像`}
              width="80"
              height="80"
            />

            <p>{user.email}</p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="username">用户名</label>
              <input
                id="username"
                className="margin-bottom--md"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />

              <label htmlFor="bio">个人简介</label>
              <textarea
                id="bio"
                className="margin-bottom--md"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                rows="4"
              />

              <button className="button button--primary" type="submit">
                保存资料
              </button>
            </form>

            {message && <p role="status">{message}</p>}
          </div>
        </div>
      </main>
    </Layout>
  );
}