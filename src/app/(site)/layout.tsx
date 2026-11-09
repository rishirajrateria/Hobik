import { Header, Footer, MobileCtaBar } from "@/components/Layout";
import { PublicChrome } from "@/components/PublicChrome";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicChrome />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <MobileCtaBar />
    </>
  );
}
