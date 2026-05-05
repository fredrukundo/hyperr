FROM nginx:alpine

# Remove default nginx config to avoid conflicts
RUN rm /etc/nginx/conf.d/default.conf

COPY ./configuration/hypertube.conf /etc/nginx/conf.d/
