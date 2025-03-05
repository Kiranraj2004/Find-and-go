import React from 'react';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-300 ${className}`} />
);

export { Skeleton };