import React, { Component } from 'react';
import './ErrorBoundary.css';
import Button from './Button';

/**
 * ErrorBoundary component for catching JavaScript errors in child components
 * and displaying a fallback UI instead of crashing the whole application.
 * 
 * Usage:
 * <ErrorBoundary fallback={<CustomErrorComponent />}>
 *   <YourComponent />
 * </ErrorBoundary>
 * 
 * @extends {Component}
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  /**
   * Update state when an error occurs
   * @param {Error} error - The error that was thrown
   * @returns {Object} Updated state with error information
   */
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  /**
   * Lifecycle method called when an error is caught
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Information about the component stack
   */
  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // You could also log the error to a reporting service like Sentry
    // logErrorToService(error, errorInfo);
  }

  /**
   * Reset the error state to allow the user to try again
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      // If a custom fallback is provided, use it
      if (fallback) {
        return React.cloneElement(fallback, { 
          error, 
          errorInfo, 
          resetError: this.handleReset 
        });
      }

      // Otherwise, use the default error UI
      return (
        <div className="ErrorBoundary">
          <div className="ErrorBoundary_content">
            <h2>앗! 문제가 발생했습니다.</h2>
            <p>죄송합니다. 애플리케이션에서 오류가 발생했습니다.</p>
            
            <div className="ErrorBoundary_actions">
              <Button 
                text="다시 시도" 
                onClick={this.handleReset}
                type="positive"
                tooltip="오류를 초기화하고 다시 시도합니다"
              />
              <Button 
                text="새로고침" 
                onClick={() => window.location.reload()}
                type="default"
                tooltip="페이지를 새로고침합니다"
              />
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="ErrorBoundary_details">
                <h3>오류 정보:</h3>
                <p className="ErrorBoundary_message">{error.toString()}</p>
                
                <h3>컴포넌트 스택:</h3>
                <pre className="ErrorBoundary_stack">
                  {errorInfo && errorInfo.componentStack}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    // If there's no error, render children normally
    return children;
  }
}

export default ErrorBoundary;