import React from 'react';

const Loader = ({ fullScreen = false }) => {
  const loaderCore = (
    <div className="relative w-16 h-16">
      <div className="absolute top-0 w-16 h-16 rounded-full border-4 border-gray-800"></div>
      <div className="absolute top-0 w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        {loaderCore}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {loaderCore}
    </div>
  );
};

export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-surface rounded-lg ${className}`}></div>
);

export default Loader;
