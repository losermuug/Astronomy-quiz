# 🚀 Vercel дээр Deploy хийх заавар

## 1️⃣ Vercel KV Database тохируулах

### Алхам 1: Vercel Project үүсгэх
1. [vercel.com](https://vercel.com) рүү орж login хийнэ үү
2. "Add New..." → "Project" дарна
3. GitHub repository-гоо холбоно
4. "Import" дарна

### Алхам 2: Vercel KV Database нэмэх
1. Vercel dashboard дээрээ project-оо нээнэ
2. "Storage" tab руу орно
3. "Create Database" → "KV" сонгоно
4. Database нэрээ өгнө (жишээ: `quiz-leaderboard`)
5. "Create" дарна

### Алхам 3: Environment Variables холбох
1. Database үүссэний дараа "Connect" дарна
2. Өөрийн Next.js project-ийг сонгоно
3. Автоматаар environment variables нэмэгдэнэ:
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

## 2️⃣ Code өөрчлөлт хийх

### package.json шалгах
\`\`\`json
{
  "dependencies": {
    "@vercel/kv": "^1.0.1",
    // ... бусад dependencies
  }
}
\`\`\`

### Dependencies суулгах
\`\`\`bash
npm install
\`\`\`

## 3️⃣ Deploy хийх

### Option A: Git Push (Recommended)
\`\`\`bash
git add .
git commit -m "Add shared leaderboard with Vercel KV"
git push origin main
\`\`\`

✅ Vercel автоматаар танин deploy хийнэ!

### Option B: Vercel CLI
\`\`\`bash
# Vercel CLI суулгах
npm i -g vercel

# Deploy хийх
vercel --prod
\`\`\`

## 4️⃣ Тест хийх

1. Deploy дууссаны дараа production URL-аа нээнэ
2. Нэрээ оруулж quiz-г тоглоно
3. Оноогоо хадгалж leaderboard харна
4. Өөр device эсвэл browser-ээр орж бусад тоглогчид харагдахыг шалгана

## 🔧 Асуудал шийдвэрлэх (Troubleshooting)

### Database холбогдохгүй байвал:
1. Vercel dashboard → Settings → Environment Variables шалгана
2. KV environment variables байгаа эсэхийг шалгана
3. Redeploy хийнэ: "Deployments" → ... → "Redeploy"

### Leaderboard хоосон байвал:
- Энэ хэвийн! Анхны тоглогч бүртгүүлэхээс өмнө leaderboard хоосон байна
- Нэг хүн тоглоод оноогоо хадгалбал бусад хүмүүст харагдана

### API алдаа гарвал:
\`\`\`bash
# Logs харах
vercel logs
\`\`\`

## 📊 Database удирдах

### Leaderboard цэвэрлэх (шаардлагатай бол)
\`\`\`bash
# DELETE request илгээх
curl -X DELETE https://your-app.vercel.app/api/leaderboard
\`\`\`

### Vercel Dashboard дээр өгөгдөл харах
1. Storage → KV Database дарна
2. "Browse Data" дарж өгөгдлөө харна

## 🎯 Онцлогууд

✅ **Real-time Leaderboard**: Бүх хэрэглэгчид ижил leaderboard харна
✅ **Top 50**: Хамгийн өндөр оноотой 50 тоглогч харагдана
✅ **Автомат Sort**: Оноогоор автоматаар эрэмбэлэгдэнэ
✅ **Мэдээлэл харуулах**: Зөв хариулт, нийт асуулт гэх мэт

## 📱 Хуваалцах

Deploy дууссаны дараа таны URL:
\`\`\`
https://your-project-name.vercel.app
\`\`\`

Энэ URL-г найзууддаа хуваалцаж хамтдаа тоглоорой! 🎮✨

## 🔐 Нууцлал

- Хэрэглэгчийн нэр л хадгалагдана
- IP address, email гэх мэт мэдээлэл хадгалагдахгүй
- Бүх өгөгдөл Vercel KV дээр аюулгүй хадгалагдана

## 💡 Цаашдын хөгжүүлэлт

- 🔐 Admin панел нэмэх
- 📅 Долоо хоног/сарын шилдэг тоглогч
- 🏆 Badge система
- 📊 Статистик мэдээлэл
- 🎨 Өөрийн тоглогчийн профайл

Амжилт хүсье! 🚀

