# Build stage using Deno
FROM denoland/deno:alpine-1 as build

# Set working directory
WORKDIR /app

# Copy source files
COPY . .

# Cache and compile dependencies (optional but recommended)
RUN deno cache main.ts

# Build your frontend (replace by your actual build command if needed)
# For example, if you're using a Deno-based static site generator, build here
# If you just have static files already, skip this step

# Production stage with Nginx
FROM nginx:alpine

# Copy static files to Nginx serve directory
# Replace "public" by the correct folder containing your static files
COPY --from=build /app/public /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
