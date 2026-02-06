export interface CommandDetail {
  name: string
  syntax: string
  description: string
  usage: string
  examples: {
    code: string
    explanation: string
  }[]
  tips: string[]
  bestPractices?: string[]
}

export const dockerfileCommands: CommandDetail[] = [
  {
    name: 'FROM',
    syntax: 'FROM <镜像名>[:<标签>] [AS <别名>]',
    description: 'FROM 是 Dockerfile 中最重要的指令，用于指定构建镜像的基础镜像。每个 Dockerfile 必须以 FROM 指令开始（除了 ARG 可以在 FROM 之前）。你可以把它理解为"我要基于哪个镜像来构建我的应用"。',
    usage: '选择一个合适的基础镜像是构建 Docker 镜像的第一步。基础镜像决定了你的容器运行环境，比如操作系统、预装的软件等。',
    examples: [
      {
        code: 'FROM ubuntu:22.04',
        explanation: '使用 Ubuntu 22.04 作为基础镜像，适合需要完整 Linux 环境的应用'
      },
      {
        code: 'FROM node:18-alpine',
        explanation: '使用 Node.js 18 的 Alpine 版本，Alpine 是一个超轻量级的 Linux 发行版，镜像体积小'
      },
      {
        code: 'FROM eclipse-temurin:17-jre-alpine AS runtime',
        explanation: '使用 Java 17 JRE 版本，并命名为 runtime，常用于多阶段构建'
      },
      {
        code: 'FROM scratch',
        explanation: '从零开始构建，不基于任何镜像，适合构建最小化的静态编译程序'
      }
    ],
    tips: [
      '优先选择官方镜像，安全性和稳定性更有保障',
      '使用具体的版本标签（如 node:18.17.0），避免使用 latest，确保构建的可重复性',
      '选择 Alpine 版本的镜像可以大幅减小镜像体积',
      '对于 Java 应用，生产环境使用 JRE 而非 JDK，减小镜像大小'
    ],
    bestPractices: [
      '使用多阶段构建：在构建阶段使用完整镜像（如 maven:3.9），在运行阶段使用精简镜像（如 eclipse-temurin:17-jre-alpine）',
      '定期更新基础镜像以获取安全补丁'
    ]
  },
  {
    name: 'ARG',
    syntax: 'ARG <变量名>[=<默认值>]',
    description: 'ARG 用于定义构建时的变量，这些变量只在构建过程中有效，不会保留到最终镜像中。你可以在构建时通过 --build-arg 参数传递值来覆盖默认值。',
    usage: '当你需要在构建时动态传入一些值（如版本号、环境配置等），但又不想把这些值硬编码在 Dockerfile 中时，就可以使用 ARG。',
    examples: [
      {
        code: 'ARG VERSION=1.0.0',
        explanation: '定义一个名为 VERSION 的变量，默认值为 1.0.0'
      },
      {
        code: 'ARG JAR_FILE=target/*.jar\nCOPY ${JAR_FILE} app.jar',
        explanation: '定义 JAR 文件路径变量，在 COPY 指令中使用'
      },
      {
        code: 'ARG BASE_IMAGE=eclipse-temurin:17-jre-alpine\nFROM ${BASE_IMAGE}',
        explanation: 'ARG 可以在 FROM 之前定义，用于动态指定基础镜像'
      }
    ],
    tips: [
      'ARG 定义的变量只在构建阶段有效，容器运行时无法访问',
      '不要用 ARG 传递密码等敏感信息，因为这些值会记录在镜像的构建历史中',
      'ARG 变量在 FROM 之后需要重新定义才能使用',
      '使用 docker build --build-arg VERSION=2.0.0 来覆盖默认值'
    ]
  },
  {
    name: 'ENV',
    syntax: 'ENV <变量名>=<值> [<变量名>=<值> ...]',
    description: 'ENV 用于设置环境变量，这些变量在构建过程和容器运行时都可以使用。环境变量是配置应用程序的常用方式，比如设置 Java 内存参数、Node.js 环境等。',
    usage: '当你需要配置应用程序的运行参数，或者需要在多个指令中复用某个值时，使用 ENV 是最佳选择。',
    examples: [
      {
        code: 'ENV NODE_ENV=production',
        explanation: '设置 Node.js 环境为生产模式'
      },
      {
        code: 'ENV JAVA_OPTS="-Xmx512m -Xms256m"',
        explanation: '设置 Java 虚拟机的内存参数'
      },
      {
        code: 'ENV APP_HOME=/app \\\n    APP_USER=appuser',
        explanation: '一次设置多个环境变量，使用反斜杠换行'
      }
    ],
    tips: [
      'ENV 设置的变量会持久化到镜像中，容器运行时可以通过 $变量名 访问',
      '可以使用 docker run -e 或 --env 在运行时覆盖 ENV 设置的值',
      '敏感信息（如数据库密码）建议在运行时通过 -e 传入，而不是写在 Dockerfile 中',
      '使用 ENV 可以让 Dockerfile 更易读和维护'
    ]
  },
  {
    name: 'WORKDIR',
    syntax: 'WORKDIR <目录路径>',
    description: 'WORKDIR 用于设置工作目录，后续的 RUN、CMD、ENTRYPOINT、COPY、ADD 指令都会在这个目录下执行。如果目录不存在，Docker 会自动创建。',
    usage: '使用 WORKDIR 可以避免在每个命令中都写绝对路径，让 Dockerfile 更简洁清晰。',
    examples: [
      {
        code: 'WORKDIR /app',
        explanation: '设置工作目录为 /app，这是最常用的做法'
      },
      {
        code: 'WORKDIR /home/node/app\nCOPY package.json .\nRUN npm install',
        explanation: '设置工作目录后，COPY 和 RUN 都在该目录下执行'
      },
      {
        code: 'WORKDIR /a\nWORKDIR b\nWORKDIR c\n# 最终目录是 /a/b/c',
        explanation: 'WORKDIR 可以使用相对路径，会基于上一个 WORKDIR 进行拼接'
      }
    ],
    tips: [
      '始终使用 WORKDIR 而不是 RUN cd /path，因为 RUN cd 只在当前层有效',
      '推荐使用绝对路径，避免混淆',
      '常用的工作目录：/app、/home/用户名/app、/opt/应用名'
    ]
  },
  {
    name: 'COPY',
    syntax: 'COPY [--chown=<用户>:<组>] <源路径>... <目标路径>',
    description: 'COPY 用于将构建上下文（通常是 Dockerfile 所在目录）中的文件或目录复制到镜像中。这是将你的应用代码放入镜像的主要方式。',
    usage: '当你需要将本地文件（如源代码、配置文件、编译产物）复制到镜像中时使用 COPY。',
    examples: [
      {
        code: 'COPY package.json .',
        explanation: '将 package.json 复制到当前工作目录'
      },
      {
        code: 'COPY src/ /app/src/',
        explanation: '将 src 目录复制到镜像的 /app/src/ 目录'
      },
      {
        code: 'COPY --from=builder /app/dist ./dist',
        explanation: '多阶段构建：从名为 builder 的构建阶段复制文件'
      },
      {
        code: 'COPY --chown=node:node . .',
        explanation: '复制文件并设置文件所有者为 node 用户'
      }
    ],
    tips: [
      '使用 .dockerignore 文件排除不需要的文件（如 node_modules、.git）',
      'COPY 比 ADD 更透明、更推荐使用，除非需要自动解压功能',
      '先复制依赖文件（如 package.json），再复制源代码，可以利用 Docker 缓存加速构建',
      '目标路径如果不存在会自动创建'
    ],
    bestPractices: [
      '分层复制以利用缓存：先 COPY package*.json，再 RUN npm install，最后 COPY 源代码'
    ]
  },
  {
    name: 'ADD',
    syntax: 'ADD [--chown=<用户>:<组>] <源路径>... <目标路径>',
    description: 'ADD 与 COPY 类似，但有两个额外功能：1) 可以自动解压 tar 压缩文件；2) 可以从 URL 下载文件。不过一般推荐使用 COPY，除非确实需要这些额外功能。',
    usage: '当你需要复制并自动解压 tar 文件，或者需要从网络下载文件时使用 ADD。',
    examples: [
      {
        code: 'ADD app.tar.gz /app/',
        explanation: '复制并自动解压 tar.gz 文件到 /app/ 目录'
      },
      {
        code: 'ADD https://example.com/file.tar.gz /tmp/',
        explanation: '从 URL 下载文件（注意：不会自动解压 URL 下载的压缩文件）'
      }
    ],
    tips: [
      '优先使用 COPY，只有需要自动解压时才用 ADD',
      'ADD 从 URL 下载的文件不会自动解压',
      '如果需要从 URL 下载并解压，建议使用 RUN curl + tar 组合，这样更透明'
    ]
  },
  {
    name: 'RUN',
    syntax: 'RUN <命令>  或  RUN ["可执行文件", "参数1", "参数2"]',
    description: 'RUN 用于在构建镜像时执行命令。每个 RUN 指令都会创建一个新的镜像层，所以建议将多个命令合并成一个 RUN 指令，以减少镜像层数和大小。',
    usage: '安装软件包、编译代码、创建目录和用户等构建时需要执行的操作都使用 RUN。',
    examples: [
      {
        code: 'RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*',
        explanation: '安装软件包并清理缓存，合并成一条命令减少镜像层'
      },
      {
        code: 'RUN npm ci --only=production',
        explanation: '安装 Node.js 生产环境依赖'
      },
      {
        code: 'RUN addgroup -g 1001 appgroup && \\\n    adduser -u 1001 -G appgroup -D appuser',
        explanation: '创建用户组和用户，使用反斜杠换行提高可读性'
      },
      {
        code: 'RUN mvn package -DskipTests',
        explanation: 'Maven 打包，跳过测试'
      }
    ],
    tips: [
      '合并多个 RUN 命令可以减少镜像层数和大小',
      '安装软件后记得清理缓存（apt-get clean、rm -rf /var/lib/apt/lists/*）',
      '使用 && 连接命令，如果前一个命令失败，后续命令不会执行',
      '使用反斜杠 \\ 换行，保持可读性'
    ],
    bestPractices: [
      '将变化频繁的 RUN 指令放在 Dockerfile 后面，利用缓存加速构建',
      '避免在 RUN 中安装不必要的软件包'
    ]
  },
  {
    name: 'EXPOSE',
    syntax: 'EXPOSE <端口号> [<端口号>/<协议>...]',
    description: 'EXPOSE 声明容器运行时监听的端口。注意：这只是一个声明，实际上并不会自动发布端口，你仍然需要在运行容器时使用 -p 参数来映射端口。',
    usage: 'EXPOSE 主要用于文档目的，告诉使用者这个镜像的应用会使用哪些端口。',
    examples: [
      {
        code: 'EXPOSE 8080',
        explanation: '声明应用使用 8080 端口（HTTP 服务常用端口）'
      },
      {
        code: 'EXPOSE 80 443',
        explanation: '声明应用使用 80 和 443 端口（HTTP 和 HTTPS）'
      },
      {
        code: 'EXPOSE 3000/tcp 3000/udp',
        explanation: '同时声明 TCP 和 UDP 协议'
      }
    ],
    tips: [
      'EXPOSE 不会自动发布端口，需要配合 docker run -p 使用',
      '使用 docker run -P（大写）可以自动将所有 EXPOSE 的端口映射到随机端口',
      '常用端口：HTTP(80)、HTTPS(443)、Spring Boot(8080)、Node.js(3000)'
    ]
  },
  {
    name: 'VOLUME',
    syntax: 'VOLUME ["/目录路径"]  或  VOLUME /目录路径',
    description: 'VOLUME 用于创建挂载点，将容器内的目录声明为可持久化的卷。这样即使容器被删除，卷中的数据也会保留。',
    usage: '当应用需要持久化数据（如数据库文件、日志、上传文件等）时使用 VOLUME。',
    examples: [
      {
        code: 'VOLUME /var/lib/mysql',
        explanation: 'MySQL 数据目录，确保数据库数据持久化'
      },
      {
        code: 'VOLUME ["/data", "/logs"]',
        explanation: '声明多个卷'
      }
    ],
    tips: [
      'VOLUME 声明的目录在容器运行时会自动创建匿名卷',
      '建议在运行时使用 -v 显式指定卷的映射，更容易管理',
      '卷中的数据不会包含在镜像中，每次运行都是独立的',
      'VOLUME 指令之后对该目录的修改不会生效'
    ]
  },
  {
    name: 'USER',
    syntax: 'USER <用户名>[:<用户组>]  或  USER <UID>[:<GID>]',
    description: 'USER 用于指定运行容器时的用户身份。出于安全考虑，强烈建议不要以 root 用户运行容器，而是创建一个专门的非特权用户。',
    usage: '在完成需要 root 权限的操作（如安装软件）后，使用 USER 切换到非 root 用户。',
    examples: [
      {
        code: 'RUN adduser -D appuser\nUSER appuser',
        explanation: '创建用户并切换到该用户'
      },
      {
        code: 'USER 1001:1001',
        explanation: '使用 UID 和 GID 指定用户，避免用户名不存在的问题'
      },
      {
        code: 'USER node',
        explanation: '使用 Node.js 官方镜像预置的 node 用户'
      }
    ],
    tips: [
      '非 root 用户运行可以降低安全风险',
      '确保应用文件的所有者与运行用户一致，否则可能出现权限问题',
      '使用数字 UID/GID 可以避免用户名在不同系统中不一致的问题',
      '在 USER 之前完成所有需要 root 权限的操作'
    ],
    bestPractices: [
      '推荐使用 1001 以上的 UID，避免与系统用户冲突'
    ]
  },
  {
    name: 'CMD',
    syntax: 'CMD ["可执行文件", "参数1", "参数2"]  或  CMD 命令 参数1 参数2',
    description: 'CMD 指定容器启动时默认执行的命令。与 RUN 不同，CMD 在构建时不会执行，只在容器启动时执行。CMD 可以被 docker run 的参数覆盖。',
    usage: '定义容器的默认启动命令，比如启动应用服务器。',
    examples: [
      {
        code: 'CMD ["java", "-jar", "app.jar"]',
        explanation: '启动 Java 应用（推荐使用 exec 格式，即数组格式）'
      },
      {
        code: 'CMD ["npm", "start"]',
        explanation: '启动 Node.js 应用'
      },
      {
        code: 'CMD ["nginx", "-g", "daemon off;"]',
        explanation: '以前台模式启动 Nginx'
      }
    ],
    tips: [
      '推荐使用 exec 格式（数组格式），可以正确接收系统信号',
      '一个 Dockerfile 只能有一个有效的 CMD，多个 CMD 只有最后一个生效',
      'CMD 可以被 docker run 后面的命令覆盖',
      'CMD 可以与 ENTRYPOINT 配合使用，作为默认参数'
    ]
  },
  {
    name: 'ENTRYPOINT',
    syntax: 'ENTRYPOINT ["可执行文件", "参数1"]  或  ENTRYPOINT 命令 参数1',
    description: 'ENTRYPOINT 设置容器启动时执行的主命令。与 CMD 不同，ENTRYPOINT 不容易被覆盖，docker run 后面的参数会作为 ENTRYPOINT 的参数传入。',
    usage: '当你希望容器像一个可执行程序一样运行时，使用 ENTRYPOINT。通常与 CMD 配合使用。',
    examples: [
      {
        code: 'ENTRYPOINT ["java", "-jar", "app.jar"]',
        explanation: '固定运行 Java 应用'
      },
      {
        code: 'ENTRYPOINT ["docker-entrypoint.sh"]\nCMD ["postgres"]',
        explanation: 'ENTRYPOINT 运行启动脚本，CMD 提供默认参数'
      },
      {
        code: 'ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]',
        explanation: '使用 shell 形式，可以使用环境变量'
      }
    ],
    tips: [
      'ENTRYPOINT + CMD 组合：ENTRYPOINT 定义命令，CMD 定义默认参数',
      '推荐使用 exec 格式，可以正确接收和传递系统信号',
      '如果需要在启动时执行初始化脚本，把脚本作为 ENTRYPOINT',
      '使用 docker run --entrypoint 可以覆盖 ENTRYPOINT'
    ]
  },
  {
    name: 'HEALTHCHECK',
    syntax: 'HEALTHCHECK [选项] CMD <命令>  或  HEALTHCHECK NONE',
    description: 'HEALTHCHECK 定义如何检查容器是否健康运行。Docker 会定期执行检查命令，根据返回值判断容器状态：0 表示健康，1 表示不健康。',
    usage: '为你的应用添加健康检查，让 Docker 和编排工具（如 Kubernetes）知道应用是否正常运行。',
    examples: [
      {
        code: 'HEALTHCHECK --interval=30s --timeout=3s --retries=3 \\\n  CMD curl -f http://localhost:8080/health || exit 1',
        explanation: '每 30 秒检查一次健康端点，超时 3 秒，失败 3 次判定为不健康'
      },
      {
        code: 'HEALTHCHECK --start-period=60s CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1',
        explanation: '给应用 60 秒启动时间，之后开始健康检查'
      },
      {
        code: 'HEALTHCHECK NONE',
        explanation: '禁用从基础镜像继承的健康检查'
      }
    ],
    tips: [
      '--interval：检查间隔，默认 30s',
      '--timeout：超时时间，默认 30s',
      '--start-period：启动等待时间，在此期间检查失败不计入重试次数',
      '--retries：连续失败多少次判定为不健康，默认 3',
      '健康检查命令应该快速返回，避免超时'
    ]
  },
  {
    name: 'LABEL',
    syntax: 'LABEL <键>=<值> [<键>=<值> ...]',
    description: 'LABEL 用于为镜像添加元数据，如作者信息、版本号、描述等。这些信息不会影响镜像的运行，但可以帮助管理和识别镜像。',
    usage: '添加镜像的维护者信息、版本号、描述等元数据。',
    examples: [
      {
        code: 'LABEL maintainer="dev@example.com"',
        explanation: '添加维护者邮箱'
      },
      {
        code: 'LABEL version="1.0" description="My App" vendor="My Company"',
        explanation: '添加多个标签'
      }
    ],
    tips: [
      '使用 docker inspect 可以查看镜像的 LABEL 信息',
      'LABEL 不会增加镜像层数，多个 LABEL 可以合并写',
      '推荐遵循 OCI 规范的标签命名'
    ]
  },
  {
    name: 'ONBUILD',
    syntax: 'ONBUILD <其他指令>',
    description: 'ONBUILD 定义触发器指令，这些指令不会在当前镜像构建时执行，而是在以此镜像为基础构建新镜像时执行。适合创建基础镜像。',
    usage: '创建可重用的基础镜像，让子镜像自动继承某些构建步骤。',
    examples: [
      {
        code: 'ONBUILD COPY . /app',
        explanation: '当其他 Dockerfile FROM 此镜像时，自动复制代码到 /app'
      },
      {
        code: 'ONBUILD RUN npm install',
        explanation: '子镜像构建时自动安装依赖'
      }
    ],
    tips: [
      'ONBUILD 指令会记录在镜像元数据中，子镜像构建时自动执行',
      '不能使用 ONBUILD ONBUILD 或 ONBUILD FROM',
      '适合创建语言/框架的基础镜像'
    ]
  }
]

