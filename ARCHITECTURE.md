# XuaVaNay - Architecture Documentation

## Tổng quan

Dự án XuaVaNay được tổ chức theo kiến trúc modular với các feature modules riêng biệt, shared components và core services.

## Cấu trúc thư mục

```
src/
├── app/
│   ├── core/                    # Singleton services, guards, interceptors
│   │   ├── services/
│   │   │   ├── api.service.ts
│   │   │   ├── loading.service.ts
│   │   │   └── storage.service.ts
│   │   └── core.module.ts
│   ├── shared/                  # Shared components, pipes, directives
│   │   ├── components/
│   │   │   ├── loading-spinner/
│   │   │   ├── error-message/
│   │   │   └── custom-button/
│   │   ├── pipes/
│   │   │   └── date-format.pipe.ts
│   │   ├── models/
│   │   │   └── index.ts
│   │   └── shared.module.ts
│   ├── features/               # Feature modules
│   │   ├── ai-search/          # Tra cứu AI
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── ai-search.module.ts
│   │   │   └── ai-search-routing.module.ts
│   │   ├── history/            # Xưa và Nay
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── history.module.ts
│   │   │   └── history-routing.module.ts
│   │   ├── geography/          # Sử Địa (chưa implement)
│   │   ├── ebooks/             # E-Books (chưa implement)
│   │   └── account/            # Tài khoản (chưa implement)
│   ├── layout/                 # Layout components
│   │   ├── header/
│   │   ├── footer/
│   │   ├── navigation/
│   │   └── layout.module.ts
│   └── tabs/                   # Tab navigation
├── assets/
└── environments/
```

## Kiến trúc chi tiết

### 1. Core Module
Chứa các singleton services và utilities cốt lõi:

- **ApiService**: Xử lý HTTP requests
- **LoadingService**: Quản lý loading states
- **StorageService**: Quản lý local storage

### 2. Shared Module
Chứa các components và pipes có thể tái sử dụng:

- **LoadingSpinnerComponent**: Spinner loading
- **ErrorMessageComponent**: Hiển thị lỗi
- **CustomButtonComponent**: Button tùy chỉnh
- **DateFormatPipe**: Format ngày tháng

### 3. Feature Modules
Mỗi tab chính là một feature module riêng biệt:

#### AI Search Module
- **AiSearchPage**: Trang tìm kiếm AI
- **SearchResultsComponent**: Hiển thị kết quả
- **SearchFiltersComponent**: Bộ lọc tìm kiếm

#### History Module
- **HistoryPage**: Trang lịch sử
- **HistoryDetailComponent**: Chi tiết lịch sử
- **HistoryListComponent**: Danh sách lịch sử

### 4. Layout Module
Chứa các components layout:

- **HeaderComponent**: Header chung
- **FooterComponent**: Footer chung
- **NavigationComponent**: Navigation

## Lợi ích của kiến trúc này

✅ **Separation of Concerns**: Mỗi feature có module riêng
✅ **Reusability**: Shared components có thể dùng lại
✅ **Maintainability**: Dễ bảo trì và debug
✅ **Scalability**: Dễ thêm tính năng mới
✅ **Lazy Loading**: Tối ưu performance
✅ **Team Development**: Nhiều dev có thể làm việc song song

## Cách sử dụng

### Thêm feature module mới:
1. Tạo thư mục trong `src/app/features/`
2. Tạo module và routing module
3. Tạo components và pages
4. Cập nhật routing trong `tabs.routes.ts`

### Thêm shared component:
1. Tạo component trong `src/app/shared/components/`
2. Import vào `shared.module.ts`
3. Export để các module khác sử dụng

### Thêm core service:
1. Tạo service trong `src/app/core/services/`
2. Import vào `core.module.ts`
3. Inject vào component cần sử dụng

## Commands

```bash
# Build project
npm run build

# Start development server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

## Dependencies

- Angular 20
- Ionic 8
- RxJS 7.8
- TypeScript 5.8

## Environment Configuration

Cấu hình trong `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'XuaVaNay',
  version: '1.0.0'
};
```
