import { AiDesigner, HowItWorks } from "../store/AiDesigner";
import { BestSellers, Flavors, Occasions } from "../store/Catalog";
import { CustomCta, Footer, Newsletter } from "../store/Closing";
import { Customizer } from "../store/Customizer";
import { AnnouncementBar, Navbar } from "../store/Header";
import { Hero } from "../store/Hero";
import { InspirationGallery, Offers, PopularDesigns, Reviews, WhyUs } from "../store/Showcase";

// PROTOTYPE storefront home. Images are drawn placeholders; products come from mock data.
export function Home() {
  return (
    <div className="store">
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <Occasions />
        <BestSellers />
        <AiDesigner />
        <HowItWorks />
        <Customizer />
        <Flavors />
        <PopularDesigns />
        <WhyUs />
        <Reviews />
        <Offers />
        <InspirationGallery />
        <CustomCta />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
