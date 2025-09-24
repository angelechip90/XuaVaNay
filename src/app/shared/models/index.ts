export interface BaseEntity {
    id: string | number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: string[];
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface SearchParams {
    query?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface User extends BaseEntity {
    email: string;
    name: string;
    avatar?: string;
    role: 'user' | 'admin';
    isActive: boolean;
}

export interface Book extends BaseEntity {
    title: string;
    author: string;
    description: string;
    coverImage?: string;
    fileUrl: string;
    category: string;
    tags: string[];
    isPublished: boolean;
}

export interface HistoryItem extends BaseEntity {
    title: string;
    content: string;
    period: string;
    location?: string;
    images?: string[];
    tags: string[];
    category: 'ancient' | 'modern' | 'contemporary';
}

export interface GeographyItem extends BaseEntity {
    name: string;
    type: 'country' | 'province' | 'city' | 'landmark';
    description: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    images?: string[];
    relatedHistory?: string[];
}
