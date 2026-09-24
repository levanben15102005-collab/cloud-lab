# Câu 51: Khai báo Node.js Image làm Base Image
FROM node:20-alpine

# Câu 52: Thiết lập thư mục làm việc
WORKDIR /app

# Câu 53: Sao chép package.json và package-lock.json
COPY package*.json ./

# Câu 54: Cài đặt các package của React Application
RUN npm install

# Câu 55: Sao chép source code React vào Container
COPY . .

# Câu 56 & 57: Build React Application (tạo ra thư mục dist chứa kết quả)
RUN npm run build

# Dùng serve để phục vụ ứng dụng web tĩnh ở port 3000
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]