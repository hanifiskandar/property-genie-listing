import Image from "next/image";

const LINKS = {
  Discover: ["Buy a Home", "Rent a Property", "New Launches", "Auction Listings", "Commercial Properties"],
  Company:  ["About Us", "Careers", "Press", "Blog", "Contact Us"],
  Support:  ["Help Centre", "Privacy Policy", "Terms of Use", "Cookie Policy", "Sitemap"],
};

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-14">

        {/* Top row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">

          {/* Brand column */}
          <div className="space-y-4">
            <Image src="/logo.webp" alt="PropertyGenie" width={110} height={36} className="brightness-0 invert opacity-80" />
            <p className="text-sm leading-relaxed">
              Malaysia&apos;s smarter way to find your dream property. Search, filter, and save the listings that matter to you.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {["f", "in", "tw", "ig"].map((s) => (
                <span
                  key={s}
                  className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-500 hover:border-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-widest mb-4">{heading}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-indigo-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} PropertyGenie Sdn Bhd. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with
            <span className="text-indigo-500 font-semibold">Next.js</span>
            &amp;
            <span className="text-indigo-500 font-semibold">Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
