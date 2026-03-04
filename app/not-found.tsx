import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <h2 className="text-2xl font-semibold mt-4 mb-2">Page Not Found</h2>
            <p className="text-muted-foreground mb-8">
                Sorry, the page you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
                Return Home
            </Link>
        </div>
    );
}
