'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { TriangleAlert } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Canvas block rendering error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-6 border-2 border-red-200 bg-red-50 rounded-lg text-center h-full w-full min-h-[100px]">
          <TriangleAlert className="text-red-500 mb-2" size={24} />
          <h3 className="text-red-800 font-bold mb-1 text-sm">Block Rendering Error</h3>
          <p className="text-red-600 text-[10px] opacity-80">This block failed to load. Please delete it or reset settings.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
