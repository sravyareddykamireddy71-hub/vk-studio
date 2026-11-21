export interface CustomizationFieldConfig {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'select' | 'color' | 'radio' | 'textarea' | 'file';
  placeholder?: string;
  options?: Array<{
    label: string;
    value: string;
    priceModifier?: number;
    colorHex?: string;
  }>;
  priceModifier?: number;
  isRequired?: boolean;
  helpText?: string;
}

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  description: string;
  basePrice: number;
  images: string; // JSON string of string[]
  model3dType?: string | null;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  isAvailable: boolean;
  isFeatured: boolean;
  leadTimeDays: number;
  materials: string; // JSON string of string[]
  colors: string; // JSON string of Array<{name: string, hex: string}>
  dimensions?: string | null;
  weight?: string | null;
  customizationFields: string; // JSON string of CustomizationFieldConfig[]
  createdAt: Date | string;
  updatedAt: Date | string;
  reviews?: ReviewType[];
  averageRating?: number;
  totalReviews?: number;
}

export interface ReviewType {
  id: string;
  productId: string;
  product?: {
    id: string;
    name: string;
    slug?: string;
  };
  userId?: string | null;
  authorName: string;
  rating: number;
  reviewText: string;
  imageUrl?: string | null;
  isPublished: boolean;
  isVerifiedPurchase: boolean;
  createdAt: Date | string;
}

export interface CartItemType {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    images: string;
    leadTimeDays: number;
  };
  quantity: number;
  customizationData: Record<string, any>;
  unitPrice: number;
  customizationPrice: number;
  totalPrice: number;
  guestSessionId?: string | null;
}

export interface CustomizationRequestType {
  id: string;
  referenceNumber: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  productId?: string | null;
  productTitle: string;
  customizationDetails: Record<string, any>;
  customerInstructions?: string | null;
  referenceFileUrl?: string | null;
  quantity: number;
  estimatedPrice?: number | null;
  finalQuote?: number | null;
  status: 'NEW_REQUEST' | 'UNDER_REVIEW' | 'AWAITING_CUSTOMER' | 'QUOTE_SENT' | 'APPROVED' | 'REJECTED' | 'CONVERTED_TO_ORDER';
  adminNotes?: string | null;
  adminResponse?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: {
    name: string;
    email: string;
  } | null;
}

export interface OrderType {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  state: string;
  customizationRequestId?: string | null;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  productionStatus: 'ORDER_RECEIVED' | 'CONFIRMED' | 'IN_PRODUCTION' | 'QUALITY_CHECK' | 'READY_FOR_DISPATCH' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  trackingNumber?: string | null;
  courier?: string | null;
  customerNotes?: string | null;
  adminNotes?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  items: Array<{
    id: string;
    productName: string;
    productImage?: string | null;
    unitPrice: number;
    customizationPrice: number;
    quantity: number;
    totalPrice: number;
    customizationDetails: Record<string, any>;
  }>;
}

export interface StudioSettings {
  brandName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroBadge: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutPillars: Array<{ title: string; desc: string; icon: string }>;
  whatsappNumber: string;
  instagramUrl: string;
  contactEmail: string;
  contactPhone: string;
  studioAddress: string;
  workingHours: string;
  announcementText: string;
  showAnnouncement: boolean;
}
