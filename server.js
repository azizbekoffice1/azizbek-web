import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Telegram Bot token va chat_id
import dotenv from "dotenv";
dotenv.config({ path: "api.env" });

const token = process.env.TOKEN;   // faqat shu qatorda o‘zgardi
const chatId = process.env.CHAT_ID;

console.log("TOKEN:", token);
console.log("CHAT ID:", chatId);



// Statik fayllar (index.html, css, js)s
app.use(express.static("."));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Formani qabul qilish
app.post("/send-message", async (req, res) => {
    const { name, phone, email, message } = req.body;

    // Faylga yozish
    const log = `Ism: ${name}\nTelefon: ${phone}\nEmail: ${email}\nXabar: ${message}\n-----------------\n`;
    fs.appendFileSync("messages.txt", log, "utf8");

    // Telegramga yuborish
    const text = `📩 Yangi xabar:\n👤 Ism: ${name}\n📞 Raqam: ${phone}\n✉️ Email: ${email}\n💬 Xabar: ${message}`;
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text })
    });


    res.json({ success: true, message: "Xabar yuborildi ✅" });
});

// Serverni ishga tushirish
app.listen(PORT, () => {
    console.log(`✅ Server http://localhost:${PORT} da ishlayapti`);
});


