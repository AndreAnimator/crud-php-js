FROM php:8.3-cli

WORKDIR /app

COPY src/ src/

EXPOSE 80

CMD ["php", "-S", "0.0.0.0:80", "-t", "src/public", "src/public/index.php"]