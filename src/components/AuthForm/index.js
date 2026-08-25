import React, { useState } from 'react';
import { loginUser, registerUser } from '@site/src/utils/auth';
import styles from './styles.module.css';

export default function AuthForm({ mode = 'login' }) {
  const isRegister = mode === 'register';
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    try {
      if (isRegister) {
        registerUser(form);
        window.location.href = '/';
      } else {
        loginUser(form.email, form.password);
        window.location.href = '/';
      }
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {isRegister && (
        <input
          name="username"
          placeholder="用户名"
          value={form.username}
          onChange={updateField}
          required
        />
      )}
      <input
        name="email"
        type="email"
        placeholder="邮箱"
        value={form.email}
        onChange={updateField}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="密码，至少 8 位"
        value={form.password}
        onChange={updateField}
        minLength={8}
        required
      />
      <button type="submit">
        {isRegister ? '注册账号' : '登录'}
      </button>
      {message && <p role="alert">{message}</p>}
    </form>
  );
}