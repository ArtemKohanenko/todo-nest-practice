## Требования
Установи Node.js (https://nodejs.org). Версия должна быть >= 20, лучше обновить до последней. Проверить версию можно через:

```sh
node -v
```

Установи Docker Compose (или Docker Desktop) под свою систему (https://docs.docker.com/compose/install).

## Команды

Памятка с использованными командами.

### Запуск приложения

```sh
# Установить Nest CLI
npm i -g @nestjs/cli

# Создать новый проект
nest new todo-list

# Установить все библиотеки из package.json
npm i

# Запустить приложение
nest start

# Сгенерировать модуль
nest g resource
```

### Линтер и автоформатирование кода

```bash
# Поправить форматирование
npm run format

# Запустить линтер
npm run lint
```

### База данных и Prisma ORM

```bash
# Инициализация Prisma
npx prisma init

# Генерация библиотеки с моделями
npx prisma generate

# Поднять Docker-контейнер c базой данных
docker-compose up -d

# Создать и запустить миграцию
npx prisma migrate dev --name init

# Запустить созданные миграции
npx prisma migrate deploy
```

## Можно рассмотреть дополнительно

Предпочтительный вариант работы с переменными окружения:

https://docs.nestjs.com/techniques/configuration

Валидацию и трансформацию возвращаемых данных:

https://docs.nestjs.com/techniques/serialization
https://github.com/typestack/class-transformer/blob/develop/README.md
https://github.com/typestack/class-validator/blob/develop/README.md