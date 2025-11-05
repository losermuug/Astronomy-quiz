const questions = [
  { id: 0, question: "Нарны аймгийн том гараг аль вэ?", options: { A: "Санчир", B: "Бархасбадь", C: "Далайн ван", D: "Агаар ван" }, correct: "B" },
  { id: 1, question: "Саран дээр хөл тавьсан анхны сансрын нисгэгч?", options: { A: "Юрий Гагарин", B: "Нил Армстронг", C: "Базз Олдрин", D: "Жон Гленн" }, correct: "B" },
  { id: 2, question: "Манай галактик ямар нэртэй вэ?", options: { A: "Андромеда", B: "Сомбреро", C: "Сүүн зам", D: "Гурвалсан мананцар" }, correct: "C" },
  { id: 3, question: "Нарны аймгийн хамгийн халуун гараг аль вэ?", options: { A: "Буд", B: "Сугар", C: "Дэлхий", D: "Ангараг" }, correct: "B" },
  { id: 4, question: "Сансрын анхны хиймэл дагуул ямар нэртэй байсан бэ?", options: { A: "Восток-1", B: "Спутник-1", C: "Аполлон-11", D: "Хаббл" }, correct: "B" },
  { id: 5, question: "Нарны аймагт хичнээн гараг байдаг вэ?", options: { A: "6", B: "7", C: "8", D: "9" }, correct: "C" },
  { id: 6, question: "Дэлхийгээс хамгийн ойрхон од аль вэ?", options: { A: "Сириус", B: "Вега", C: "Нар", D: "Бетельгейз" }, correct: "C" },
  { id: 7, question: "Сансрын анхны эмэгтэй нисэгч хэн бэ?", options: { A: "Салли Райд", B: "Валентина Терешкова", C: "Светлана Савицкая", D: "Елена Кондакова" }, correct: "B" },
  { id: 8, question: "Манай нарны аймгийн төвд ямар од байрладаг вэ?", options: { A: "Сириус", B: "Вега", C: "Нар", D: "Андромеда" }, correct: "C" },
  { id: 9, question: "Хамгийн анх саран дээр хөл тавьсан улс аль вэ?", options: { A: "Зөвлөлт Холбоот Улс", B: "Америкийн Нэгдсэн Улс", C: "БНХАУ", D: "Оросын Холбооны Улс" }, correct: "B" },
  { id: 10, question: "Дэлхийн дагуул юу вэ?", options: { A: "Сугар", B: "Сар", C: "Буд", D: "Ангараг" }, correct: "B" },
  { id: 11, question: "Ангараг гаргийг өөрөөр юу гэж нэрлэдэг вэ?", options: { A: "Улаан гариг", B: "Хөх гариг", C: "Ногоон гариг", D: "Цагаан гариг" }, correct: "A" },
  { id: 12, question: "Бархасбадь гаргийн хамгийн том сар аль вэ?", options: { A: "Ганимед", B: "Ио", C: "Европа", D: "Каллисто" }, correct: "A" },
  { id: 13, question: "Санчир гаргийн хамгийн онцгой шинж чанар юу вэ?", options: { A: "Дугуй цагираг", B: "Том уур амьсгал", C: "Мөсөөр бүрхэгдсэн", D: "Улаан өнгөтэй" }, correct: "A" },
  { id: 14, question: "Нарны аймагт хамгийн жижиг гариг аль вэ?", options: { A: "Буд", B: "Сугар", C: "Ангараг", D: "Плутон" }, correct: "A" },
  { id: 15, question: "Оддын дундаас хамгийн тод од аль вэ?", options: { A: "Сириус", B: "Вега", C: "Полярис", D: "Арктур" }, correct: "A" },
  { id: 16, question: "Нарнаас дөрөв дэх Гараг аль вэ?", options: { A: "Буд", B: "Сугар", C: "Дэлхий", D: "Ангараг" }, correct: "D" },
  { id: 17, question: "“Сүүн зам” галактик ямар хэлбэртэй вэ?", options: { A: "Бөмбөрцөг хэлбэртэй", B: "Спираль хэлбэртэй", C: "Эллипс хэлбэртэй", D: "Бүс хэлбэртэй" }, correct: "B" },
  { id: 18, question: "Дэлхий ямар төрлийн гараг вэ?", options: { A: "Хийн гараг", B: "Чулуун Гараг", C: "Мөс гариг", D: "Хольц гариг" }, correct: "B" },
  { id: 19, question: "Хүн анх хэзээ сансарт ниссэн бэ?", options: { A: "1959 он", B: "1961 он", C: "1965 он", D: "1970 он" }, correct: "B" },
  { id: 20, question: "Оддын өнгө тухайн одны ямар шинж чанарыг илэрхийлдэг вэ?", options: { A: "Температур", B: "Хэмжээ", C: "Нас", D: "Хөдөлгөөн" }, correct: "A" },
  { id: 21, question: "Нарны аймгийн хамгийн жижиг гараг аль нь вэ?", options: {A: "Ангараг", B: "Буд", C: "Сугар", D: "Санчир" }, correct: "B" },
];

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const excludeIds = url.searchParams.get('exclude')?.split(',').map(id => parseInt(id)) || [];

    // Аль хэдийн асуусан асуултуудыг хасах
    const availableQuestions = questions.filter(q => !excludeIds.includes(q.id));

    // Хэрвээ бүх асуулт дууссан бол дахин санамсаргүйгээр бүхээс сонгоно
    const pool = availableQuestions.length > 0 ? availableQuestions : questions;

    const randomIndex = Math.floor(Math.random() * pool.length);
    const selectedQuestion = pool[randomIndex];

    return Response.json(selectedQuestion);
  } catch (error) {
    console.error('Error fetching question:', error);
    return Response.json({ error: 'Асуулт татахад алдаа гарлаа' }, { status: 500 });
  }
}
