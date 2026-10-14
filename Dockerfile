# Giai đoạn 1: Build ứng dụng React từ thư mục client
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package.json của client vào container
COPY client/package*.json ./
RUN npm install

# Copy toàn bộ source code của client vào
COPY client/ ./
RUN npm run build

# Giai đoạn 2: Dùng serve để chạy file tĩnh đã build
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]