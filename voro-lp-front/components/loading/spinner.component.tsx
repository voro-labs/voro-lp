export function Spinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-300">Carregando...</p>
      </div>
    </div>
  )
}
