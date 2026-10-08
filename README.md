# Всё правильно, всё сходится!

Многостраничный статический сайт для GitHub Pages. Публикуемая версия генерируется из `site/` в `public/`. Исходный `index.html` в корне остается отдельным ранним прототипом.

## Локальная сборка

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -Command "& ([scriptblock]::Create((Get-Content .\build.ps1 -Raw -Encoding UTF8)))"
```

Команда через `-Command` нужна в Windows PowerShell 5.1: запуск UTF-8 файла через `-File` может неверно прочитать кириллицу. В PowerShell 7 допустим обычный запуск через `-File`.

В `public/` находятся главная, 11 коммерческих страниц, блог с 15 материалами, документы, 404, sitemap, robots и отдельные PNG 1200×630 для социальных карточек. Числовые характеристики, контакты и цены без подтверждения обозначены `[УКАЗАТЬ ДАННЫЕ]`.

## GitHub Pages

1. Создать репозиторий `Vse-pravilno-vse-skhoditsya.github.io` в аккаунте https://github.com/Vse-pravilno-vse-skhoditsya или выбрать другое имя для project Pages.
2. Разместить `site/`, `build.ps1`, `verify.ps1`, `.github/`, README и SEO-документы в ветке `main`.
3. В Settings → Pages выбрать Source → GitHub Actions.
4. Workflow соберет, проверит и опубликует `public/`. Адрес и путь репозитория автоматически попадут в canonical, ссылки и sitemap.

Приложенные исполняемые файлы, ярлыки и личные фото не относятся к сайту.

## Контент и заявки

`site/config.json`: название, email, телефоны, регион, адрес и ссылка на карту. Владелец подтвердил два телефона, `utkinav777@yandex.ru` и адрес: город Ступино, Московская область, Россия. Форма составляет текст и предлагает открыть почтовое приложение для самостоятельной отправки на указанный email. Для настоящей серверной отправки заменить обработчик `site/app.js` на POST к CRM/email API с проверкой ответа. Токен Telegram бота должен храниться только на сервере.

`site/content.json`: услуги, статьи, видео и объекты. Этажность и площадь неизвестных объектов `null`; фильтры не приписывают им характеристики. Правовые страницы требуют реквизитов оператора и утвержденной редакции.

## SEO и проверка

Локальная проверка: `powershell -NoProfile -ExecutionPolicy Bypass -Command "& ([scriptblock]::Create((Get-Content .\verify.ps1 -Raw -Encoding UTF8)))"`. Проверяются H1, ID, якоря, ссылки, JSON-LD, OG-файлы и количество URL в sitemap. Это структурная проверка, не полноценная HTML-валидация.

Сайт доступен локально на `http://localhost:8097/`, пока работает `serve.ps1`. После перезапуска: `powershell -NoProfile -ExecutionPolicy Bypass -File .\serve.ps1`.

JSON-LD содержит Organization, WebSite, WebPage, BreadcrumbList, Service, Article, ImageObject и видимые FAQPage. Даты статей и `VideoObject` с обязательной датой загрузки не выдуманы; для полноценной видеоразметки сначала предоставить точные даты и описания.

GitHub Pages не поддерживает настройку произвольных HTTP 301. Ошибочный URL `/stroitelsvo-doma/` имеет клиентский переход и canonical на `/stroitelstvo-doma/`. Настоящий 301 можно настроить только на прокси или другом хостинге.

После публикации проверить Google Rich Results Test, Schema Markup Validator, карточки Telegram/WhatsApp/VK/Facebook и PageSpeed Insights по реальному URL. Локальная разметка не гарантирует появления расширенного результата или превью в мессенджере.
