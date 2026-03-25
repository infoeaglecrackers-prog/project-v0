import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-4">🎆</div>
      <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-dark mb-3">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-sm">
        Oops! Looks like this page went up in flames. Let's get you back on track.
      </p>
      <Link to="/" className="btn-primary px-8 py-3">Go Home</Link>
    </div>
  );
}
