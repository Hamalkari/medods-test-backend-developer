# Тестовое задание Junior Backend Developer

## Инструкция по установке и запуску

1. Склонируйте репозиторий
```sh
git clone https://github.com/Hamalkari/memods-test-backend-developer.git
```
2. Перейдите в установленную папку
```sh
cd memods-test-backend-developer/
```
3. Установите все необходимые зависимости
```
npm install
```
4. Настройте файл **.env.example** и переименуйте файл в **.env**
```shell
PORT=3000
NODE_ENV='development'
MONGODB_URI='mongodb://localhost/your_db'
JWT_SECRET='medods-test'
EXPIRES_ACCESS_TOKEN='6h'
EXPIRES_REFRESH_TOKEN='30d'
```
5. Запустите приложение
```sh
npm run dev
```

## Тестирование

Для запуска тестов
```sh
npm test
```