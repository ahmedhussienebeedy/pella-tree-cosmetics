import { Link, Button } from "@heroui/react";
import logo from "../../../public/pella-logo.jpg";

export default function Footer() {
  return (
    <footer className="bg-default-200 dark:bg-default-800 text-default-800 dark:text-default-100 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8">

        {/* Logo + Rights */}
        <div className="flex flex-col items-start gap-2">
          <img
            src={logo}
            alt="Logo"
            className="w-20 h-14 rounded-2xl object-contain"
          />
          <p className="text-sm text-default-600 dark:text-default-400">
            Pella Tree © 2026. All rights reserved.
          </p>
        </div>

        {/* Links */}
        <div className="flex justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-default-800 dark:text-default-100">Products</h4>
            <Link href="/products" className="hover:text-primary transition-colors">All Products</Link>
            <Link href="/products" className="hover:text-primary transition-colors">Pricing</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-default-800 dark:text-default-100">Company</h4>
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link href="/products" className="hover:text-primary transition-colors">Careers</Link>
          </div>
         
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-default-800 dark:text-default-100">Subscribe</h4>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-3 py-2 rounded-lg border border-default-400 bg-default-100 dark:bg-default-700 text-default-800 dark:text-default-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <Button color="primary" variant="flat">Subscribe</Button>
          </div>
        </div>

      </div>
    </footer>
  );
}
