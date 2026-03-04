import React from 'react';

function LoadingSpinner({ fullScreen = false }) {
  const content = (
    <div className="loading-spinner" aria-label="Загрузка">
      <div className="loading-spinner__dot" />
      <div className="loading-spinner__dot" />
      <div className="loading-spinner__dot" />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-spinner-fullscreen">
        {content}
      </div>
    );
  }

  return content;
}

export default LoadingSpinner;
