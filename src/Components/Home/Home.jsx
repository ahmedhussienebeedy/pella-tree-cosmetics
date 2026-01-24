import AnimatedGradientBackground from "../Animated Background/Animated Background";

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


      {/* ABOUT */}
      <section className="py-16 bg-gradient-to-r from-white via-pink-50 to-white text-center px-4">
        <h2 className="text-3xl font-bold text-pink-600 mb-4 drop-shadow">
          عن مستحضراتنا
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          في بيلا تري، نؤمن أن الجمال يبدأ ببشرة صحية. مستحضراتنا مصنوعة من مكونات مختارة بعناية لتعزيز جمالكم الطبيعي مع الحفاظ على نضارة وتألق بشرتكم.
        </p>
      </section>

    


    </>
  );
}
