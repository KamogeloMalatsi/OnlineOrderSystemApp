export interface CartItem {
    cartItemId?: string; 
    productId: string;
    clientId: string;
    quantity: number;
    unitPrice: number;
    productName?: string; 
    productDescription?: string;
  }
  