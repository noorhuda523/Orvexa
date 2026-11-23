import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import SkipLink from '../components/SkipLink';
import usePageMeta from '../hooks/usePageMeta';
import { ScrollProgressBar, ScrollToTopButton } from '../components/ScrollControls';
// NexoraBackground is now mounted globally in main.jsx — no per-layout background needed.

export default function MarketingLayout() {
  const mainRef = usePageMeta();
  return (
    <>
      <ScrollProgressBar />
      <SkipLink />
      <Navbar />
      <main ref={mainRef} tabIndex={-1}><Outlet /></main>
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
