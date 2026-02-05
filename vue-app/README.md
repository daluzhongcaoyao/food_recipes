# 食谱管理系统

基于 Vue3 + Koa 的食谱管理应用，支持标签筛选、图片浏览和管理功能。

## 本地开发

### 安装依赖
```bash
cd vue-app
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 `http://localhost:5173`

---

## 生产部署（方式一：本地构建后部署）

### 1. 本地构建前端

在本地机器上执行：

```bash
cd vue-app
npm run build
```

构建完成后会生成 `vue-app/dist/` 目录。

### 2. 打包项目

在项目根目录执行，排除 `node_modules`：

```bash
tar --exclude='node_modules' --exclude='vue-app/node_modules' -czf food.tar.gz backend/ vue-app/dist/ Dockerfile docker-compose.yml
```

### 3. 上传到服务器

```bash
scp food.tar.gz user@your-server:/path/to/deploy/
```

### 4. 服务器上部署

SSH 登录服务器后执行：

```bash
# 解压
tar -xzf food.tar.gz

# 使用 docker-compose 构建并启动
docker compose up -d --build

# 查看运行状态
docker compose ps
```

### 5. 访问应用

默认端口为 `8092`，访问：

```
http://your-server-ip:8092
```

---

## 目录结构

```
food/
├── backend/              # 后端代码
│   ├── server.js        # Koa 服务入口
│   ├── package.json     # 后端依赖
│   ├── data/            # 数据文件（服务器自动创建）
│   └── public/          # 静态资源
│       └── uploads/     # 上传的图片
├── vue-app/             # 前端代码
│   ├── src/             # 源代码
│   └── dist/            # 构建产物
├── Dockerfile           # Docker 镜像配置
└── docker-compose.yml   # 容器编排配置
```

---

## 常用命令

### 查看日志
```bash
docker compose logs -f
```

### 重启服务
```bash
docker compose restart
```

### 停止服务
```bash
docker compose down
```

### 备份数据
```bash
# 备份数据文件和上传的图片
tar -czf backup.tar.gz backend/data/ backend/public/uploads/
```
