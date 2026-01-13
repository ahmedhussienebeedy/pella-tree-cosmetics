import logo from "../../../public/pella-logo.jpg";
import { FaFacebookF, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Footer() {
  const socials = [
    { icon: <FaFacebookF />, link: "https://web.facebook.com/kres.emad/" },
    { icon: <FaInstagram />, link: "https://www.instagram.com/kres.emad/" },
  ];

  const address = " Egypt";

  return (
    <footer className="relative bg-[#F8F8F8] text-gray-800 pt-16 pb-10 overflow-hidden">

      {/* Glow bubbles subtle */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-32 h-32 bg-white/30 rounded-full blur-3xl top-10 left-10"></div>
        <div className="absolute w-40 h-40 bg-white/30 rounded-3xl bottom-10 right-10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-10">

        {/* Logo + Rights */}
        <div className="flex flex-col gap-3">
          <img
            src={logo}
            alt="Logo"
            className="w-24 h-16 rounded-2xl object-contain shadow-md bg-white p-1"
          />
          <p className="text-sm text-gray-500">
            Pella Tree © 2026. All rights reserved.
          </p>
        </div>

        {/* Address */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-gray-800 mb-2">Address</h4>
          <div className="flex items-center gap-2 text-gray-600">
            <FaMapMarkerAlt /> <span>{address}</span>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold">Follow Us</h4>

          <div className="flex gap-4">
            {socials.map((s, i) => (
              <motion.a
                key={i}
                href={s.link}
                target="_blank"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white shadow-md p-3 rounded-full text-gray-800 hover:text-pink-600 hover:shadow-xl transition"
              >
                {s.icon}
              </motion.a>
            ))}
          </div>

          <p className="text-sm text-gray-500">
            Stay connected with us on social media ✨
          </p>
        </div>

      </div>

      {/* Bottom line */}
      <div className="mt-10 text-center text-sm text-gray-500">
        Designed with ❤️ for beauty lovers
      </div>
    </footer>
  );
}
