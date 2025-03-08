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
  
  const AdminLoadingSkeleton = () => (
    <div className="flex-1 flex flex-col items-center w-full p-4 md:p-6 lg:p-8">
      <div className="shadow-xl p-6 w-full max-w-6xl mx-auto border border-border/50 backdrop-blur-sm">
        <div>
          <h2 className="mb-6 bg-clip-text from-primary">
            <Skeleton className="w-[120px] max-w-full" />
          </h2>
        </div>
        <div className="mb-8 p-6 border border-primary/20 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2">
                <SVGSkeleton className="w-5 h-5" />
              </div>
              <div>
                <p><Skeleton className="w-[104px] max-w-full" /></p>
                <p><Skeleton className="w-[184px] max-w-full" /></p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2">
                <SVGSkeleton className="w-5 h-5" />
              </div>
              <div>
                <p><Skeleton className="w-[64px] max-w-full" /></p>
                <p><Skeleton className="w-[192px] max-w-full" /></p>
              </div>
            </div>
          </div>
        </div>
        <div className="shadow-lg p-6 w-full border border-border">
          <div>
            <h3 className="mb-6 flex items-center justify-center">
              <Skeleton className="w-[160px] max-w-full" />
              <SVGSkeleton className="mr-2 w-5 h-5" />
            </h3>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col md:flex-row justify-between items-center p-5 shadow-sm border border-border hover:border-primary/30">
                <div className="flex flex-col md:w-1/3 mb-3 md:mb-0">
                  <span><Skeleton className="w-[168px] max-w-full" /></span>
                  <span className="flex items-center">
                    <Skeleton className="w-[208px] max-w-full" />
                    <SVGSkeleton className="mr-1 w-4 h-4" />
                  </span>
                </div>
                <div className="md:w-1/2 my-2 md:my-0 md:text-left">
                  <span className="flex items-center justify-center md:justify-start">
                    <SVGSkeleton className="mr-1 w-4 h-4" />
                    <span><Skeleton className="w-[720px] max-w-full" /></span>
                  </span>
                </div>
                <div className="px-4 py-2 transition-colors flex items-center">
                  <Skeleton className="w-[48px] max-w-full" />
                  <SVGSkeleton className="mr-1 w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
  
  export { Skeleton, SVGSkeleton, AdminLoadingSkeleton }