Full-Stack API Explorer (O'zbek tilida)
Zamonaviy full-stack ilova - SQLAlchemy ma'lumotlar bazasi, toza UI va RESTful API bilan.

🚀 Xususiyatlar
Backend: FastAPI + SQLAlchemy ORM

Ma'lumotlar bazasi: SQLite (avtomatik yaratiladi)

Frontend: Zamonaviy, moslashuvchan dizayn

API Endpointlar:

GET /api/data - Barcha loyihalarni olish

POST /api/data - Yangi loyiha yaratish

Ma'lumotlar modeli: Loyihalar (id, title, description)

📋 Talablar
Python 3.8+

pip (Python paket boshqaruvchisi)

🛠️ O'rnatish
Repozitoriyani klonlash

bash
git clone <repository-url>
cd Full-Stack-API-Explorer
Virtual muhit yaratish va faollashtirish

bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
Kerakli paketlarni o'rnatish

bash
pip install fastapi uvicorn sqlalchemy python-multipart
🏃‍♂️ Ilovani ishga tushirish
Serverni ishga tushiring

bash
# Windows
.venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000

# macOS/Linux
uvicorn main:app --reload --host 127.0.0.1 --port 8000
Brauzerda oching

text
http://127.0.0.1:8000
api_explorer.db ma'lumotlar bazasi fayli birinchi ishga tushirishda avtomatik yaratiladi.

🔧 API Endpointlar
GET /api/data
Barcha saqlangan loyihalarni olish.

Javob:

json
{
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Loyiha nomi",
      "description": "Loyiha tavsifi"
    }
  ]
}
POST /api/data
Yangi loyiha yaratish.

So'rov:

json
{
  "title": "Yangi Loyiha",
  "description": "Loyiha tavsifi"
}
Javob:

json
{
  "message": "Project created successfully",
  "id": 1
}
🧪 APIni sinab ko'rish
curl yordamida
bash
# Loyiha yaratish
curl -X POST http://localhost:8000/api/data ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Test Loyihasi\",\"description\":\"Test Tavsifi\"}"

# Barcha loyihalarni olish
curl http://localhost:8000/api/data
UI orqali
"Title" va "Description" maydonlarini to'ldiring

"Save Project" tugmasini bosing

Ro'yxat avtomatik yangilanadi

📁 Loyiha tuzilishi
text
Full-Stack-API-Explorer/
├── main.py          # FastAPI ilovasi + SQLAlchemy
├── index.html       # Asosiy frontend sahifasi
├── script.js        # Frontend JavaScript kodi
├── style.css        # Zamonaviy UI stillari
├── .venv/           # Python virtual muhiti
└── api_explorer.db  # SQLite ma'lumotlar bazasi (avtomatik)
🗄️ Ma'lumotlar bazasi sxemasi
Loyihalar jadvali:

Ustun	Turi	Tavsif
id	Integer	Asosiy kalit, avtomatik o'sish
title	String(100)	Loyiha nomi (majburiy)
description	Text	Loyiha tavsifi (ixtiyoriy)
🔍 Muammolarni bartaraf etish
Port band:

bash
# Port raqamini o'zgartiring
uvicorn main:app --reload --port 8001
Ma'lumotlar bazasi bloklangan:

Ilovaning faqat bitta nusxasi ishlayotganligini tekshiring

Ilovani qayta ishga tushiring

Modul topilmadi:

bash
# Paketlarni qayta o'rnatish
pip install fastapi uvicorn sqlalchemy python-multipart
📝 Keyingi qadamlar (Ixtiyoriy)
Loyihalarni o'chirish funksiyasi

Loyihalarni tahrirlash imkoniyati

Foydalanuvchi autentifikatsiyasi

Qidiruv/filter funksiyasi

Ma'lumotlar validatsiyasi

Unit testlar

🤝 Hissa qo'shish
Repozitoriyani fork qiling

Yangi branch yarating

O'zgarishlarni commit qiling

Branchga push qiling

Pull Request yarating

📄 Litsenziya
MIT Litsenziyasi - ushbu loyihani o'rganish yoki ishlab chiqarish uchun bepul foydalaning.

Eslatma: Ushbu loyiha statik demodan SQLAlchemy va SQLite yordamida doimiy saqlanadigan full-stack ilovaga yangilandi.
