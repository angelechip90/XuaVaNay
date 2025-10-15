export interface User {
  User: IUserLoginResponse;
  Token: UserToken;
}

export interface UserToken {
  AccessToken: string;
  RefreshToken: string;
  ExpiresIn: number;
  TokenType: string;
}

export interface UserInfo {
  UserId: string;
  Email: string;
  PhoneNumber: string;
  UserName: string;
  FullName: string;
  Address: string;
  CreatedDate: string; // hoặc Date nếu bạn parse về dạng Date
  IsDeleted: boolean;
  EmailConfirmed: boolean;
  IsBlock: boolean;
  Avatar: string;
  ActiveSubscription: UserSubscription | null;
}

export interface UserSubscription {
  UserSubscriptionId: string;
  SubscriptionPlanId: string;
  SubscriptionPlan: SubscriptionPlan;
  StartDate: string;
  EndDate: string;
  UsedChatQuota: number;
  IsActive: boolean;
  RemainingChatQuota: number;
  TotalQuota: number;
}

export interface SubscriptionPlan {
  SubscriptionPlanId: string;
  PlanType: number;
  PlanTypeAsString: string;
  Name: string;
  Price: number;
  DurationDays: number;
  ChatQuota: number;
  SortOrder: number;
  ChatQuotaPeriod: number;
  IsActive: boolean;
  Description: string;
  Items: SubscriptionPlanItem[];
}

export interface SubscriptionPlanItem {
  Description: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface IUserLoginResponse {
  Id: string;
  UserName: string;
  Email: string;
  FullName?: string;
  IsVerified?: boolean;
}
