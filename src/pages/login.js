import React from 'react';
import Layout from '@theme/Layout';
import AuthForm from '@site/src/components/AuthForm';

export default function LoginPage() {
  return (
    <Layout title="登录">
      <main className="container margin-vert--lg">
        <h1>登录</h1>
        <AuthForm mode="login" />
        <p>还没有账号？<a href="/register">立即注册</a></p>
      </main>
    </Layout>
  );
}