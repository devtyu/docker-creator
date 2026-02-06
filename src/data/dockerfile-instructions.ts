export interface DockerfileInstruction {
  name: string
  description: string
  example: string
  inputType: 'text' | 'textarea' | 'select'
  options?: string[]
  placeholder?: string
}

export const dockerfileInstructions: DockerfileInstruction[] = [
  {
    name: 'FROM',
    description: '指定基础镜像。每个 Dockerfile 必须以 FROM 指令开始（ARG 除外）。',
    example: 'FROM openjdk:17-jdk-slim',
    inputType: 'text',
    placeholder: '如: openjdk:17-jdk-slim, node:18-alpine'
  },
  {
    name: 'ARG',
    description: '定义构建时的变量，可在构建时通过 --build-arg 传递。',
    example: 'ARG JAR_FILE=target/*.jar',
    inputType: 'text',
    placeholder: '如: VERSION=1.0, JAR_FILE=target/*.jar'
  },
  {
    name: 'LABEL',
    description: '为镜像添加元数据，如作者、版本等信息。',
    example: 'LABEL maintainer="dev@example.com"',
    inputType: 'text',
    placeholder: '如: maintainer="dev@example.com" version="1.0"'
  },
  {
    name: 'ENV',
    description: '设置环境变量，在容器运行时可用。',
    example: 'ENV JAVA_OPTS="-Xmx512m"',
    inputType: 'text',
    placeholder: '如: JAVA_OPTS="-Xmx512m", NODE_ENV=production'
  },
  {
    name: 'WORKDIR',
    description: '设置工作目录，后续指令将在此目录下执行。',
    example: 'WORKDIR /app',
    inputType: 'text',
    placeholder: '如: /app, /home/node/app'
  },
  {
    name: 'USER',
    description: '指定运行容器时的用户。出于安全考虑，建议使用非 root 用户。',
    example: 'USER 1001',
    inputType: 'text',
    placeholder: '如: node, 1001, appuser'
  },
  {
    name: 'COPY',
    description: '从构建上下文复制文件到镜像中。支持多阶段构建的 --from 参数。',
    example: 'COPY target/*.jar app.jar',
    inputType: 'text',
    placeholder: '如: package.json ., --from=builder /app/dist ./dist'
  },
  {
    name: 'ADD',
    description: '类似 COPY，但支持自动解压 tar 文件和远程 URL。一般推荐使用 COPY。',
    example: 'ADD app.tar.gz /app/',
    inputType: 'text',
    placeholder: '如: app.tar.gz /app/, https://example.com/file.tar.gz /tmp/'
  },
  {
    name: 'RUN',
    description: '在构建时执行命令。建议合并多个命令减少镜像层数。',
    example: 'RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*',
    inputType: 'textarea',
    placeholder: '如: apt-get update && apt-get install -y curl'
  },
  {
    name: 'EXPOSE',
    description: '声明容器运行时监听的端口。仅作文档用途，不会自动发布端口。',
    example: 'EXPOSE 8080',
    inputType: 'text',
    placeholder: '如: 8080, 80 443, 3000'
  },
  {
    name: 'VOLUME',
    description: '创建挂载点，用于持久化数据或共享数据。',
    example: 'VOLUME ["/data", "/logs"]',
    inputType: 'text',
    placeholder: '如: /data, ["/data", "/logs"]'
  },
  {
    name: 'CMD',
    description: '指定容器启动时默认执行的命令。可被 docker run 的参数覆盖。',
    example: 'CMD ["java", "-jar", "app.jar"]',
    inputType: 'textarea',
    placeholder: '如: ["java", "-jar", "app.jar"], ["npm", "start"]'
  },
  {
    name: 'ENTRYPOINT',
    description: '指定容器启动时执行的命令。与 CMD 配合使用，CMD 的内容会作为参数传递。',
    example: 'ENTRYPOINT ["java", "-jar"]',
    inputType: 'textarea',
    placeholder: '如: ["java", "-jar"], ["docker-entrypoint.sh"]'
  },
  {
    name: 'HEALTHCHECK',
    description: '定义健康检查命令，用于检测容器是否正常运行。',
    example: 'HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:8080/health || exit 1',
    inputType: 'textarea',
    placeholder: '如: --interval=30s CMD curl -f http://localhost/ || exit 1'
  },
  {
    name: 'ONBUILD',
    description: '定义触发器指令，在以此镜像为基础构建时执行。',
    example: 'ONBUILD COPY . /app',
    inputType: 'text',
    placeholder: '如: COPY . /app, RUN npm install'
  }
]

