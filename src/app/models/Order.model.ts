export interface Order {
  Id: string;
  OrderNumber: string;
  ExternalOrderNumber: string;
  UserId: string;
  Status: number;
  PaymentStatus: number;
  PaymentMethod: number;
  SubTotal: number;
  DiscountAmount: number;
  TaxAmount: number;
  TotalAmount: number;
  PaidAmount: number;
  Notes: string;
  CreatedDate: string; // ISO date string
  OrderDetails: OrderDetail[];
}

export interface OrderDetail {
  Id: string;
  OrderId: string;
  SubscriptionPlanId: string;
  ProductName: string;
  ProductDescription: string;
  PlanType: number;
  DurationDays: number;
  Quantity: number;
  UnitPrice: number;
  DiscountAmount: number;
  TotalPrice: number;
  SubscriptionPlan: SubscriptionPlan;
}

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
