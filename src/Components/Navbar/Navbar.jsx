import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../../public/pella-logo.jpg"
import {
  Navbar as Nav,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";
import { FaShoppingCart } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: "الرئيسية", to: "/" },
    { name: "المنتجات", to: "/products" },
    { name: "من نحن", to: "/about" },
    { name: "تسجيل دخول الإدارة", to: "/login" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Nav
      isBordered
      className={`
        fixed top-3 left-1/2 -translate-x-1/2
        w-[95%] max-w-7xl
        rounded-2xl
        bg-white/40 dark:bg-black/30
        border border-white/20
        shadow-xl transition-all duration-500
        ${
          scrolled
            ? "shadow-pink-500/40"
            : "shadow-pink-500/20"
        }
        z-50
      `}
    >
      {/* اليسار */}
      <NavbarContent justify="start">
        <NavbarBrand className="flex items-center gap-2">
          <img
            src={logo}
            alt="الشعار"
            className="w-12 h-9 rounded-xl object-contain"
          />
        </NavbarBrand>

        {/* روابط الديسكتوب */}
        <NavbarContent className="hidden sm:flex gap-2">
          {navLinks.map((link, idx) => (
            <NavbarItem key={idx}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl transition-all duration-300
                  ${
                    isActive
                      ? "bg-pink-500/20 text-pink-600 shadow shadow-pink-500/40"
                      : "hover:bg-pink-500/10 hover:text-pink-500"
                  }`
                }
              >
                {link.name}
              </NavLink>
            </NavbarItem>
          ))}
        </NavbarContent>
      </NavbarContent>

      {/* اليمين */}
      <NavbarContent justify="end" className="gap-3">
        <NavLink
          to="/cart"
          className="relative p-2 rounded-full hover:shadow-lg hover:shadow-pink-500/50 transition"
        >
          <FaShoppingCart size={22} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full px-1">
              {totalItems}
            </span>
          )}
        </NavLink>

        {/* زر الموبايل */}
        <Button
          color="primary"
          variant="flat"
          className="sm:hidden rounded-xl"
          onPress={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
        </Button>
      </NavbarContent>

      {/* قائمة الموبايل */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay الخلفية */}
            <motion.div
              className="fixed inset-0 bg-black/20 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* القائمة نفسها مع blur */}
            <motion.div
              className="
                sm:hidden fixed top-16 right-0 w-full
                backdrop-blur-3xl bg-white/40 dark:bg-black/40
                shadow-2xl shadow-pink-500/40
                border border-white/30
                rounded-b-3xl
                flex flex-col py-5
                z-50
              "
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {navLinks.map((link, idx) => (
                <NavLink
                  key={idx}
                  to={link.to}
                  className="
                    px-6 py-3 mx-4 rounded-xl
                    hover:bg-pink-500/20
                    hover:text-pink-600
                    hover:shadow-lg hover:shadow-pink-500/30
                    transition-all duration-300
                  "
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </NavLink>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Nav>
  );
}
