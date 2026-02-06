export interface ComposeInstruction {
  name: string
  description: string
  example: string
  category: 'service' | 'top-level'
}

export const composeInstructions: ComposeInstruction[] = [
  // Top-level
  {
    name: 'version',
    description: '指定 docker-compose 文件格式版本。推荐使用 "3.8" 或更高版本。',
    example: 'version: "3.8"',
    category: 'top-level'
  },
  {
    name: 'services',
    description: '定义应用程序的服务。每个服务对应一个容器。',
    example: 'services:\n  web:\n    image: nginx',
    category: 'top-level'
  },
  {
    name: 'networks',
    description: '定义自定义网络，用于服务间通信。',
    example: 'networks:\n  app-network:\n    driver: bridge',
    category: 'top-level'
  },
  {
    name: 'volumes',
    description: '定义命名卷，用于数据持久化。',
    example: 'volumes:\n  db-data:',
    category: 'top-level'
  },
  // Service-level
  {
    name: 'image',
    description: '指定服务使用的镜像。',
    example: 'image: mysql:8.0',
    category: 'service'
  },
  {
    name: 'build',
    description: '指定构建配置，从 Dockerfile 构建镜像。',
    example: 'build:\n  context: .\n  dockerfile: Dockerfile',
    category: 'service'
  },
  {
    name: 'container_name',
    description: '指定容器名称。如不指定，将自动生成。',
    example: 'container_name: my-app',
    category: 'service'
  },
  {
    name: 'ports',
    description: '映射端口。格式: "宿主机端口:容器端口"。',
    example: 'ports:\n  - "8080:80"\n  - "443:443"',
    category: 'service'
  },
  {
    name: 'volumes',
    description: '挂载卷或绑定目录。',
    example: 'volumes:\n  - ./data:/var/lib/mysql\n  - app-logs:/var/log',
    category: 'service'
  },
  {
    name: 'environment',
    description: '设置环境变量。',
    example: 'environment:\n  - MYSQL_ROOT_PASSWORD=secret\n  - MYSQL_DATABASE=app',
    category: 'service'
  },
  {
    name: 'env_file',
    description: '从文件加载环境变量。',
    example: 'env_file:\n  - .env\n  - .env.local',
    category: 'service'
  },
  {
    name: 'depends_on',
    description: '定义服务依赖关系，控制启动顺序。',
    example: 'depends_on:\n  - db\n  - redis',
    category: 'service'
  },
  {
    name: 'networks',
    description: '指定服务连接的网络。',
    example: 'networks:\n  - app-network\n  - backend',
    category: 'service'
  },
  {
    name: 'restart',
    description: '定义重启策略: no, always, on-failure, unless-stopped。',
    example: 'restart: unless-stopped',
    category: 'service'
  },
  {
    name: 'command',
    description: '覆盖容器默认命令。',
    example: 'command: ["npm", "run", "dev"]',
    category: 'service'
  },
  {
    name: 'entrypoint',
    description: '覆盖容器入口点。',
    example: 'entrypoint: /docker-entrypoint.sh',
    category: 'service'
  },
  {
    name: 'healthcheck',
    description: '配置健康检查。',
    example: 'healthcheck:\n  test: ["CMD", "curl", "-f", "http://localhost"]\n  interval: 30s\n  timeout: 10s\n  retries: 3',
    category: 'service'
  },
  {
    name: 'deploy',
    description: '配置部署选项（Swarm 模式）。',
    example: 'deploy:\n  replicas: 3\n  resources:\n    limits:\n      cpus: "0.5"\n      memory: 512M',
    category: 'service'
  },
  {
    name: 'logging',
    description: '配置日志选项。',
    example: 'logging:\n  driver: json-file\n  options:\n    max-size: "10m"\n    max-file: "3"',
    category: 'service'
  }
]

export interface ComposeTemplate {
  name: string
  description: string
  content: string
}