export const composeCommands: CommandDetail[] = [
  {
    name: 'version',
    syntax: 'version: "3.8"',
    description: 'version 指定 docker-compose 文件的格式版本。不同版本支持的功能不同，建议使用 3.8 或更高版本，支持更多特性。',
    usage: '每个 docker-compose.yml 文件都应该在开头声明版本号。',
    examples: [
      {
        code: 'version: "3.8"',
        explanation: '推荐使用的版本，支持大多数现代特性'
      },
      {
        code: 'version: "3.9"',
        explanation: '较新版本，支持更多配置选项'
      }
    ],
    tips: [
      '版本 3.x 是目前最常用的版本',
      '新版 Docker Compose V2 中 version 字段可以省略',
      '版本号需要用引号包裹'
    ]
  },
  {
    name: 'services',
    syntax: 'services:\n  服务名:\n    配置项...',
    description: 'services 是 docker-compose 的核心部分，用于定义应用程序中的各个服务（容器）。每个服务可以是一个独立的容器，比如 Web 应用、数据库、缓存等。',
    usage: '在 services 下定义你的应用所需的所有容器服务。',
    examples: [
      {
        code: 'services:\n  web:\n    image: nginx\n  db:\n    image: mysql:8.0',
        explanation: '定义两个服务：web 使用 nginx 镜像，db 使用 mysql 镜像'
      }
    ],
    tips: [
      '服务名会作为容器间通信的主机名',
      '服务名建议使用小写字母和连字符',
      '每个服务可以有自己独立的配置'
    ]
  },
  {
    name: 'image',
    syntax: 'image: <镜像名>[:<标签>]',
    description: 'image 指定服务使用的 Docker 镜像。可以是 Docker Hub 上的公共镜像，也可以是私有仓库的镜像。',
    usage: '当你想直接使用现有镜像（而不是从 Dockerfile 构建）时使用 image。',
    examples: [
      {
        code: 'image: nginx:alpine',
        explanation: '使用 nginx 的 alpine 版本'
      },
      {
        code: 'image: mysql:8.0',
        explanation: '使用 MySQL 8.0 版本'
      },
      {
        code: 'image: registry.example.com/myapp:latest',
        explanation: '使用私有仓库的镜像'
      }
    ],
    tips: [
      '建议使用具体版本标签，避免使用 latest',
      '可以和 build 一起使用，build 的结果会使用 image 指定的名称',
      'Docker 会自动从 Docker Hub 或配置的仓库拉取镜像'
    ]
  },
  {
    name: 'build',
    syntax: 'build: <路径>  或  build:\n  context: <路径>\n  dockerfile: <文件名>',
    description: 'build 指定如何从 Dockerfile 构建镜像。可以简单指定 Dockerfile 所在目录，也可以详细配置构建选项。',
    usage: '当你的服务需要从源代码构建镜像（而不是使用现有镜像）时使用 build。',
    examples: [
      {
        code: 'build: .',
        explanation: '使用当前目录下的 Dockerfile 构建'
      },
      {
        code: 'build:\n  context: ./backend\n  dockerfile: Dockerfile.prod',
        explanation: '指定构建上下文和 Dockerfile 文件名'
      },
      {
        code: 'build:\n  context: .\n  args:\n    - VERSION=1.0.0',
        explanation: '传递构建参数'
      }
    ],
    tips: [
      'context 指定构建上下文目录，即 Dockerfile 可以访问的文件范围',
      '可以通过 args 传递构建参数给 Dockerfile 中的 ARG',
      '使用 docker-compose build 或 docker-compose up --build 触发构建'
    ]
  },
  {
    name: 'container_name',
    syntax: 'container_name: <容器名称>',
    description: 'container_name 指定容器的名称。如果不指定，Docker Compose 会自动生成名称（通常是 项目名_服务名_序号）。',
    usage: '当你需要固定的容器名称，便于管理或其他工具访问时使用。',
    examples: [
      {
        code: 'container_name: my-web-app',
        explanation: '指定容器名为 my-web-app'
      }
    ],
    tips: [
      '容器名必须唯一，不能与其他容器重名',
      '不指定时，Docker Compose 会自动生成名称',
      '使用固定容器名可能会影响服务的扩展（scale）功能'
    ]
  },
  {
    name: 'ports',
    syntax: 'ports:\n  - "<宿主机端口>:<容器端口>"',
    description: 'ports 定义端口映射，将容器内部的端口暴露到宿主机。格式是 "宿主机端口:容器端口"。',
    usage: '当你需要从宿主机或外部网络访问容器内的服务时使用。',
    examples: [
      {
        code: 'ports:\n  - "8080:80"',
        explanation: '将容器的 80 端口映射到宿主机的 8080 端口'
      },
      {
        code: 'ports:\n  - "3306:3306"\n  - "33060:33060"',
        explanation: '映射多个端口'
      },
      {
        code: 'ports:\n  - "127.0.0.1:8080:80"',
        explanation: '只在本地回环地址监听，更安全'
      }
    ],
    tips: [
      '格式：宿主机端口:容器端口，容易记混，记住"外:内"',
      '可以指定监听的 IP 地址，如 127.0.0.1:8080:80 只本地可访问',
      '端口号需要用引号包裹，避免被解析为数字',
      '如果只写一个端口，表示容器端口，宿主机端口随机分配'
    ]
  },
  {
    name: 'volumes',
    syntax: 'volumes:\n  - <宿主机路径>:<容器路径>[:<选项>]',
    description: 'volumes 用于挂载数据卷或绑定目录，实现数据持久化或在宿主机和容器间共享文件。',
    usage: '数据库数据持久化、挂载配置文件、开发时挂载源代码等场景都需要使用 volumes。',
    examples: [
      {
        code: 'volumes:\n  - mysql-data:/var/lib/mysql',
        explanation: '使用命名卷持久化 MySQL 数据'
      },
      {
        code: 'volumes:\n  - ./config:/app/config:ro',
        explanation: '以只读方式挂载配置目录'
      },
      {
        code: 'volumes:\n  - ./src:/app/src\n  - /app/node_modules',
        explanation: '挂载源代码，但保留容器内的 node_modules'
      }
    ],
    tips: [
      '命名卷（如 mysql-data）需要在顶级 volumes 中声明',
      ':ro 表示只读挂载，容器无法修改文件',
      '绑定挂载使用相对或绝对路径',
      '开发时常用挂载实现代码热更新'
    ]
  },
  {
    name: 'environment',
    syntax: 'environment:\n  - 变量名=值  或  environment:\n  变量名: 值',
    description: 'environment 设置容器的环境变量。这是配置应用程序最常用的方式，比如数据库连接信息、应用配置等。',
    usage: '需要向容器传递配置信息时使用 environment。',
    examples: [
      {
        code: 'environment:\n  - MYSQL_ROOT_PASSWORD=secret\n  - MYSQL_DATABASE=myapp',
        explanation: '使用列表格式设置 MySQL 环境变量'
      },
      {
        code: 'environment:\n  NODE_ENV: production\n  API_URL: http://api:8080',
        explanation: '使用字典格式设置环境变量'
      },
      {
        code: 'environment:\n  - DB_PASSWORD=${DB_PASSWORD}',
        explanation: '引用宿主机的环境变量'
      }
    ],
    tips: [
      '敏感信息建议使用 env_file 或外部密钥管理',
      '可以使用 ${变量名} 引用宿主机环境变量',
      '环境变量会覆盖镜像中 ENV 设置的默认值'
    ]
  },
  {
    name: 'env_file',
    syntax: 'env_file:\n  - <文件路径>',
    description: 'env_file 从文件加载环境变量。相比直接写在 docker-compose.yml 中，使用文件更安全，也便于管理不同环境的配置。',
    usage: '管理大量环境变量或包含敏感信息时，使用 env_file 更合适。',
    examples: [
      {
        code: 'env_file:\n  - .env',
        explanation: '从 .env 文件加载环境变量'
      },
      {
        code: 'env_file:\n  - .env\n  - .env.local',
        explanation: '从多个文件加载，后面的会覆盖前面的'
      }
    ],
    tips: [
      '.env 文件格式：每行一个 变量名=值',
      '将 .env 加入 .gitignore，避免敏感信息提交到代码仓库',
      'environment 中的变量会覆盖 env_file 中的同名变量'
    ]
  },
  {
    name: 'depends_on',
    syntax: 'depends_on:\n  - <服务名>  或  depends_on:\n  服务名:\n    condition: <条件>',
    description: 'depends_on 定义服务之间的依赖关系，确保依赖的服务先启动。但注意：这只保证启动顺序，不保证依赖服务已经"就绪"。',
    usage: '当一个服务依赖另一个服务时使用，比如应用服务依赖数据库。',
    examples: [
      {
        code: 'depends_on:\n  - db\n  - redis',
        explanation: '简单依赖，确保 db 和 redis 先启动'
      },
      {
        code: 'depends_on:\n  db:\n    condition: service_healthy',
        explanation: '等待 db 服务健康检查通过后再启动'
      }
    ],
    tips: [
      '默认只保证启动顺序，不等待服务就绪',
      '使用 condition: service_healthy 可以等待健康检查通过',
      '使用 condition: service_completed_successfully 等待服务成功完成（适用于初始化容器）',
      '对于需要等待数据库就绪的场景，建议在应用中实现重试逻辑'
    ]
  },
  {
    name: 'networks',
    syntax: 'networks:\n  - <网络名>',
    description: 'networks 指定服务连接的网络。同一网络中的服务可以通过服务名互相访问。Docker Compose 会自动创建默认网络。',
    usage: '需要隔离不同服务组或连接到外部网络时使用。',
    examples: [
      {
        code: 'networks:\n  - frontend\n  - backend',
        explanation: '服务同时连接到 frontend 和 backend 两个网络'
      },
      {
        code: '# 顶级配置\nnetworks:\n  app-network:\n    driver: bridge',
        explanation: '在顶级 networks 中定义网络'
      }
    ],
    tips: [
      'Docker Compose 自动创建名为 项目名_default 的网络',
      '同一网络中的服务可以通过服务名作为主机名互相访问',
      '不同网络间的服务默认无法通信，实现网络隔离'
    ]
  },
  {
    name: 'restart',
    syntax: 'restart: <策略>',
    description: 'restart 定义容器的重启策略。生产环境建议设置重启策略，确保服务在意外退出或服务器重启后自动恢复。',
    usage: '生产环境的服务通常需要设置自动重启策略。',
    examples: [
      {
        code: 'restart: "no"',
        explanation: '不自动重启（默认）'
      },
      {
        code: 'restart: always',
        explanation: '总是重启，包括 Docker 守护进程启动时'
      },
      {
        code: 'restart: on-failure',
        explanation: '只在非正常退出时重启'
      },
      {
        code: 'restart: unless-stopped',
        explanation: '除非手动停止，否则总是重启（推荐）'
      }
    ],
    tips: [
      'unless-stopped 是生产环境推荐的策略',
      'always 和 unless-stopped 的区别：always 在 Docker 重启后也会启动容器',
      '开发环境建议使用 no 或不设置'
    ]
  },
  {
    name: 'command',
    syntax: 'command: <命令>  或  command: ["可执行文件", "参数"]',
    description: 'command 覆盖镜像默认的启动命令（即 Dockerfile 中的 CMD）。',
    usage: '需要自定义容器启动命令时使用。',
    examples: [
      {
        code: 'command: npm run dev',
        explanation: '开发模式启动 Node.js 应用'
      },
      {
        code: 'command: ["python", "manage.py", "runserver", "0.0.0.0:8000"]',
        explanation: '使用数组格式指定命令和参数'
      }
    ],
    tips: [
      'command 会覆盖 Dockerfile 中的 CMD',
      '不会覆盖 ENTRYPOINT，而是作为 ENTRYPOINT 的参数',
      '推荐使用数组格式，避免 shell 解析问题'
    ]
  },
  {
    name: 'entrypoint',
    syntax: 'entrypoint: <命令>  或  entrypoint: ["可执行文件", "参数"]',
    description: 'entrypoint 覆盖镜像默认的入口点（即 Dockerfile 中的 ENTRYPOINT）。',
    usage: '需要完全自定义容器入口点时使用。',
    examples: [
      {
        code: 'entrypoint: /custom-entrypoint.sh',
        explanation: '使用自定义入口点脚本'
      },
      {
        code: 'entrypoint: ["php", "-S", "0.0.0.0:8000"]',
        explanation: '数组格式的入口点'
      }
    ],
    tips: [
      '会同时清空默认的 CMD',
      '可以配合 command 使用，command 作为参数传给 entrypoint'
    ]
  },
  {
    name: 'healthcheck',
    syntax: 'healthcheck:\n  test: <命令>\n  interval: <间隔>\n  timeout: <超时>\n  retries: <重试次数>',
    description: 'healthcheck 定义容器的健康检查。健康检查可以让 Docker 和依赖此服务的其他服务知道容器是否正常运行。',
    usage: '为服务添加健康检查，配合 depends_on condition 确保依赖服务就绪。',
    examples: [
      {
        code: 'healthcheck:\n  test: ["CMD", "curl", "-f", "http://localhost/"]\n  interval: 30s\n  timeout: 10s\n  retries: 3',
        explanation: '每 30 秒检查一次 HTTP 端点'
      },
      {
        code: 'healthcheck:\n  test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]\n  interval: 10s\n  timeout: 5s\n  retries: 5',
        explanation: 'MySQL 健康检查'
      },
      {
        code: 'healthcheck:\n  test: ["CMD", "redis-cli", "ping"]\n  interval: 10s',
        explanation: 'Redis 健康检查'
      }
    ],
    tips: [
      'test 命令返回 0 表示健康，非 0 表示不健康',
      '可以使用 start_period 设置启动等待时间',
      '健康检查结果可通过 docker inspect 查看'
    ]
  },
  {
    name: 'deploy',
    syntax: 'deploy:\n  replicas: <副本数>\n  resources:\n    limits:\n      cpus: <CPU限制>\n      memory: <内存限制>',
    description: 'deploy 定义部署和运行时配置，包括副本数量、资源限制等。注意：部分配置只在 Docker Swarm 模式下生效。',
    usage: '需要限制容器资源使用或配置部署策略时使用。',
    examples: [
      {
        code: 'deploy:\n  resources:\n    limits:\n      cpus: "0.5"\n      memory: 512M',
        explanation: '限制 CPU 使用率 50%，内存 512MB'
      },
      {
        code: 'deploy:\n  replicas: 3',
        explanation: '运行 3 个副本（Swarm 模式）'
      }
    ],
    tips: [
      'docker-compose up 默认不处理 deploy 配置',
      '使用 docker-compose --compatibility up 可以部分支持 deploy 配置',
      'resources.limits 可以限制容器资源使用'
    ]
  },
  {
    name: 'logging',
    syntax: 'logging:\n  driver: <驱动>\n  options:\n    <选项>: <值>',
    description: 'logging 配置容器的日志驱动和选项。可以限制日志文件大小，防止磁盘被日志撑满。',
    usage: '生产环境建议配置日志轮转，避免日志无限增长。',
    examples: [
      {
        code: 'logging:\n  driver: json-file\n  options:\n    max-size: "10m"\n    max-file: "3"',
        explanation: '限制每个日志文件最大 10MB，最多保留 3 个文件'
      },
      {
        code: 'logging:\n  driver: none',
        explanation: '禁用日志'
      }
    ],
    tips: [
      '默认驱动是 json-file，日志存储在宿主机',
      '生产环境务必设置 max-size 和 max-file',
      '可以使用 syslog、fluentd 等外部日志驱动'
    ]
  }
]
