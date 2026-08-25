import React from 'react';
import SpiderClock from '@site/src/components/SpiderClock';
import BackToTop from '@site/src/components/BackToTop';
import ReadingProgress from '@site/src/components/ReadingProgress';

export default function Root({children}) {
  return (
    <>
      <ReadingProgress />
      {children}
      <BackToTop />
      <SpiderClock />
    </>
  );
}