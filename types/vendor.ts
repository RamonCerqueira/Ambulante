// types/vendor.ts

export interface Vendor {
  id: string;
  businessName: string;
  description: string;
  rating: number;
  latitude: number;
  longitude: number;
  distance: number;
  user: {
    name: string;
    avatar?: string;
    phone?: string;
    businessName?: string;
  };
  products: Array<{
    id: string;
    name: string;
    price: number;
    image?: string;
  }>;
  _count: {
    reviews: number;
  };
}
