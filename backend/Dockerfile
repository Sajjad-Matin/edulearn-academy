FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libonig-dev \
    libzip-dev \
    unzip \
    git \
    && docker-php-ext-install pdo pdo_mysql mbstring zip

# Enable Apache rewrite
RUN a2enmod rewrite

# Set Apache DocumentRoot to /public
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf \
    /etc/apache2/apache2.conf

# Copy app
COPY . /var/www/html

WORKDIR /var/www/html

# Install Composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && php -r "unlink('composer-setup.php');"

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Permissions
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80
