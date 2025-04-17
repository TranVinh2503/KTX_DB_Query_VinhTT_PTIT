// File: app.js
const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "ktx_sinh_vien";

app.use(express.json());

let db;

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connect Error:", err);
  }
}

// API tạo mới sinh viên
app.post("/students", async (req, res) => {
    try {
      const { room_id } = req.body;  
  
      const room = await db.collection("rooms").findOne({ _id: room_id });
      const studentCount = await db.collection("students").countDocuments({ room_id });
      
      if (studentCount >= room.max_students) {
        return res
          .status(400)
          .json({ error: `Phòng này đã đầy, chỉ có thể chứa tối đa ${room.max_students} sinh viên` });
      }
  
      const student = req.body;
      const result = await db.collection("students").insertOne(student);
      res
        .status(201)
        .json({ message: "Tạo sinh viên thành công", id: result.insertedId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// API tạo mới phòng
app.post("/rooms", async (req, res) => {
  try {
    const room = req.body;
    const count = await db.collection("rooms").countDocuments({});
    room._id = count + 1;
    await db.collection("rooms").insertOne(room);
    res.status(201).json({ message: "Tạo phòng thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API thêm khách đến chơi
app.post("/guests", async (req, res) => {
  try {
    const guest = req.body;
    const result = await db.collection("guests").insertOne(guest);
    res
      .status(201)
      .json({ message: "Thêm khách thành công", id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API thêm dịch vụ
app.post("/services", async (req, res) => {
  try {
    const service = req.body;
    const result = await db.collection("services").insertOne(service);
    res
      .status(201)
      .json({ message: "Thêm dịch vụ thành công", id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API ghi nhận sử dụng dịch vụ của sinh viên
app.post("/student-services", async (req, res) => {
  try {
    const usage = req.body;
    const result = await db.collection("student_services").insertOne(usage);
    res
      .status(201)
      .json({ message: "Ghi nhận thành công", id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API đăng ký xe vé tháng
app.post("/vehicles/register", async (req, res) => {
    try {
      const { student_id } = req.body;
      const count = await db
        .collection("registered_vehicles")
        .countDocuments({ student_id });
      
      if (count >= 2) {
        return res
          .status(400)
          .json({ error: "Mỗi sinh viên chỉ được đăng ký tối đa 2 xe" });
      }
  
      const result = await db
        .collection("registered_vehicles")
        .insertOne(req.body);
      res
        .status(201)
        .json({ message: "Đăng ký xe thành công", id: result.insertedId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// API ghi nhật ký gửi/lấy xe
app.post("/parking-logs", async (req, res) => {
  try {
    const { vehicle_id, take_time, return_time } = req.body;
    const dayStart = new Date(take_time);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(take_time);
    dayEnd.setHours(23, 59, 59, 999);

    const logs = await db
      .collection("parking_logs")
      .find({
        vehicle_id,
        take_time: { $gte: dayStart, $lte: dayEnd },
      })
      .toArray();

    let fee = 0;
    if (logs.length >= 2) fee = 3000; // Chỉ miễn phí 2 lượt mỗi ngày

    await db.collection("parking_logs").insertOne({
      vehicle_id,
      take_time: new Date(take_time),
      return_time: new Date(return_time),
      fee,
    });

    res.status(201).json({ message: "Ghi nhật ký thành công", fee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/report/group-by-total-cost", async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ error: "Thiếu month hoặc year" });
    }

    const start = new Date(`${year}-${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    // Lấy dữ liệu sinh viên
    const students = await db.collection("students").find({}).toArray();

    // Lấy dịch vụ trong tháng
    const services = await db
      .collection("student_services")
      .aggregate([
        {
          $match: {
            date: { $gte: start, $lt: end },
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "service_id",
            foreignField: "_id",
            as: "serviceInfo",
          },
        },
        { $unwind: "$serviceInfo" },
        {
          $group: {
            _id: "$student_id",
            total_service_cost: { $sum: "$serviceInfo.price" },
          },
        },
      ])
      .toArray();

    // Map chi phí dịch vụ theo student_id
    const serviceMap = {};
    for (const s of services) {
      serviceMap[s._id] = s.total_service_cost;
    }

    // Lấy thông tin phòng
    const rooms = await db.collection("rooms").find({}).toArray();
    const roomMap = {};
    for (const room of rooms) {
      roomMap[room._id] = room.price;
    }

    // Tổng hợp chi phí từng sinh viên
    const studentCosts = students.map((student) => {
      const roomCost = roomMap[student.room_id] || 0;
      const serviceCost = serviceMap[student._id] || 0;
      return {
        student_id: student._id,
        name: student.name,
        room_id: student.room_id,
        total_room_cost: roomCost,
        total_service_cost: serviceCost,
        total_cost: roomCost + serviceCost,
      };
    });

    // Nhóm theo total_cost
    const grouped = {};
    for (const student of studentCosts) {
      const key = student.total_cost;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(student);
    }

    // Chuyển thành mảng kết quả
    const result = Object.entries(grouped).map(([total_cost, students]) => ({
      total_cost: Number(total_cost),
      students,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/report/same-service-same-total", async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const start = new Date(start_date);
    const end = new Date(end_date);
    end.setHours(23, 59, 59, 999);
    const result = await db
      .collection("student_services")
      .aggregate([
        {
          $match: {
            time_used: { $gte: start, $lte: end },
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "service_id",
            foreignField: "service_id",
            as: "service_details",
          },
        },
        { $unwind: "$service_details" },
        {
          $project: {
            student_id: 1,
            service_id: 1,
            price: "$service_details.price",
            time_used: 1,
          },
        },
        {
          $group: {
            _id: {
              service_id: "$service_id",
              total_price: { $sum: "$price" },
            },
            services: {
              $push: {
                student_id: "$student_id",
                time_used: "$time_used",
                price: "$price",
              },
            },
          },
        },
        {
          $match: {
            "services.1": { $exists: true },
            "_id.total_price": { $gt: 0 },
          },
        },
        {
          $sort: { "_id.service_id": 1 },
        },
      ])
      .toArray();

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
app.get("/report/common-guest-students", async (req, res) => {
    try {
      const { start_date, end_date } = req.query;
  
      if (!start_date || !end_date) {
        return res.status(400).json({ error: "Missing start_date or end_date" });
      }
  
      const start = new Date(start_date);
      const end = new Date(end_date);
      end.setHours(23, 59, 59, 999);
  
      const result = await db.collection("guests").aggregate([
        {
          $match: {
            visit_date: { $gte: start, $lte: end }
          }
        },
        {
          $group: {
            _id: "$cmt", // group by guest
            guest_name: { $first: "$name" },
            dob: { $first: "$dob" },
            students: { $addToSet: "$student_id" },
            total_visits: { $sum: 1 }
          }
        },
        {
          $match: {
            "students.1": { $exists: true } // chỉ những khách đến thăm nhiều hơn 1 sinh viên
          }
        },
        {
          $project: {
            _id: 0,
            guest_cmt: "$_id",
            guest_name: 1,
            dob: 1,
            total_visits: 1,
            student_ids: "$students"
          }
        }
      ]).toArray();
  
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
  
  app.get("/report/service-revenue-per-month", async (req, res) => {
    try {
      const result = await db.collection("student_services").aggregate([
        {
          // Nối thêm thông tin dịch vụ từ bảng services
          $lookup: {
            from: "services",
            localField: "service_id",
            foreignField: "service_id",
            as: "service_info"
          }
        },
        { $unwind: "$service_info" },
        {
          // Tạo trường mới: tháng và năm
          $addFields: {
            year: { $year: "$time_used" },
            month: { $month: "$time_used" },
            revenue: "$service_info.price"
          }
        },
        {
          // Gom theo service_id, năm, tháng
          $group: {
            _id: {
              service_id: "$service_id",
              service_name: "$service_info.name",
              year: "$year",
              month: "$month"
            },
            total_revenue: { $sum: "$revenue" },
            count: { $sum: 1 }
          }
        },
        {
          // Định dạng lại kết quả trả về
          $project: {
            _id: 0,
            service_id: "$_id.service_id",
            service_name: "$_id.service_name",
            year: "$_id.year",
            month: "$_id.month",
            total_revenue: 1,
            usage_count: "$count"
          }
        },
        {
          $sort: { year: 1, month: 1, service_id: 1 }
        }
      ]).toArray();
  
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
    
  
const PORT = 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
