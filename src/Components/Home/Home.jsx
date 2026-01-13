import AnimatedGradientBackground from "../Animated Background/Animated Background";
import fourth from "../../assets/images/4.jpg";
import fifth from "../../assets/images/5.jpg";
import sixth from "../../assets/images/6.jpg";
import Products from "../Products/Products";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        <AnimatedGradientBackground />

        <div className="z-10 px-4 backdrop-blur-md bg-white/10 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 drop-shadow">
            مرحباً بكم في Pella Tree
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-6">
            اكتشفوا مستحضرات التجميل الفاخرة، منتجات العناية الطبيعية، وكل ما تحتاجونه لتتألقوا بثقة.
          </p>
        </div>
      </div>

      <Products />

      {/* VIDEO */}
      <section className="py-16 bg-gradient-to-br from-pink-100 via-white to-purple-100 flex justify-center">
        <div className="backdrop-blur-xl bg-white/50 p-4 rounded-3xl shadow-2xl shadow-pink-400/40 hover:scale-105 transition duration-500">
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

      {/* ABOUT */}
      <section className="py-16 bg-gradient-to-r from-white via-pink-50 to-white text-center px-4">
        <h2 className="text-3xl font-bold text-pink-600 mb-4 drop-shadow">
          عن مستحضراتنا
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          في بيلا تري، نؤمن أن الجمال يبدأ ببشرة صحية. مستحضراتنا مصنوعة من مكونات مختارة بعناية لتعزيز جمالكم الطبيعي مع الحفاظ على نضارة وتألق بشرتكم.
        </p>
      </section>

      {/* IMAGES */}
      <section className="py-16 bg-gradient-to-br from-pink-100 to-purple-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 px-4">
          {[fourth, fifth, sixth].map((img, i) => (
            <img
              key={i}
              src={img}
              className="rounded-xl shadow-xl bg-white/60 backdrop-blur object-cover h-64 w-full hover:scale-105 transition"
              alt="product"
            />
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="py-16 bg-gradient-to-r from-white via-purple-50 to-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center px-4">
          {[
            { title: "مكونات طبيعية", desc: "تركيبات آمنة لجميع أنواع البشرة." },
            { title: "جودة عالية", desc: "منتجات موثوق بها من قبل المحترفين." },
            { title: "أسعار مناسبة", desc: "جمال فاخر بأسعار ودودة." },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-white/70 backdrop-blur-md shadow-lg hover:scale-105 transition"
            >
              <h3 className="text-xl font-semibold text-pink-600 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-20 bg-gradient-to-r from-pink-400 via-white to-purple-400 text-center text-white">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 drop-shadow">
          جمالك يبدأ من هنا
        </h2>
        <p className="mb-6 text-lg text-white/90">
          ابدأ رحلة جمالك اليوم مع Pella Tree
        </p>
      </section>
    </>
  );
}
