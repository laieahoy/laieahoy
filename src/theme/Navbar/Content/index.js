import React from 'react';
import Content from '@theme-original/Navbar/Content';
import SpiderClock from '@site/src/components/SpiderClock';

export default function ContentWrapper(props) {
  return (
    <>
      <SpiderClock />
      <Content {...props} />
    </>
  );
}