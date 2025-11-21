import React, { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-gray-800 border border-red-500/30 rounded-2xl p-8 shadow-2xl text-center">
            <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-red-400">System Malfunction</h2>
            <p className="text-gray-400 mb-6">
              The plant monitoring system encountered a critical error.
            </p>
            <div className="bg-black/30 p-4 rounded-lg mb-6 text-left overflow-auto max-h-32">
              <code className="text-xs text-red-300 font-mono">
                {this.state.error?.message || "Unknown Error"}
              </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-red-900/20"
            >
              <RefreshCw size={18} /> Reboot System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
