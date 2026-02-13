
export interface User {
  ign: string;
  email: string;
  isLoggedIn: boolean;
}

export interface PaymentData {
  username: string;
  ign?: string;
  password?: string;
  amount: number;
  trx: string;
  productNo: string;
  email?: string;
  senderNumber?: string;
}

export type BuildType = 'Home' | 'Farm' | 'Build';

export interface SellData {
  landX: string;
  landY: string;
  price: number;
  buildType: BuildType;
  imageUrl?: string;
  sellerBkash: string;
}

export interface LandListing extends SellData {
  id: string;
  code: string;
  timestamp: string;
}

export interface PaymentStatus {
  loading: boolean;
  success: boolean;
  error: string | null;
}

export enum View {
  MARKET = 'market',
  BUY = 'buy',
  SELL = 'sell',
  MINECRAFT = 'minecraft'
}

export enum PaymentMethod {
  BKASH = 'bKash',
  NAGAD = 'Nagad',
  UPAY = 'Upay'
}
