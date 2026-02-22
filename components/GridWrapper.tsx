'use client';

import React from 'react';

import { Responsive, WidthProvider } from 'react-grid-layout/legacy';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function GridWrapper(props: any) {
  return <ResponsiveGridLayout {...props} />;
}
