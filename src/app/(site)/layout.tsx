import { Header, Footer, MobileCtaBar } from "@/components/Layout";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <MobileCtaBar />
    </>
  );
}
