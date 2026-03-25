export default function Loader({ fullPage = false }: { fullPage?: boolean }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  );
  if (fullPage) {
    return <div className="min-h-screen flex items-center justify-center">{spinner}</div>;
  }
  return <div className="py-16 flex items-center justify-center">{spinner}</div>;
}
