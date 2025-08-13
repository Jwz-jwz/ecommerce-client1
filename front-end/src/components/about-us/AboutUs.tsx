"use client";

import { Users, Home, Heart, Leaf, MessageCircle } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white text-black">
        {/* <div className="absolute inset-0 bg-blue-900 opacity-20"></div> */}
        <div className="max-w-6xl mx-auto px-4 py-10 relative z-10">
          <h1 className="text-2xl md:text-5xl font-bold  text-center">
            Бидний тухай
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="md:flex justify-between gap-5">
          {/* Mission */}
          <div className="mb-24 w-full md:w-1/2">
            <div className="text-center mb-8">
              <div className="inline-block px-4 py-1 bg-gray-100 text-gray-800 rounded-full font-medium text-sm ">
                Эрхэм зорилго
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-[var(--gray200)]"></div>
              <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
                Бид таны гэрийн уур амьсгалыг дулаан, тав тухтай байлгах
                зорилгоор энгийн атлаа онцгой дизайнтай бүтээгдэхүүнүүдийг санал
                болгодог. Бидний гол зорилго бол чанартай, хүнд хүрсэн, сэтгэлд
                нийцсэн бүтээгдэхүүнүүдийг хүргэх юм.
              </p>
            </div>
          </div>

          {/* Our Story */}

          <div className="mb-24 w-full md:w-1/2 ">
            <div className="text-center mb-8">
              <div className="inline-block px-4 py-1 bg-gray-100 text-gray-800 rounded-full font-medium text-sm ">
                Бидний түүх
              </div>
              {/* <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Жижигхэн мөрөөдлөөс эхэлсэн аялал
              </h2> */}
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-[var(--gray200)]"></div>
              <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
                2010 онд бид жижигхэн цех, цөөхөн ажилтантайгаар эхлүүлсэн.
                Өнөөдөр бид улс даяар хэрэглэгчдэд үйлчилж, гэр орныг тав тухтай
                болгоход тусалдаг томоохон компани болж чадсан. Бидний ололт
                амжилтын түлхүүр нь чанартай бүтээгдэхүүн, найдвартай
                үйлчилгээнд оршдог.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-24">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-1 bg-gray-100 text-gray-800 rounded-full font-medium text-sm mb-3">
              Үнэт зүйлс
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-6">
                <Heart size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Чанар ба найдвартай байдал
              </h3>
              <p className="text-[var(--gray600)]">
                Бид үргэлж хамгийн өндөр стандартыг баримталдаг
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-6">
                <Users size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Хэрэглэгч төвтэй үйлчилгээ
              </h3>
              <p className="text-[var(--gray600)]">
                Хэрэглэгчдийн хэрэгцээг нэн тэргүүнд тавьдаг
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="bg-purple-100 p-4 rounded-full mb-6">
                <Home size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Дизайн ба функцийн хослол
              </h3>
              <p className="text-[var(--gray600)]">
                Үзэмж ба практик хэрэглээний төгс тэнцвэр
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="bg-yellow-100 p-4 rounded-full mb-6">
                <Leaf size={32} className="text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Байгальд ээлтэй сэтгэлгээ
              </h3>
              <p className="text-[var(--gray600)]">
                Тогтвортой, байгальд ээлтэй шийдлүүд
              </p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-24">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-1 bg-gray-100 text-gray-800 rounded-full font-medium text-sm mb-3">
              Манай баг
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 text-center group">
              <div className="relative mb-6 mx-auto">
                <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-lg group-hover:border-blue-100 transition-all">
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <Users size={60} className="text-blue-300" />
                  </div>
                </div>
                <div className="absolute bottom-0 right-1/4 bg-blue-500 text-white p-2 rounded-full shadow-lg">
                  <Users size={20} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1">Батбаяр Дорж</h3>
              <p className="text-blue-600 font-medium mb-3">
                Гүйцэтгэх захирал
              </p>
              <p className="text-gray-500 text-sm">10+ жилийн туршлагатай</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 text-center group">
              <div className="relative mb-6 mx-auto">
                <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-lg group-hover:border-green-100 transition-all">
                  <div className="w-full h-full bg-green-100 flex items-center justify-center">
                    <Users size={60} className="text-green-300" />
                  </div>
                </div>
                <div className="absolute bottom-0 right-1/4 bg-green-500 text-white p-2 rounded-full shadow-lg">
                  <Heart size={20} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1">Оюун Цэрэн</h3>
              <p className="text-green-600 font-medium mb-3">Дизайн менежер</p>
              <p className="text-gray-500 text-sm">Шилдэг дизайнер</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 text-center group">
              <div className="relative mb-6 mx-auto">
                <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-lg group-hover:border-purple-100 transition-all">
                  <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                    <Users size={60} className="text-purple-300" />
                  </div>
                </div>
                <div className="absolute bottom-0 right-1/4 bg-purple-500 text-white p-2 rounded-full shadow-lg">
                  <MessageCircle size={20} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1">Золжаргал Баяр</h3>
              <p className="text-purple-600 font-medium mb-3">
                Борлуулалтын менежер
              </p>
              <p className="text-gray-500 text-sm">Харилцааны мастер</p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pb-12 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Бидэнтэй холбогдохыг хүсвэл?
          </h3>
          <p className="text-[var(--gray600)] text-lg mb-8">
            Хүсэлт, асуулт, санал байвал бидэнтэй шууд холбоо бариарай.
          </p>
          <a
            href="/contactus"
            className="inline-flex items-center px-8 py-4 bg-gray-800 text-white border-gray-800 rounded-full  transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg font-medium"
          >
            <MessageCircle size={20} className="mr-2" />
            Холбоо барих
          </a>
        </div>
      </div>
    </div>
  );
}
