export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium">Applying style transfer...</p>
        <p className="text-sm text-gray-500">This may take a few moments</p>
      </div>
    </div>
  )
}
