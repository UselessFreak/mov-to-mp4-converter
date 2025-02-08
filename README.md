# MOV to MP4 Converter API

## API

### POST /upload

Accepts a video file in `.mov` format for conversion.

**Request:**

*   Method: `POST`
*   URL: `/upload`
*   Content-Type: `multipart/form-data`
*   Form field: `video` (containing the `.mov` file)

**Example Request (cURL):**

*   curl -X POST -F "video=@/path/to/your/video.mov" http://localhost:3000/upload

**Example Response (JSON):**

*   "downloadUrl": "http://your-server.com/download/converted_video.mp4"

**Response Codes:**

*   200 OK: Successful upload and conversion. The response body contains the download URL.
*   400 Bad Request: If the uploaded file is not in .mov format or the video field is missing.
*   500 Internal Server Error: If an error occurred during conversion.

### GET /download/:filename
*   Provides the converted file for download.

**Request:**

*   Method: GET
*   URL: /download/converted_video.mp4 (replace converted_video.mp4 with your file name)

**Example Request (cURL):**

*   curl -O http://localhost:3000/download/converted_video.mp4

**Response Codes:**

*   200 OK: Successful file delivery.
*   404 Not Found: If the file is not found.

## Running the Server

1. **Install Node.js and npm**

2. **Clone the repository:**

*   git clone https://github.com/UselessFreak/mov-to-mp4-converter

3. **Navigate to the project folder:**

*   cd mov-to-mp4-converter

4. **Install dependencies:**

*   npm install

5. **Start the server:**

*   npm start

6. **The server will be running at http://localhost:3000**

## .env File

*   A .env file is required for configuring environment variables.

**.env:**

*   PORT=3000
*   UPLOAD_DIR=uploads
*   CONVERTED_DIR=converted

## .gitignore

**The .gitignore file excludes temporary files and folders from the repository:**

*   node_modules/
*   uploads/*
*   converted/*
*   .env
*   !uploads/.gitkeep
*   !converted/.gitkeep

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------

# API конвертера MOV в MP4

## API

### POST /upload

Принимает видеофайл в формате `.mov` для конвертации

**Запрос:**

*   Метод: `POST`
*   URL: `/upload`
*   Content-Type: `multipart/form-data`
*   Поле формы: `video` (содержащее файл `.mov`)

**Пример запроса (cURL):**

*   curl -X POST -F "video=@/path/to/your/video.mov" http://localhost:3000/upload

**Пример ответа (JSON):**

*   "downloadUrl": "http://your-server.com/download/converted_video.mp4"

**Коды ответов:**

*   200 OK: Успешная загрузка и конвертация. В теле ответа содержится URL для скачивания.
*   400 Bad Request: Если загружен файл не в формате .mov или отсутствует поле video.
*   500 Internal Server Error: Если произошла ошибка при конвертации.

### GET /download/:filename

Предоставляет сконвертированный файл для скачивания.

**Запрос:**

*   Метод: GET
*   URL: /download/converted_video.mp4 (замените converted_video.mp4 на имя вашего файла)

**Пример запроса (cURL):**

*   curl -O http://localhost:3000/download/converted_video.mp4

**Коды ответов:**

*   200 OK: Успешная отдача файла.
*   404 Not Found: Если файл не найден.

## Запуск сервера

1. **Установите Node.js и npm**

2. **Клонируйте репозиторий:**

*   git clone https://github.com/UselessFreak/mov-to-mp4-converter

3. **Перейдите в папку проекта:**

*   cd mov-to-mp4-converter

4. **Установите зависимости:**

*   npm install

5. **Запустите сервер:**

* npm start

6. **Сервер будет запущен по адресу http://localhost:3000**

## Файл .env

* Необходим файл .env для конфигурации переменных окружения

**.env:**

*   PORT=3000
*   UPLOAD_DIR=uploads
*   CONVERTED_DIR=converted

## .gitignore

**Файл .gitignore исключает из репозитория временные файлы и папки:**

*   node_modules/
*   uploads/*
*   converted/*
*   .env
*   !uploads/.gitkeep
*   !converted/.gitkeep