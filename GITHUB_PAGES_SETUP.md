# GitHub Pages Deployment Setup

Dự án này đã được cấu hình để tự động triển khai lên GitHub Pages khi có commit mới vào branch `autobuild`.

## Cách thiết lập GitHub Pages

### 1. Cấu hình Repository Settings

1. Vào **Settings** của repository trên GitHub
2. Scroll xuống phần **Pages** ở sidebar trái
3. Trong phần **Source**, chọn **GitHub Actions** thay vì **Deploy from a branch**

### 2. Workflow deployment

Workflow GitHub Actions sẽ tự động chạy khi push vào branch `autobuild`:
- Build ứng dụng Angular/Ionic với production configuration
- Set base-href đúng cho GitHub Pages (`/XuaVaNay/`)
- Deploy lên GitHub Pages

**Quy trình làm việc khuyến nghị:**
1. Develop và commit code vào branch `main`
2. Test và kiểm tra kỹ lưỡng 
3. Khi sẵn sàng deploy, merge code từ `main` sang `autobuild`:
   ```bash
   git checkout autobuild
   git merge main
   git push origin autobuild
   ```

### 3. URL của ứng dụng

Sau khi deploy thành công, ứng dụng sẽ có thể truy cập tại:
```
https://angelechip90.github.io/XuaVaNay/
```

### 4. Scripts có sẵn

Trong `package.json` đã có các scripts sau:

```json
{
  "build:prod": "ng build --configuration production",
  "build:gh-pages": "ng build --configuration production --base-href \"/XuaVaNay/\""
}
```

### 5. Tính năng đã được cấu hình

- ✅ **Base href** được set tự động cho GitHub Pages
- ✅ **404.html** để xử lý routing cho SPA
- ✅ **.nojekyll** để tránh Jekyll processing
- ✅ **GitHub Actions workflow** cho auto deployment
- ✅ **Script xử lý routing** trong index.html để hỗ trợ deep linking

### 6. Build local để test

Để test build production trước khi push:

```bash
npm run build:gh-pages
```

Sau đó có thể serve folder `www` bằng một static server để kiểm tra:

```bash
# Cài đặt http-server nếu chưa có
npm install -g http-server

# Serve folder www
http-server www -p 8080
```

### 7. Troubleshooting

Nếu có vấn đề với deployment:

1. Kiểm tra tab **Actions** trên GitHub để xem logs
2. Đảm bảo đã enable GitHub Pages trong Settings
3. Kiểm tra branch `autobuild` có workflow file `.github/workflows/deploy-github-pages.yml`

### 8. Quản lý Branch Autobuild

#### Tạo branch autobuild lần đầu:
```bash
# Tạo branch autobuild từ main
git checkout main
git checkout -b autobuild
git push -u origin autobuild
```

#### Quy trình deploy thông thường:
```bash
# 1. Làm việc trên branch main
git checkout main
# ... develop code ...
git add .
git commit -m "Your changes"
git push origin main

# 2. Khi sẵn sàng deploy
git checkout autobuild
git merge main
git push origin autobuild  # Trigger deployment
```

#### Rollback nếu cần:
```bash
# Rollback autobuild về commit trước đó
git checkout autobuild
git reset --hard HEAD~1
git push --force origin autobuild
```

### 9. Customization

Để thay đổi base URL hoặc tên repository:

1. Cập nhật `homepage` trong `package.json`
2. Cập nhật `--base-href` trong workflow file
3. Cập nhật `pathSegmentsToKeep` trong `404.html` nếu cần