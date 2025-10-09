# Dockerfile
FROM node:20-alpine

WORKDIR /app

# کپی کردن package.json و package-lock.json (یا pnpm-lock.yaml)
COPY package*.json ./
COPY pnpm-lock.yaml ./

# نصب pnpm
RUN npm install -g pnpm

# نصب dependencies
RUN pnpm install

# کپی کردن تمام فایل‌های پروژه
COPY . .

# ساخت پروژه
RUN pnpm run build

# نصب serve برای سرو کردن فایل‌های build شده
RUN npm install -g serve

# پورت اکسپوز
EXPOSE 3000

# دستور اجرا
CMD ["serve", "-s", "dist", "-l", "3000"]