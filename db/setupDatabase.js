const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "ktx_sinh_vien";

async function setupDatabase() {
  try {
    await client.connect();
    const db = client.db(dbName);

    const students = db.collection("students");
    const rooms = db.collection("rooms");
    const guests = db.collection("guests");
    const services = db.collection("services");
    const studentServices = db.collection("student_services");
    const registeredVehicles = db.collection("registered_vehicles");
    const parkingLogs = db.collection("parking_logs");

    await rooms.insertMany([
      { _id: 1, room_number: "A101", type: "4 người", price: 1200000, max_people: 4 },
      { _id: 2, room_number: "B202", type: "6 người", price: 900000, max_people: 6 },
      { _id: 3, room_number: "C303", type: "2 người", price: 1500000, max_people: 2 },
      { _id: 4, room_number: "D404", type: "4 người", price: 1100000, max_people: 4 },
      { _id: 5, room_number: "E505", type: "6 người", price: 950000, max_people: 6 },
      { _id: 6, room_number: "F606", type: "2 người", price: 1600000, max_people: 2 },
      { _id: 7, room_number: "G707", type: "4 người", price: 1000000, max_people: 4 },
      { _id: 8, room_number: "H808", type: "6 người", price: 850000, max_people: 6 },
      { _id: 9, room_number: "I909", type: "2 người", price: 1550000, max_people: 2 },
      { _id: 10, room_number: "J010", type: "4 người", price: 1050000, max_people: 4 },
    ]);

    await students.insertMany([
      { _id: 1, student_id: "SV001", cmt: "123456789", dob: new Date("2002-01-01"), class: "K17CNTT", hometown: "Hà Nội", room_id: 1 },
      { _id: 2, student_id: "SV002", cmt: "987654321", dob: new Date("2002-03-10"), class: "K17KT", hometown: "Hải Phòng", room_id: 2 },
      { _id: 3, student_id: "SV003", cmt: "456789123", dob: new Date("2001-05-15"), class: "K18QTKD", hometown: "Nam Định", room_id: 3 },
      { _id: 4, student_id: "SV004", cmt: "321654987", dob: new Date("2003-02-20"), class: "K19CNTT", hometown: "Hà Nam", room_id: 4 },
      { _id: 5, student_id: "SV005", cmt: "852369741", dob: new Date("2002-07-07"), class: "K17KTCN", hometown: "Thái Bình", room_id: 5 },
      { _id: 6, student_id: "SV006", cmt: "741258963", dob: new Date("2001-11-30"), class: "K18CNTT", hometown: "Hà Tĩnh", room_id: 6 },
      { _id: 7, student_id: "SV007", cmt: "963852741", dob: new Date("2002-12-25"), class: "K17TMDT", hometown: "Đà Nẵng", room_id: 7 },
      { _id: 8, student_id: "SV008", cmt: "147258369", dob: new Date("2002-09-09"), class: "K18KTPM", hometown: "Nghệ An", room_id: 8 },
      { _id: 9, student_id: "SV009", cmt: "258369147", dob: new Date("2003-06-06"), class: "K19HTTT", hometown: "Lào Cai", room_id: 9 },
      { _id: 10, student_id: "SV010", cmt: "369147258", dob: new Date("2001-08-18"), class: "K17MKT", hometown: "TP HCM", room_id: 10 },
    ]);

    await guests.insertMany([
      { _id: 1, cmt: "111111111", name: "Nguyễn Văn A", dob: new Date("2004-06-01"), visit_date: new Date("2025-04-14"), student_id: 1 },
      { _id: 2, cmt: "222222222", name: "Trần Thị B", dob: new Date("2004-09-10"), visit_date: new Date("2025-04-15"), student_id: 2 },
      { _id: 3, cmt: "333333333", name: "Lê Văn C", dob: new Date("2004-01-22"), visit_date: new Date("2025-04-12"), student_id: 3 },
      { _id: 4, cmt: "444444444", name: "Phạm Thị D", dob: new Date("2004-12-12"), visit_date: new Date("2025-04-13"), student_id: 4 },
      { _id: 5, cmt: "555555555", name: "Đặng Văn E", dob: new Date("2004-10-10"), visit_date: new Date("2025-04-10"), student_id: 5 },
      { _id: 6, cmt: "666666666", name: "Ngô Thị F", dob: new Date("2005-03-03"), visit_date: new Date("2025-04-09"), student_id: 6 },
    ]);

    await services.insertMany([
      { _id: 1, service_id: "DV01", name: "Giặt là", price: 30000 },
      { _id: 2, service_id: "DV02", name: "Trông xe", price: 100000 },
      { _id: 3, service_id: "DV03", name: "Ăn uống", price: 50000 },
      { _id: 4, service_id: "DV04", name: "Wifi", price: 20000 },
      { _id: 5, service_id: "DV05", name: "Wifi", price: 40000 },
      { _id: 6, service_id: "DV06", name: "Giặt là", price: 60000 },
      { _id: 7, service_id: "DV07", name: "Trông xe", price: 80000 },
      { _id: 8, service_id: "DV08", name: "Ăn uống", price: 70000 },
      { _id: 9, service_id: "DV09", name: "Trông xe", price: 90000 },
      { _id: 10, service_id: "DV10", name: "Wifi", price: 10000 },
    ]);

    await studentServices.insertMany([
      { _id: 1, student_id: 1, service_id: "DV01", time_used: new Date("2025-04-01T10:00:00Z") },
      { _id: 2, student_id: 1, service_id: "DV02", time_used: new Date("2025-04-10T15:00:00Z") },
      { _id: 3, student_id: 2, service_id: "DV03", time_used: new Date("2025-04-01T12:00:00Z") },
      { _id: 4, student_id: 3, service_id: "DV04", time_used: new Date("2025-04-03T09:00:00Z") },
      { _id: 5, student_id: 4, service_id: "DV05", time_used: new Date("2025-04-04T11:00:00Z") },
      { _id: 6, student_id: 5, service_id: "DV06", time_used: new Date("2025-04-05T14:00:00Z") },
      { _id: 7, student_id: 6, service_id: "DV07", time_used: new Date("2025-04-06T16:00:00Z") },
      { _id: 8, student_id: 7, service_id: "DV08", time_used: new Date("2025-04-07T08:00:00Z") },
      { _id: 9, student_id: 8, service_id: "DV10", time_used: new Date("2025-04-09T13:00:00") },
      { _id: 10, student_id: 9, service_id: "DV10", time_used: new Date("2025-04-09T13:00:00Z") }
    ]);

    await registeredVehicles.insertMany([
      { _id: 1, student_id: 1, vehicle_type: "Xe máy", license_plate: "29A1-12345", register_date: new Date("2025-04-01") },
      { _id: 2, student_id: 2, vehicle_type: "Xe đạp", license_plate: "29A1-54321", register_date: new Date("2025-04-02") },
      { _id: 3, student_id: 3, vehicle_type: "Xe máy", license_plate: "30B1-22222", register_date: new Date("2025-04-03") },
      { _id: 4, student_id: 4, vehicle_type: "Xe đạp điện", license_plate: "29C1-44444", register_date: new Date("2025-04-04") },
      { _id: 5, student_id: 5, vehicle_type: "Xe máy", license_plate: "29D1-55555", register_date: new Date("2025-04-05") },
      { _id: 6, student_id: 6, vehicle_type: "Xe máy", license_plate: "30E1-66666", register_date: new Date("2025-04-06") },
      { _id: 7, student_id: 7, vehicle_type: "Xe đạp", license_plate: "31F1-77777", register_date: new Date("2025-04-07") },
      { _id: 8, student_id: 8, vehicle_type: "Xe máy", license_plate: "32G1-88888", register_date: new Date("2025-04-08") },
      { _id: 9, student_id: 9, vehicle_type: "Xe máy", license_plate: "33H1-99999", register_date: new Date("2025-04-09") },
      { _id: 10, student_id: 10, vehicle_type: "Xe đạp", license_plate: "34I1-00000", register_date: new Date("2025-04-10") },
    ]);

    await parkingLogs.insertMany([
      { _id: 1, vehicle_id: 1, take_time: new Date("2025-04-02T07:00:00Z"), return_time: new Date("2025-04-02T18:00:00Z"), fee: 0 },
      { _id: 2, vehicle_id: 2, take_time: new Date("2025-04-03T08:00:00Z"), return_time: new Date("2025-04-03T17:00:00Z"), fee: 0 },
      { _id: 3, vehicle_id: 3, take_time: new Date("2025-04-04T09:00:00Z"), return_time: new Date("2025-04-04T19:00:00Z"), fee: 0 },
      { _id: 4, vehicle_id: 4, take_time: new Date("2025-04-05T10:00:00Z"), return_time: new Date("2025-04-05T20:00:00Z"), fee: 0 },
      { _id: 5, vehicle_id: 5, take_time: new Date("2025-04-06T11:00:00Z"), return_time: new Date("2025-04-06T21:00:00Z"), fee: 0 },
      { _id: 6, vehicle_id: 6, take_time: new Date("2025-04-07T12:00:00Z"), return_time: new Date("2025-04-07T22:00:00Z"), fee: 0 },
      { _id: 7, vehicle_id: 7, take_time: new Date("2025-04-08T13:00:00Z"), return_time: new Date("2025-04-08T23:00:00Z"), fee: 0 },
      { _id: 8, vehicle_id: 8, take_time: new Date("2025-04-09T14:00:00Z"), return_time: new Date("2025-04-09T20:00:00Z"), fee: 0 },
      { _id: 9, vehicle_id: 9, take_time: new Date("2025-04-10T15:00:00Z"), return_time: new Date("2025-04-10T18:00:00Z"), fee: 0 },
      { _id: 10, vehicle_id: 10, take_time: new Date("2025-04-11T16:00:00Z"), return_time: new Date("2025-04-11T19:00:00Z"), fee: 0 },
    ]);

    console.log(" Successfully create database");
  } catch (err) {
    console.error("Error setup DB:", err);
  } finally {
    await client.close();
  }
}

setupDatabase();
