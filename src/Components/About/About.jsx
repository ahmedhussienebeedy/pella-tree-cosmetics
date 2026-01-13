import { motion } from "framer-motion";
import first from "../../assets/images/1.jpg";
import second from "../../assets/images/2.jpg";
import third from "../../assets/images/3.jpg";

// بيانات الشركة والخدمات
const aboutInfo = {
  name: "Kres Cosmetics & Haircare",
  tagline: "جمال شعرك وبشرتك — هدفنا",
  description:
    "نحن نقدم أفضل منتجات العناية بالشعر والبشرة ومستحضرات التجميل عالية الجودة. هدفنا هو تمكين عملائنا من التألق والجمال الطبيعي بأمان وفعالية.",
  services: [
    "منتجات العناية بالشعر",
    "مستحضرات التجميل للبشرة",
    "زيوت وكريمات طبيعية",
    "استشارات ونصائح جمال",
  ],
  contact: {
    facebook: "https://web.facebook.com/Kres.makeup.artist/?_rdc=1&_rdr#",
    instagram: "https://www.instagram.com/kres.emad/",
  },
};

// معرض المنتجات / gallery
const productPics = [first, second, third];

// Bubbles animation data
const bubblesData = [
  { size: 20, color: "#FFD6E0", x: 10, delay: 0 },
  { size: 30, color: "#FFB6C1", x: 200, delay: 1 },
  { size: 25, color: "#FFC0CB", x: 400, delay: 2 },
  { size: 35, color: "#FF69B4", x: 600, delay: 0.5 },
  { size: 15, color: "#FF1493", x: 800, delay: 1.5 },
];

export default function AboutUs() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 p-8 overflow-hidden mt-16">

      {/* Bubbles background */}
      {bubblesData.map((b, idx) => (
        <motion.div
          key={idx}
          className="absolute rounded-full opacity-40"
          style={{
            width: b.size,
            height: b.size,
            backgroundColor: b.color,
            left: b.x,
            bottom: -50,
          }}
          animate={{ y: [-50, 900] }}
          transition={{ repeat: Infinity, duration: 15, delay: b.delay, ease: "linear" }}
        />
      ))}

      {/* Header */}
      <motion.div
        className="max-w-3xl mx-auto text-center mb-12 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-purple-800 mb-4">{aboutInfo.name}</h1>
        <p className="text-xl text-pink-700 font-semibold mb-6">{aboutInfo.tagline}</p>
        <p className="text-gray-700 text-lg">{aboutInfo.description}</p>
      </motion.div>

      {/* Services */}
      <motion.div
        className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 relative z-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        {aboutInfo.services.map((service, i) => (
          <motion.div
            key={i}
            className="bg-white shadow-lg rounded-xl p-6 text-center font-medium text-pink-600 hover:scale-105 transition-transform cursor-pointer"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            {service}
          </motion.div>
        ))}
      </motion.div>

      {/* Product / Gallery */}
      <motion.div
        className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.3 } },
        }}
      >
        {productPics.map((img, idx) => (
          <motion.img
            key={idx}
            src={img}
            alt={`Product ${idx}`}
            className="w-full h-60 object-cover rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.05 }}
          />
        ))}
      </motion.div>

      {/* Social Links */}
      <motion.div
        className="max-w-md mx-auto text-center mt-12 flex flex-col gap-3 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <p className="text-pink-600 mb-1">
          🔗 <a href={aboutInfo.contact.facebook} target="_blank" rel="noopener noreferrer">صفحة فيسبوك</a>
        </p>
        <p className="text-pink-600">
          🔗 <a href={aboutInfo.contact.instagram} target="_blank" rel="noopener noreferrer">انستجرام</a>
        </p>
      </motion.div>
    </div>
  );
}
