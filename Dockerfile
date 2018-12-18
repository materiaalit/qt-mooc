FROM ruby:2.4-alpine

RUN apk update && \
    apk upgrade && \
    apk add --update curl-dev ruby-dev build-base bash ruby-json yaml nodejs && \
    rm -rf /var/cache/apk/* && \
    mkdir -p /app

WORKDIR /app

COPY . /app

RUN bundle config build.nokogiri --use-system-libraries && \
            bundle install --jobs=3 --retry=3 && \
            bundle clean && \
            npm install

EXPOSE 4567

CMD ["bundle", "exec", "middleman", "server", "--bind-address", "0.0.0.0"]