export const composeTemplates: ComposeTemplate[] = [
  {
    name: 'Java + MySQL',
    description: 'Spring Boot 应用 + MySQL 数据库',
    content: `version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: {{应用容器名}}
    ports:
      - "{{宿主机端口}}:{{容器端口}}"
    environment:
      - SPRING_PROFILES_ACTIVE={{环境，如：docker}}
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/{{数据库名}}?useSSL=false&allowPublicKeyRetrieval=true
      - SPRING_DATASOURCE_USERNAME={{数据库用户名}}
      - SPRING_DATASOURCE_PASSWORD={{数据库密码}}
    depends_on:
      db:
        condition: service_healthy
    networks:
      - app-network
    restart: unless-stopped

  db:
    image: mysql:8.0
    container_name: {{数据库容器名}}
    environment:
      - MYSQL_ROOT_PASSWORD={{root密码}}
      - MYSQL_DATABASE={{数据库名}}
      - MYSQL_USER={{数据库用户名}}
      - MYSQL_PASSWORD={{数据库密码}}
    ports:
      - "{{MySQL宿主机端口，如：3306}}:3306"
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

networks:
  app-network:
    driver: bridge

volumes:
  mysql-data:`
  },
  {
    name: 'Java + MySQL + Redis',
    description: 'Spring Boot 应用 + MySQL + Redis 缓存',
    content: `version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: {{应用容器名}}
    ports:
      - "{{宿主机端口}}:{{容器端口}}"
    environment:
      - SPRING_PROFILES_ACTIVE={{环境，如：docker}}
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/{{数据库名}}?useSSL=false&allowPublicKeyRetrieval=true
      - SPRING_DATASOURCE_USERNAME={{数据库用户名}}
      - SPRING_DATASOURCE_PASSWORD={{数据库密码}}
      - SPRING_REDIS_HOST=redis
      - SPRING_REDIS_PORT=6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - app-network
    restart: unless-stopped

  db:
    image: mysql:8.0
    container_name: {{数据库容器名}}
    environment:
      - MYSQL_ROOT_PASSWORD={{root密码}}
      - MYSQL_DATABASE={{数据库名}}
      - MYSQL_USER={{数据库用户名}}
      - MYSQL_PASSWORD={{数据库密码}}
    ports:
      - "{{MySQL宿主机端口，如：3306}}:3306"
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: {{Redis容器名}}
    ports:
      - "{{Redis宿主机端口，如：6379}}:6379"
    volumes:
      - redis-data:/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

networks:
  app-network:
    driver: bridge

volumes:
  mysql-data:
  redis-data:`
  },
  {
    name: '微服务架构',
    description: 'Spring Cloud 微服务 + Nacos + MySQL + Redis',
    content: `version: "3.8"

services:
  # Nacos 配置中心/注册中心
  nacos:
    image: nacos/nacos-server:v2.2.3
    container_name: nacos
    environment:
      - MODE=standalone
      - SPRING_DATASOURCE_PLATFORM=mysql
      - MYSQL_SERVICE_HOST=nacos-db
      - MYSQL_SERVICE_DB_NAME=nacos
      - MYSQL_SERVICE_USER={{Nacos数据库用户名}}
      - MYSQL_SERVICE_PASSWORD={{Nacos数据库密码}}
    ports:
      - "8848:8848"
      - "9848:9848"
    depends_on:
      nacos-db:
        condition: service_healthy
    networks:
      - microservice-network
    restart: unless-stopped

  nacos-db:
    image: mysql:8.0
    container_name: nacos-db
    environment:
      - MYSQL_ROOT_PASSWORD={{root密码}}
      - MYSQL_DATABASE=nacos
      - MYSQL_USER={{Nacos数据库用户名}}
      - MYSQL_PASSWORD={{Nacos数据库密码}}
    volumes:
      - nacos-db-data:/var/lib/mysql
    networks:
      - microservice-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # 业务数据库
  business-db:
    image: mysql:8.0
    container_name: business-db
    environment:
      - MYSQL_ROOT_PASSWORD={{root密码}}
      - MYSQL_DATABASE={{业务数据库名}}
      - MYSQL_USER={{业务数据库用户名}}
      - MYSQL_PASSWORD={{业务数据库密码}}
    ports:
      - "{{MySQL宿主机端口，如：3306}}:3306"
    volumes:
      - business-db-data:/var/lib/mysql
    networks:
      - microservice-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # Redis 缓存
  redis:
    image: redis:7-alpine
    container_name: redis
    ports:
      - "{{Redis宿主机端口，如：6379}}:6379"
    volumes:
      - redis-data:/data
    networks:
      - microservice-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # 网关服务
  gateway:
    build:
      context: {{网关服务目录，如：./gateway}}
      dockerfile: Dockerfile
    container_name: gateway
    ports:
      - "{{网关端口，如：8080}}:8080"
    environment:
      - SPRING_PROFILES_ACTIVE={{环境，如：docker}}
      - SPRING_CLOUD_NACOS_DISCOVERY_SERVER-ADDR=nacos:8848
      - SPRING_CLOUD_NACOS_CONFIG_SERVER-ADDR=nacos:8848
    depends_on:
      - nacos
    networks:
      - microservice-network
    restart: unless-stopped

  # 用户服务（按需修改或删除）
  user-service:
    build:
      context: {{用户服务目录，如：./user-service}}
      dockerfile: Dockerfile
    container_name: {{用户服务容器名}}
    environment:
      - SPRING_PROFILES_ACTIVE={{环境，如：docker}}
      - SPRING_CLOUD_NACOS_DISCOVERY_SERVER-ADDR=nacos:8848
      - SPRING_CLOUD_NACOS_CONFIG_SERVER-ADDR=nacos:8848
    depends_on:
      - nacos
      - business-db
      - redis
    networks:
      - microservice-network
    restart: unless-stopped

  # 订单服务（按需修改或删除）
  order-service:
    build:
      context: {{订单服务目录，如：./order-service}}
      dockerfile: Dockerfile
    container_name: {{订单服务容器名}}
    environment:
      - SPRING_PROFILES_ACTIVE={{环境，如：docker}}
      - SPRING_CLOUD_NACOS_DISCOVERY_SERVER-ADDR=nacos:8848
      - SPRING_CLOUD_NACOS_CONFIG_SERVER-ADDR=nacos:8848
    depends_on:
      - nacos
      - business-db
      - redis
    networks:
      - microservice-network
    restart: unless-stopped

networks:
  microservice-network:
    driver: bridge

volumes:
  nacos-db-data:
  business-db-data:
  redis-data:`
  },
  {
    name: 'Vue + Nginx',
    description: 'Vue 前端应用 + Nginx 反向代理',
    content: `version: "3.8"

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: {{前端容器名}}
    ports:
      - "{{HTTP端口，如：80}}:80"
      - "{{HTTPS端口，如：443}}:443"
    volumes:
      - {{Nginx配置文件路径，如：./nginx.conf}}:/etc/nginx/conf.d/default.conf:ro
    networks:
      - frontend-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

networks:
  frontend-network:
    driver: bridge`
  },
  {
    name: '全栈应用',
    description: 'Vue 前端 + Java 后端 + MySQL + Redis + Nginx',
    content: `version: "3.8"

services:
  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    container_name: nginx-proxy
    ports:
      - "{{HTTP端口，如：80}}:80"
      - "{{HTTPS端口，如：443}}:443"
    volumes:
      - {{Nginx主配置文件路径，如：./nginx/nginx.conf}}:/etc/nginx/nginx.conf:ro
      - {{Nginx配置目录，如：./nginx/conf.d}}:/etc/nginx/conf.d:ro
    depends_on:
      - frontend
      - backend
    networks:
      - app-network
    restart: unless-stopped

  # Vue 前端
  frontend:
    build:
      context: {{前端项目目录，如：./frontend}}
      dockerfile: Dockerfile
    container_name: {{前端容器名}}
    networks:
      - app-network
    restart: unless-stopped

  # Spring Boot 后端
  backend:
    build:
      context: {{后端项目目录，如：./backend}}
      dockerfile: Dockerfile
    container_name: {{后端容器名}}
    environment:
      - SPRING_PROFILES_ACTIVE={{环境，如：docker}}
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/{{数据库名}}?useSSL=false&allowPublicKeyRetrieval=true
      - SPRING_DATASOURCE_USERNAME={{数据库用户名}}
      - SPRING_DATASOURCE_PASSWORD={{数据库密码}}
      - SPRING_REDIS_HOST=redis
      - SPRING_REDIS_PORT=6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - app-network
    restart: unless-stopped

  # MySQL 数据库
  db:
    image: mysql:8.0
    container_name: {{数据库容器名}}
    environment:
      - MYSQL_ROOT_PASSWORD={{root密码}}
      - MYSQL_DATABASE={{数据库名}}
      - MYSQL_USER={{数据库用户名}}
      - MYSQL_PASSWORD={{数据库密码}}
    volumes:
      - mysql-data:/var/lib/mysql
      - {{初始化SQL文件路径，如：./init.sql}}:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # Redis 缓存
  redis:
    image: redis:7-alpine
    container_name: {{Redis容器名}}
    volumes:
      - redis-data:/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

networks:
  app-network:
    driver: bridge

volumes:
  mysql-data:
  redis-data:`
  }
]
