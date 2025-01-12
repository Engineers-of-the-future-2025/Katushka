const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');  // Для отправки запросов на GitHub API

const app = express();
const PORT = 3000;

// GitHub API настройки
const GITHUB_TOKEN = 'your-github-token';  // Здесь укажите ваш токен
const REPO_OWNER = 'your-github-username'; // Ваше имя пользователя на GitHub
const REPO_NAME = 'your-repository-name';  // Название репозитория

// Middleware для сервировки статичных файлов
app.use(express.static('public'));

// Конфигурация хранения файлов с помощью multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Обработка загрузки файла
app.post('/upload', upload.single('photoFile'), async (req, res) => {
    if (req.file) {
        try {
            // Читаем файл, который был загружен
            const fileContent = fs.readFileSync(path.join(__dirname, 'uploads', req.file.filename));

            // Подготовка данных для запроса к GitHub API
            const filePath = `images/${req.file.filename}`;
            const content = fileContent.toString('base64');

            // Отправка файла в репозиторий на GitHub
            const response = await axios.put(
                `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
                {
                    message: `Add ${req.file.filename}`,
                    content: content,
                    branch: 'main',  // Вы можете указать другую ветку, если нужно
                },
                {
                    headers: {
                        Authorization: `token ${GITHUB_TOKEN}`,
                    },
                }
            );

            // Отправка ответа после успешной загрузки
            res.json({
                success: true,
                filePath: `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/main/${filePath}`,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Ошибка при загрузке файла на GitHub' });
        }
    } else {
        res.status(400).json({ success: false, message: 'Файл не загружен' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