export interface DockerfileTemplate {
  name: string
  description: string
  content: string
}

export const dockerfileTemplates: DockerfileTemplate[] = [
  {
    name: 'Java 单体项目 (Maven)',
    description: '适用于 Spring Boot 单体应用，使用多阶段构建',
    content: `# 构建阶段
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

# 运行阶段
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
LABEL maintainer="{{你的邮箱}}"

# 创建非root用户
RUN addgroup -g 1001 appgroup && adduser -u 1001 -G appgroup -D appuser
USER appuser

COPY --from=builder /app/target/*.jar app.jar

ENV JAVA_OPTS="{{JVM参数，如：-Xmx512m -Xms256m}}"
EXPOSE {{端口号，如：8080}}

HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \\
  CMD wget --quiet --tries=1 --spider http://localhost:{{端口号}}/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]`
  },
  {
    name: 'Java 单体项目 (Gradle)',
    description: '适用于 Spring Boot 单体应用，使用 Gradle 构建',
    content: `# 构建阶段
FROM gradle:8-jdk17 AS builder
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
RUN gradle dependencies --no-daemon
COPY src ./src
RUN gradle bootJar --no-daemon

# 运行阶段
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
LABEL maintainer="{{你的邮箱}}"

RUN addgroup -g 1001 appgroup && adduser -u 1001 -G appgroup -D appuser
USER appuser

COPY --from=builder /app/build/libs/*.jar app.jar

ENV JAVA_OPTS="{{JVM参数，如：-Xmx512m -Xms256m}}"
EXPOSE {{端口号，如：8080}}

HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \\
  CMD wget --quiet --tries=1 --spider http://localhost:{{端口号}}/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]`
  },
  {
    name: 'Java 分布式项目',
    description: '适用于微服务架构，支持配置中心和服务发现',
    content: `# 构建阶段
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

# 运行阶段
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
LABEL maintainer="{{你的邮箱}}"

RUN addgroup -g 1001 appgroup && adduser -u 1001 -G appgroup -D appuser
USER appuser

COPY --from=builder /app/target/*.jar app.jar

# 微服务配置
ENV JAVA_OPTS="{{JVM参数，如：-Xmx512m -Xms256m}}"
ENV SPRING_PROFILES_ACTIVE="{{环境配置，如：docker}}"
ENV SPRING_CLOUD_CONFIG_URI="{{配置中心地址，如：http://config-server:8888}}"
ENV EUREKA_CLIENT_SERVICEURL_DEFAULTZONE="{{注册中心地址，如：http://eureka-server:8761/eureka/}}"

EXPOSE {{端口号，如：8080}}

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \\
  CMD wget --quiet --tries=1 --spider http://localhost:{{端口号}}/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]`
  },
  {
    name: 'Vue 前端项目',
    description: '适用于 Vue/React 前端项目，使用 Nginx 部署',
    content: `# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci --only=production=false

# 构建
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine
LABEL maintainer="{{你的邮箱}}"

# 复制构建产物（注意：如果输出目录不是 dist，请修改）
COPY --from=builder /app/{{构建输出目录，如：dist}} /usr/share/nginx/html

# 自定义 Nginx 配置（确保项目根目录存在 nginx.conf 文件）
COPY {{Nginx配置文件路径，如：nginx.conf}} /etc/nginx/conf.d/default.conf

# 创建非root用户运行nginx
RUN chown -R nginx:nginx /usr/share/nginx/html && \\
    chown -R nginx:nginx /var/cache/nginx && \\
    chown -R nginx:nginx /var/log/nginx && \\
    touch /var/run/nginx.pid && \\
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE {{端口号，如：80}}

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \\
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]`
  }
]
