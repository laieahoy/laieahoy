import React from 'react';
import ThemeProvider from './ThemeProvider';
import BackToTop from '@site/src/components/BackToTop';

function RootShell({children}) {
  return (
    <>
      {children}
      <BackToTop />
    </>
  );
}

export default function Root({children}) {
  return (
    <ThemeProvider>
      <RootShell>{children}</RootShell>
    </ThemeProvider>
  );
}