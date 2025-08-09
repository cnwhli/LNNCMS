# LNNCMS
自己的网站
部署步骤（GitHub → Cloudflare Pages）
新建 GitHub 仓库

名称示例：lnn-site

把上面的文件放入仓库并推送

Cloudflare Pages 创建项目

选择“从 Git 连接”，选中你的 lnn-site 仓库

构建设置：

Framework preset：None

Build command：空（或 npm run build，如果你后续加打包）

Build output：根目录（/）

首次部署完成后，会得到一个 *.pages.dev 域名（可绑定自定义域）

绑定 KV 与环境变量（关键）

打开该 Pages 项目 → Settings → Functions

KV bindings：添加一个命名空间，变量名填 CONTENT（需在账号 KV 中先创建命名空间）

Environment variables：新增 ADMIN_TOKEN（填入一串强密码，长度 > 32）

确认 Functions 已启用（functions 目录存在会自动启用）

访问后台

打开 https://你的域名/admin/

选择语言，粘贴 ADMIN_TOKEN，点击“加载”（首次没内容会加载默认），编辑后点“保存”

打开首页查看实时生效（无需重新部署）

自定义域名与 HTTPS

Pages 项目 → Custom domains 里绑定你的域名

自动签发 SSL，等待生效即可
