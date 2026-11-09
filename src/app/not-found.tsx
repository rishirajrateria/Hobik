import Link from "next/link";
import { Header, Footer } from "@/components/Layout";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="container-x grid min-h-[60vh] place-items-center py-24 text-center">
        <div>
          <p className="font-display text-8xl font-extrabold text-gold-400">404</p>
          <h1 className="mt-4 text-3xl font-extrabold text-navy-950">This page has moved.</h1>
          <p className="mt-2 text-slate-600">Let&apos;s get you back on track.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/" className="btn-navy">Home</Link>
            <Link href="/get-a-quote" className="btn-gold">Free Quote</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
