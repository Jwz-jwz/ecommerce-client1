import { BadgeDollarSign, Star, Truck } from "lucide-react";

export default function BodyPause() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row px-10 justify-between items-center my-[60px]">
      <div className="flex flex-col gap-4 justify-center  max-w-[330px]">
        <div className="bg-[#F6F6F6] rounded-full w-12 h-12 flex justify-center items-center">
          <Star className="w-6 h-6" />
        </div>
        <p className="text-[18px] font-[600]">Сэтгэл ханамжийн баталгаа</p>
        <p className="text-[16px] font-[400] text-[#5C5F6A]">
          Та бидэнд итгэж болно. Бидний Сэтгэл Ханамжийн Баталгаа: Таалагдаагүй
          бол мөнгөө буцаан авах боломжтой.
        </p>
      </div>
      <div className="flex flex-col gap-4 justify-center max-w-[330px]">
        <div className="bg-[#F6F6F6] rounded-full w-12 h-12 flex justify-center items-center">
          <BadgeDollarSign className="w-6 h-6" />
        </div>
        <p className="text-[18px] font-[600]">Хямд үнэ, өндөр чанар</p>
        <p className="text-[16px] font-[400] text-[#5C5F6A]">
          Бид хамгийн сайн чанартай бүтээгдэхүүнийг хамгийн хямд үнээр санал
          болгодог. Үнэ, чанарын харьцаа манай давуу тал.
        </p>
      </div>
      <div className="flex flex-col gap-4 justify-center max-w-[330px]">
        <div className="bg-[#F6F6F6] rounded-full w-12 h-12 flex justify-center items-center">
          <Truck className="w-6 h-6" />
        </div>
        <p className="text-[18px] font-[600]">Хурдан хүргэлт</p>
        <p className="text-[16px] font-[400] text-[#5C5F6A]">
          Таны захиалгыг 24-48 цагийн дотор хүргэж өгнө. Улаанбаатар хотын
          хүргэлт үнэгүй, орон нутгийн хүргэлт хамгийн хямд тарифаар.
        </p>
      </div>
    </div>
  );
}
