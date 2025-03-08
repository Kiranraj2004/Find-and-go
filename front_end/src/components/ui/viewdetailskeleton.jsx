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

const ViewDetailsSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="mb-8">
      <div className="border rounded-lg shadow-sm">
        <div className="space-y-1.5 p-6 flex flex-row items-center space-x-4 bg-primary/10">
          <SVGSkeleton className="w-10 h-10" />
          <div>
            <div className="tracking-tight">
              <Skeleton className="w-[200px] max-w-full h-8" />
            </div>
            <p>
              <Skeleton className="w-[300px] max-w-full h-4 mt-2" />
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="border rounded-lg shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex items-center space-x-3">
          <SVGSkeleton className="w-6 h-6" />
          <div className="tracking-tight">
            <Skeleton className="w-[180px] max-w-full h-7" />
          </div>
        </div>
      </div>
      <div className="p-6 pt-0">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="border border-border rounded-lg p-4 hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <SVGSkeleton className="w-6 h-6" />
                </div>
                <div>
                  <Skeleton className="w-[150px] max-w-full h-6 mb-2" />
                  <Skeleton className="w-[100px] max-w-full h-4" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="w-[80px] max-w-full h-4" />
                  <div className="w-24 h-8 rounded-md bg-gray-300 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="flex justify-center mt-8">
      <div className="w-24 h-10 rounded-md bg-gray-300 animate-pulse" />
    </div>
  </div>
)

export { ViewDetailsSkeleton }