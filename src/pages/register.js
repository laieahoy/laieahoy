import React from 'react';
import Layout from '@theme/Layout';
import AuthForm from '@site/src/components/AuthForm';

export default function RegisterPage() {
  return (
    <Layout title="注册">
      <main className="container margin-vert--lg">
        <h1>注册</h1>
        <AuthForm mode="register" />
        <p>已有账号？<a href="/login">立即登录</a></p>
      </main>
    </Layout>
  );
}