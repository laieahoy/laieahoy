import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import AuthForm from '@site/src/components/AuthForm';

export default function LoginPage() {
  return (
    <Layout title="登录">
      <main className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <div className="padding--lg" style={{border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 12}}>
              <h1>登录</h1>
              <AuthForm mode="login" />
              <p className="margin-top--md">
                没有账号？<Link to="/register">立即注册</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
