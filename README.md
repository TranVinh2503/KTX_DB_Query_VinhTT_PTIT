﻿# KTX_DB_Query_VinhTT_PTIT
KTX Sinh Viên API
Ứng dụng này cung cấp hệ thống quản lý ký túc xá sinh viên, bao gồm quản lý phòng, sinh viên, khách đến chơi, dịch vụ và phương tiện. Ứng dụng sử dụng Node.js với Express và MongoDB.

Cài đặt và khởi chạy
1. Cài đặt các gói cần thiết
        "npm install"
2. Cấu hình MongoDB
Ứng dụng mặc định kết nối đến MongoDB local (Sử dụng MONGO COMPASS TOOL):
        "mongodb://localhost:27017"
Tên cơ sở dữ liệu: ktx_sinh_vien
3. Chạy server
        node index.js
Các API được hỗ trợ ( Xem trong file "KTX_API_APP(thay_the_file_sql).pdf" )
Tạo mới phòng
POST /rooms
Body:
{
  "name": "Phòng A101",
  "price": 1000000,
  "max_students": 4
}
Tạo mới sinh viên
POST /students
Body:
{
  "name": "Nguyễn Văn A",
  "room_id": 1,
  "dob": "2003-05-10"
}
Nếu phòng đã đủ sinh viên, sẽ trả về lỗi.

Thêm khách đến chơi

POST /guests
Body:
{
  "name": "Trần Văn B",
  "cmt": "123456789",
  "dob": "1985-09-12",
  "student_id": "SV001",
  "visit_date": "2024-08-01"
}
Thêm dịch vụ

POST /services
Body:
{
  "service_id": "DV01",
  "name": "Giặt ủi",
  "price": 20000
}
Ghi nhận sinh viên sử dụng dịch vụ

POST /student-services
Body:
{
  "student_id": "SV001",
  "service_id": "DV01",
  "date": "2024-08-01"
}
Đăng ký xe vé tháng

POST /vehicles/register
Body:
{
  "student_id": "SV001",
  "vehicle_id": "XE123"
}
⚠️ Mỗi sinh viên chỉ được đăng ký tối đa 2 xe.

Ghi nhật ký gửi/lấy xe
POST /parking-logs
Body:
{
  "vehicle_id": "XE123",
  "take_time": "2024-08-15T07:00:00",
  "return_time": "2024-08-15T17:00:00"
}
⚠️ Mỗi ngày miễn phí 2 lượt, từ lượt thứ 3 trở đi sẽ tính phí 3.000đ/lượt.

📊 Truy Vấn
1. Truy Vấn tổng chi phí (phòng + dịch vụ) theo nhóm chi phí
        "GET /report/group-by-total-cost?month=08&year=2024"
2. Truy Vấn nhóm sinh viên dùng cùng dịch vụ và có tổng tiền giống nhau
        "GET /report/same-service-same-total?start_date=2024-08-01&end_date=2024-08-31"
3. Truy Vấn các khách đến thăm nhiều sinh viên khác nhau
        "GET /report/common-guest-students?start_date=2024-08-01&end_date=2024-08-31"
- Cấu trúc cơ sở dữ liệu MongoDB
        students: Thông tin sinh viên
        rooms: Thông tin phòng
        guests: Thông tin khách đến chơi
        services: Danh sách dịch vụ
        student_services: Lịch sử sử dụng dịch vụ
        registered_vehicles: Danh sách xe đăng ký
        parking_logs: Nhật ký gửi/lấy xe
- Công nghệ sử dụng
        Node.js
        Express.js
        MongoDB (native driver)
