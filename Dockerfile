# Stage 1: Build the React app
FROM node:20-alpine as build

WORKDIR /app

RUN npm install -g npm@11.2.0

COPY . .
RUN npm run install:all

RUN npm run build:demo

# Stage 2: Serve the React app using Nginx
FROM nginx:alpine

# Copy the build files from the previous stage to the NGINX server directory
COPY --from=build /app/demo/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Command to run NGINX when the container starts
CMD ["nginx", "-g", "daemon off;"]
