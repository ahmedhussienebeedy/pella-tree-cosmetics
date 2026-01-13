import AnimatedGradientBackground from "../Animated Background/Animated Background";
import fourth from "../../assets/images/4.jpg"
import fifth from "../../assets/images/5.jpg"
import sixth from "../../assets/images/6.jpg"

export default function Home() {
  return (
    <>
      {/* قسم الهيرو */}
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        <AnimatedGradientBackground />

        <div className="z-10 px-4">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4">
           Pella Tree مرحباً بكم في 
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-6">
            اكتشفوا مستحضرات التجميل الفاخرة، منتجات العناية الطبيعية، وكل ما تحتاجونه لتتألقوا بثقة.
          </p>

          <a href="/about">
            <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 transition rounded-full text-white font-semibold shadow-lg">
              استكشف المنتجات
            </button>
          </a>
        </div>
      </div>

      {/* قسم الفيديو */}
      <section className="py-16 bg-white flex justify-center">
        <div className="backdrop-blur-xl bg-pink-50/60 p-4 rounded-3xl shadow-2xl shadow-pink-400/40 hover:scale-105 transition duration-500">
          <iframe
            src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fweb.facebook.com%2Freel%2F1397028400779889%2F&show_text=false&width=267&t=0"
            width="320"
            height="520"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            className="rounded-2xl"
          ></iframe>
        </div>
      </section>

      {/* عن مستحضرات التجميل */}
      <section className="py-16 bg-white text-center px-4">
        <h2 className="text-3xl font-bold text-pink-600 mb-4">
          عن مستحضراتنا
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          في بيلا تري، نؤمن أن الجمال يبدأ ببشرة صحية. مستحضراتنا مصنوعة من مكونات مختارة بعناية لتعزيز جمالكم الطبيعي مع الحفاظ على نضارة وتألق بشرتكم.
        </p>
      </section>

      {/* صور المنتجات */}
      <section className="py-16 bg-pink-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 px-4">
          <img
            src={fourth}
            className="rounded-xl shadow-lg object-cover h-64 w-full hover:scale-105 transition"
            alt="مستحضرات التجميل"
          />
          <img
            src={fifth}
            className="rounded-xl shadow-lg object-cover h-64 w-full hover:scale-105 transition"
            alt="مكياج"
          />
          <img
            src={sixth}
            className="rounded-xl shadow-lg object-cover h-64 w-full hover:scale-105 transition"
            alt="جمال"
          />
        </div>
      </section>

      {/* لماذا تختارنا */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center px-4">
          <div className="p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-pink-600 mb-2">
              مكونات طبيعية
            </h3>
            <p className="text-gray-600">
              تركيبات آمنة لجميع أنواع البشرة.
            </p>
          </div>

          <div className="p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-pink-600 mb-2">
              جودة عالية
            </h3>
            <p className="text-gray-600">
              منتجات عالية الجودة موثوق بها من قبل المحترفين.
            </p>
          </div>

          <div className="p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-pink-600 mb-2">
              جمال بأسعار مناسبة
            </h3>
            <p className="text-gray-600">
              مستحضرات فاخرة بأسعار ودودة.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600 text-center text-white">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">

        </h2>
        <p className="mb-6 text-lg">
          ابدأ رحلة جمالك  اليوم...Pella Tree
        </p>
        <a href="/products">
          <button className="px-8 py-3 bg-white text-pink-600 font-semibold rounded-full hover:scale-105 transition shadow-lg">
            تسوق الآن
          </button>
        </a>
      </section>
    </>
  );
}
