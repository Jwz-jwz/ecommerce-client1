"use client";

import { SetStateAction, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  FileQuestion,
  Truck,
  ShoppingBag,
  RotateCcw,
  ChevronDown,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

export default function ContactUs() {
  const [activeTab, setActiveTab] = useState("contact");
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    if (activeQuestion === index) {
      setActiveQuestion(null);
    } else {
      setActiveQuestion(index);
    }
  };

  const faqs = [
    {
      question: "Хүргэлтийн үнэ хэд вэ?",
      answer: "Улаанбаатар хотод 10,000₮, орон нутагт 20,000₮-30,000₮.",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      question: "Хүргэлт хэр удаан хүргэгдэх вэ?",
      answer: "Улаанбаатар хотод 1-3 өдөр, орон нутагт 3-7 өдөр.",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      question: "Бүтээгдэхүүнээ буцаах боломжтой юу?",
      answer: "Тийм, хүлээн авснаас хойш 14 хоногийн дотор буцаах боломжтой.",
      icon: <RotateCcw className="h-5 w-5" />,
    },
    {
      question: "Төлбөр төлөх дансыг хаанаас мэдэх вэ?",
      answer:
        "Та төлбөрөө `Голомт банк 123456789` данс руу шилжүүлэх боломжтой. ",

      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      question: "Захиалга хүлээн авах хамгийн бага үнэ хэд вэ?",
      answer: "Манай дэлгүүрт 10,000₮-өөс дээш захиалга өгөх боломжтой.",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white ">
      {/* Hero Section */}
      <div className="relative bg-white text-black">
        {/* <div className="absolute inset-0 bg-blue-900 opacity-20"></div> */}
        <div className="max-w-6xl mx-auto px-4 py-10 relative z-10">
          <h1 className="text-2xl md:text-5xl font-bold  text-center">
            Бидэнтэй холбогдох
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 -mt-6 relative z-10">
        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all hover:cursor-pointer ${
                activeTab === "contact"
                  ? "bg-white text-[var(--gray60)] shadow-md"
                  : "text-[var(--gray600)] "
              }`}
            >
              <span className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Холбоо барих
              </span>
            </button>

            <button
              onClick={() => setActiveTab("faq")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all hover:cursor-pointer ${
                activeTab === "faq"
                  ? "bg-white text-[var(--gray60)] shadow-md"
                  : "text-[var(--gray600)] "
              }`}
            >
              <span className="flex items-center">
                <FileQuestion className="w-4 h-4 mr-2" />
                Түгээмэл асуултууд
              </span>
            </button>
          </div>
        </div>

        {/* Contact Information Section */}
        {activeTab === "contact" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 space-y-6">
                <div className="flex gap-4 items-start hover:bg-[var(--lightgray)] p-3 rounded-xl transition-colors">
                  <div className="flex-shrink-0  rounded-full p-3">
                    <MapPin className="h-6 w-6 text-[var(--gray600)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Хаяг</h3>
                    <p className="text-[var(--gray600)] mt-1">
                      Хан-Уул дүүрэг, 10-р хороо, Наадамчдын гудамж, Гэрийн
                      Дизайн дэлгүүр
                      <br />
                      Улаанбаатар, Монгол улс
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start hover:bg-[var(--lightgray)] p-3 rounded-xl transition-colors">
                  <div className="flex-shrink-0 rounded-full p-3">
                    <Phone className="h-6 w-6 text-[var(--gray600)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Утас</h3>
                    <p className="text-[var(--gray600)] mt-1">+976 8800 1234</p>
                    <p className="text-[var(--gray600)]">+976 8800 5678</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start hover:bg-[var(--lightgray)] p-3 rounded-xl transition-colors">
                  <div className="flex-shrink-0  rounded-full p-3">
                    <Mail className="h-6 w-6 text-[var(--gray600)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">И-мэйл</h3>
                    <p className="text-[var(--gray600)] mt-1">
                      contact@geriin-design.mn
                    </p>
                    <p className="text-[var(--gray600)]">
                      info@geriin-design.mn
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start hover:bg-[var(--lightgray)] p-3 rounded-xl transition-colors">
                  <div className="flex-shrink-0  rounded-full p-3">
                    <Clock className="h-6 w-6 text-[var(--gray600)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Ажлын цаг</h3>
                    <p className="text-[var(--gray600)] mt-1">
                      Даваа - Баасан: 09:00 - 18:00
                    </p>
                    <p className="text-[var(--gray600)]">
                      Бямба: 10:00 - 16:00
                    </p>
                    <p className="text-[var(--gray600)]">Ням: Амарна</p>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <div className="border-t border-[var(--gray200)] pt-6">
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a
                      href="#"
                      className="bg-[var(--pink500)] hover:bg-pink-600 text-white p-2 rounded-full transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a
                      href="#"
                      className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-full w-full bg-[var(--gray200)] flex items-center justify-center">
                <div className="text-center px-6 py-8">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    Байршил
                  </h3>
                  <p className="text-[var(--gray600)]">
                    Бидний албан газрын байршил Улаанбаатар хотын төвд
                    байрладаг. Та зургаан дээр дарж дэлгэрэнгүй байршлыг харах
                    боломжтой.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {activeTab === "faq" && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* <div className="bg-[var(--gray200)] px-6 py-3 text-gray-700">
                <h2 className="text-2xl font-bold mb-2">Түгээмэл асуултууд</h2>
              </div> */}

              <div className="p-6">
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-[var(--gray200)] rounded-xl overflow-hidden"
                    >
                      <button
                        className="w-full flex items-center justify-between px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                        onClick={() => toggleQuestion(index)}
                      >
                        <div className="flex items-center">
                          <div className=" p-2 rounded-lg mr-3">{faq.icon}</div>
                          <h3 className="font-medium text-gray-800">
                            {faq.question}
                          </h3>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-500 transition-transform ${
                            activeQuestion === index
                              ? "transform rotate-180"
                              : ""
                          }`}
                        />
                      </button>
                      {activeQuestion === index && (
                        <div className="px-6 py-4 bg-white">
                          <p className="text-[var(--gray600)]">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
