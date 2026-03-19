
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-footer-dark text-footer-light py-10 px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-t border-footer-border">
      <div className="flex items-center gap-4">
        <Image src="/images/medicom_toy_logo.jpg" alt="Medicom Toy Logo" width={120} height={40} priority className="object-contain" />
        <Image src="/logo_BB_white.svg" alt="BEARBRICK Logo" width={120} height={40} priority className="object-contain invert" />
      </div>
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full md:w-auto">
        <div>
          <h3 className="font-semibold mb-2">Contact Us</h3>
          <Link href="/contact" className="hover:underline">Contact form</Link>
          <p>Email: info@bearbrickpopup.com</p>
          <p>Phone: +852 1234 5678</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Follow Us</h3>
          <div className="flex gap-3">
            <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">
              <svg width="28" height="28" fill="currentColor" className="hover:text-footer-accent"><circle cx="14" cy="14" r="13" stroke="white" strokeWidth="2" fill="none"/><path d="M14 9a5 5 0 1 0 0 10a5 5 0 0 0 0-10zm0 8a3 3 0 1 1 0-6a3 3 0 0 1 0 6zm5.5-8.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0z"/></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook">
              <svg width="28" height="28" fill="currentColor" className="hover:text-footer-accent"><circle cx="14" cy="14" r="13" stroke="white" strokeWidth="2" fill="none"/><path d="M17 9h-2a2 2 0 0 0-2 2v2h-2v3h2v6h3v-6h2.1l.9-3H16v-1a1 1 0 0 1 1-1h1V9z"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener" aria-label="YouTube">
              <svg width="28" height="28" fill="currentColor" className="hover:text-footer-accent"><circle cx="14" cy="14" r="13" stroke="white" strokeWidth="2" fill="none"/><rect x="10" y="11" width="8" height="6" rx="1"/><polygon points="14,13 16,14 14,15" fill="white"/></svg>
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">FAQ</h3>
          <Link href="/faq" className="hover:underline">Frequently Asked Questions</Link>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Address</h3>
          <p>Shop G/F, 123 Bearbrick Street, Central, Hong Kong</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Subscribe</h3>
          <form className="flex gap-2">
            <input type="email" placeholder="Your email" className="rounded px-2 py-1 bg-footer-input text-footer-light border border-footer-border" required />
            <button type="submit" className="bg-footer-accent text-white px-4 py-1 rounded hover:bg-footer-accent-dark">Subscribe</button>
          </form>
        </div>
      </div>
    </footer>
  );
}
