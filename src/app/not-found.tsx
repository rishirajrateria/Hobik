import Link from "next/link";
import { Header, Footer } from "@/components/Layout";
import { Ambient } from "@/components/Ambient";

export default function NotFound() {
  return (
    <>
      <Ambient />
      <Header />
      <main id="main" className="container-x grid min-h-[70vh] place-items-center pt-36 pb-24 text-center">
        <div>
          <p className="font-display text-9xl font-extrabold text-gradient-dark">404</p>
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
