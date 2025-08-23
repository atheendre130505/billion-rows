import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto py-4 px-4 text-center text-muted-foreground text-sm">
        <div className="flex justify-center items-center space-x-4">
          <Link href="#" className="hover:text-primary transition-colors">
            Challenge Rules
          </Link>
          <span className="text-border">|</span>
          <Link href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
        </div>
        <p className="mt-2">
          Billion Row - Built with passion for performance.
        </p>
      </div>
    </footer>
  );
}
