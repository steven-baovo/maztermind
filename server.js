const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 👉 Thay myUser, myPassword và cluster0.abcde.mongodb.net bằng thông tin thật từ Atlas
const uri = "mongodb+srv://stevenbaovo:Bao%40110200@cluster0.dypwgqe.mongodb.net/?appName=Cluster0";

// Kết nối MongoDB Atlas
mongoose.connect(uri)
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch(err => console.error("❌ Lỗi kết nối:", err));

// Schema lưu điểm
const ScoreSchema = new mongoose.Schema({
  name: String,
  score: Number,
  time: { type: Date, default: Date.now },
});

const Score = mongoose.model("Score", ScoreSchema);

// API lưu điểm
app.post("/score", async (req, res) => {
  try {
    const { name, score } = req.body;
    const newScore = new Score({ name, score });
    await newScore.save();
    res.json({ message: "Điểm đã được lưu!" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lưu điểm" });
  }
});

// API lấy bảng xếp hạng (top 10 điểm cao nhất)
app.get("/scores", async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1, time: 1 }).limit(10);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu" });
  }
});

// Chạy server
const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
