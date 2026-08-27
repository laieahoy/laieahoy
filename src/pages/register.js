import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import AuthForm from '@site/src/components/AuthForm';

export default function RegisterPage() {
  return (
    <Layout title="注册">
      <main className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <div className="padding--lg" style={{border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 12}}>
              <h1>注册</h1>
              <AuthForm mode="register" />
              <p className="margin-top--md">
                已有账号？<Link to="/login">去登录</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
