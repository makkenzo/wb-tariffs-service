# Сервис обновления тарифов Wildberries

## Установка и запуск

**1. Клонируйте репозиторий:**

```bash
git clone https://github.com/makkenzo/wb-tariffs-service.git
cd wb-tariffs-service
```

**2. Настройте переменные окружения:**
Создайте файл `.env` из примера. Вся конфигурация происходит в этом файле.

```bash
cp .env.example .env
```

Откройте файл `.env` и заполните его своими данными:

-   `WB_API_TOKEN`: Ваш токен для доступа к Wildberries API.

-   `GOOGLE_SHEET_IDS`: ID ваших Google-таблиц, перечисленные через запятую (без пробелов). ID можно найти в URL таблицы: `https://docs.google.com/spreadsheets/d/<ID>/edit`.

-   `GOOGLE_CREDENTIALS_BASE64`: Учетные данные сервисного аккаунта Google, закодированные в Base64.

    1.  Получите JSON-файл с ключом сервисного аккаунта из Google Cloud Console.
    2.  **ВАЖНО:** Откройте ваши Google Таблицы и предоставьте права **"Редактора"** email-адресу из этого JSON-файла (поле `client_email`).
    3.  Сконвертируйте содержимое JSON-файла в одну строку Base64. На Linux/macOS:
        ```bash
        base64 -w 0 /путь/к/вашему/credentials.json
        ```
    4.  Вставьте полученную строку в `.env`.

    5.  Запустите приложение:

    ```bash
    docker compose up -d
    ```

## Как проверить работу приложения

После запуска приложение один раз выполнит задачу обновления, а затем будет повторять ее каждый час.

**1. Логи приложения:**

```bash
docker compose logs -f wb-tariffs-service
```

**2. База данных:**
Можно подключиться к контейнеру с PostgreSQL и убедиться, что данные на месте.

```bash
docker compose exec db psql -U wbadmin -d db

SELECT * FROM tariffs ORDER BY date DESC, "warehouseName" ASC LIMIT 5;
```

**3. Google Таблицы:**
Откройте вашу Google Таблицу. В ней должен появиться (или обновиться) лист с названием `stocks_coefs`, заполненный актуальными тарифами и отсортированный по возрастанию колонки `boxDeliveryCoefExpr`.
