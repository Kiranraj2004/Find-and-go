import React from 'react';

const Skeleton = ({ className }) => (
  <div aria-live="polite" aria-busy="true" className={className}>
    <span className="inline-flex w-full animate-pulse select-none rounded-md bg-gray-300 leading-none">
      ‌
    </span>
    <br />
  </div>
)

const SVGSkeleton = ({ className }) => (
  <svg
    className={
      className + " animate-pulse rounded bg-gray-300"
    }
  />
)

const LoadingSkeleton = () => (
  <div className="min-h-screen">
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="mb-4 flex items-center">
          <Skeleton className="w-[128px] max-w-full" />
          <SVGSkeleton className="mr-2 w-[24px] h-[24px]" />
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div>
            <p><Skeleton className="w-[32px] max-w-full" /></p>
            <p><Skeleton className="w-[80px] max-w-full" /></p>
          </div>
          <div>
            <p><Skeleton className="w-[72px] max-w-full" /></p>
            <p><Skeleton className="w-[192px] max-w-full" /></p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="mb-4 flex items-center">
            <Skeleton className="w-[184px] max-w-full" />
            <SVGSkeleton className="mr-2 w-[24px] h-[24px]" />
          </h2>
          <form className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i}>
                <label className="block mb-1">
                  <Skeleton className="w-[88px] max-w-full" />
                </label>
                <div className="w-full border border-gray-300 px-4 py-2">
                  <Skeleton className="w-[136px] max-w-full" />
                </div>
              </div>
            ))}
            <div className="w-full px-4 py-2 flex items-center justify-center">
              <Skeleton className="w-[176px] max-w-full" />
              <SVGSkeleton className="mr-2 w-[24px] h-[24px]" />
            </div>
          </form>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="mb-4 flex items-center">
            <Skeleton className="w-[160px] max-w-full" />
            <SVGSkeleton className="mr-2 w-[24px] h-[24px]" />
          </h2>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="w-[168px] max-w-full" />
                  <Skeleton className="w-[72px] max-w-full" />
                </div>
                <Skeleton className="w-[192px] max-w-full mb-3" />
                <div className="flex gap-2">
                  <Skeleton className="w-[80px] max-w-full" />
                  <Skeleton className="w-[56px] max-w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)

export { Skeleton, SVGSkeleton, LoadingSkeleton }