export interface SubscriptionPlan {
  SubscriptionPlanId: string;
  PlanType: number;
  Name: string;
  Price: number;
  DurationDays: number;
  ChatQuota: number;
  SortOrder: number;
  ChatQuotaPeriod: number;
  IsActive: boolean;
  Description: string;
  Items: SubscriptionItem[];
}

export interface SubscriptionItem {
  Description: string;
}

export interface UserSubscription {
  UserSubscriptionId: string;
  SubscriptionPlanId: string;
  SubscriptionPlan: SubscriptionPlan;
  StartDate: string; // ISO date string
  EndDate: string; // ISO date string
  UsedChatQuota: number;
  IsActive: boolean;
  RemainingChatQuota: number;
  TotalQuota: number;
}
