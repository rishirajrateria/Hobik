import Link from "next/link";
import { Header, Footer } from "@/components/Layout";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="container-x py-24 sm:py-32">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-5 max-w-2xl text-[44px] leading-[1.05] font-medium text-ink-950 sm:text-[60px]">We couldn&apos;t find that page</h1>
        <p className="mt-5 max-w-xl text-[18px] text-ink-700">It may have moved, or the link may be out of date.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/" className="btn-ink">Go to the homepage</Link>
          <Link href="/get-a-quote" className="btn-outline">Get a quote</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
