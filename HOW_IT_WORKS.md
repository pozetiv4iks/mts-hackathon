# IaaS МТС — как всё работает и что как создавать

## Общая схема

```
Главная (/) → Вход/Регистрация → Личный кабинет (/dashboard) или Админка (/admin)
                    ↓
            Токен в localStorage
                    ↓
    API: https://mts-hackathon.onrender.com (в dev — через прокси /api)
```

- **Роуты:** один layout с хедером, внутри — страницы: главная, логин, регистрация, дашборд, админка.
- **Роли:** обычный пользователь (`user`) и администратор (`admin`). Роль приходит в `user.users_user_role` с API.
- **Доступ:** `/dashboard` и `/virtual-apps` — только для авторизованных; `/admin` — только для `admin`.

---

## 1. Пользователь (как создать и войти)

### Регистрация

1. Открыть **Регистрация** (`/register`).
2. Заполнить форму (имя/почта/телефон, пароль и т.д. — зависит от вашей формы).
3. При отправке вызывается **`POST /users/`** с телом `{ username, password }`.
4. Пользователь создаётся в API; после этого можно войти.

**Код:** `AuthContext.register()` → `api.createUser({ username, password })`.

### Вход

1. Открыть **Войти** (`/login`).
2. Ввести логин и пароль.
3. При отправке: **`POST /auth/login`** с `{ username, password }` → в ответе `access_token`.
4. Токен сохраняется в `localStorage` и в контексте; затем **`GET /users/me`** (или `GET /users/{username}`) — подставляются в `user` (в т.ч. `users_user_id`, `users_username`, `users_user_role`).

**Код:** `AuthContext.login()` → `api.login()` → `api.getUser(username, token)`.

---

## 2. Тенант (клиент)

Тенанты создаются **на бэкенде** (или админом через API), не из текущего веб-интерфейса.

- **Создание:** `POST /tenants/` с телом `{ name, owner_id }` (owner_id — UUID пользователя). В приложении формы создания тенанта нет; это делается через Swagger или бэкенд.
- **Связь пользователь ↔ тенанты:** бэкенд выдаёт список тенантов пользователя через **`GET /tenants/user/{user_id}/all`** — возвращаются ID тенантов. По ним загружаются детали: **`GET /tenants/{tenant_id}`**.

В личном кабинете пользователь **выбирает тенант** из списка (если их несколько); все ВМ и квоты привязаны к тенанту.

---

## 3. Виртуальная машина (ВМ)

### Где создаётся

В **Личном кабинете** (`/dashboard` или `/virtual-apps`): кнопка «+ Создать ВМ», форма (имя, CPU, RAM, диск, статус).

### Как создаётся

1. Должен быть выбран **тенант** (если один — подставляется автоматически).
2. Заполняются поля: название (опционально), CPU (ядра), RAM (МБ), Disk (ГБ), статус (ACTIVE / STOPPED / INACTIVE).
3. При отправке вызывается **`POST /virtual_machines/`** с телом:
   - `name` (или "Virtual Machine"),
   - `cpu`, `ram`, `disk` (числа),
   - `status` (например STOPPED),
   - `tenant_id` (ID выбранного тенанта),
   - `created_by` (ID текущего пользователя).

**Код:** `VirtualAppsDashboard.handleCreateVM()` → `api.createVirtualMachine(payload, token)`.

### Как посмотреть список

- **`GET /virtual_machines/?tenant_id=...`** (и опционально `skip`, `limit`, `created_by`). В дашборде подставляется `tenant_id` выбранного тенанта.

### Запуск / остановка

- Кнопки «Запустить» / «Остановить» в карточке ВМ вызывают **`PUT /virtual_machines/{vm_id}`** с телом `{ status: "ACTIVE" }` или `{ status: "STOPPED" }`.

### Удаление

- Кнопка «Удалить» → **`DELETE /virtual_machines/{vm_id}`**.

---

## 4. Планы и квоты (админ)

### Планы (тарифы)

- Список планов: **`GET /plans/`**. Нужны для назначения квоты тенанту (поле `plan_id`).
- Создание/редактирование планов — через API (Swagger), в текущем UI только выбор плана при создании квоты.

### Квоты тенанта

Назначаются в **Панели администратора** (`/admin`), только для роли `admin`.

1. В блоке «Клиенты (тенанты)» нажать **«Квота»** у нужного тенанта.
2. В форме указать:
   - план (из **`GET /plans/`**),
   - лимиты: CPU, RAM (МБ), Disk (ГБ),
   - сумму (total_price).
3. Отправка: **`POST /tenant_quotas/`** с телом:
   - `tenant_id`, `plan_id`, `total_price`, `total_cpu_limit`, `total_ram_limit`, `total_disk_limit`.

**Код:** `AdminPage.handleCreateQuota()` → `api.createTenantQuota(quotaData, token)`.

- Список квот по тенанту: **`GET /tenant_quotas/tenant/{tenant_id}`**.
- Использование ресурсов по тенанту считается по списку ВМ (**`GET /virtual_machines/?tenant_id=...`**) и отображается в блоке «Использование инфраструктуры».

---

## 5. Кратко по страницам и API

| Действие              | Страница / место      | Метод API                    |
|-----------------------|------------------------|------------------------------|
| Регистрация           | `/register`            | `POST /users/`               |
| Вход                  | `/login`               | `POST /auth/login`, `GET /users/me` |
| Список своих тенантов | Dashboard              | `GET /tenants/user/{user_id}/all`, `GET /tenants/{id}` |
| Список ВМ             | Dashboard              | `GET /virtual_machines/?tenant_id=...` |
| Создать ВМ            | Dashboard → форма      | `POST /virtual_machines/`     |
| Запуск/остановка ВМ   | Карточка ВМ            | `PUT /virtual_machines/{id}`  |
| Удалить ВМ            | Карточка ВМ            | `DELETE /virtual_machines/{id}` |
| Список тенантов       | Admin                  | `GET /tenants/`               |
| Планы                 | Admin (форма квоты)    | `GET /plans/`                 |
| Квоты по тенанту      | Admin                  | `GET /tenant_quotas/tenant/{id}` |
| Создать квоту         | Admin → форма          | `POST /tenant_quotas/`        |

---

## 6. Запуск проекта

- Установка: `npm install`
- Режим разработки (с прокси для API, обход CORS): `npm run dev` — приложение на `http://localhost:5173`, запросы к API идут через `/api` → бэкенд.
- Сборка: `npm run build`
- Превью продакшена: `npm run preview`

Документация API: https://mts-hackathon.onrender.com/docs
