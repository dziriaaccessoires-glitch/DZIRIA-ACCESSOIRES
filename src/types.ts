export type Language = 'ar' | 'fr';

export interface LocalizedString {
  ar: string;
  fr: string;
}

export interface ProductColor {
  hex: string;
  name: LocalizedString;
  available?: boolean;
}

export interface Product {
  id: number;
  name: LocalizedString;
  price: number;
  originalPrice?: number; // Old price before discount for promos
  category: LocalizedString;
  categoryKey: 'bracelets' | 'necklaces' | 'watches' | 'sets' | 'rings' | 'promotions';
  accentColor: string;
  images: string[];
  colors?: ProductColor[];
  sizes?: string[];
  available: boolean;
  isPromo?: boolean;
  badge?: LocalizedString;
  description?: LocalizedString;
  rating?: number;
  soldCount?: number;
}

export interface Commune {
  ar: string;
  fr: string;
}

export interface Wilaya {
  key: string;
  code: number;
  ar: string;
  fr: string;
  home: number;
  office: number;
  communes: Commune[];
}

export interface CartItem extends Product {
  cartKey: string;
  qty: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface OrderFormData {
  name: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  notes: string;
  deliveryType: 'home' | 'office';
}
