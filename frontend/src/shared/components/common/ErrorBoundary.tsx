"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  featureName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[ErrorBoundary] Error in feature: ${this.props.featureName || 'Unknown'}`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 rounded-xl border border-red-100 bg-red-50/50 dark:bg-red-900/10 dark:border-red-900/20 text-center">
          <div className="flex justify-center mb-2">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <h3 className="text-sm font-bold text-red-900 dark:text-red-200 mb-1">
            {this.props.featureName || 'Tính năng'} gặp sự cố
          </h3>
          <p className="text-xs text-red-700 dark:text-red-300 mb-3 opacity-80">
            Có lỗi xảy ra trong quá trình xử lý module này.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white text-[11px] font-bold rounded-lg hover:bg-red-600 transition-all uppercase tracking-wider"
          >
            <RefreshCcw size={12} className="mr-1.5" /> Thử lại
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

