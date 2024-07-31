export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  productName?: string; 
  productDescription?: string;
}

  
  export interface OrderViewModel {
    clientId: string;
    totalAmount: number;
    orderItems: OrderItem[];
  }
  
  export interface OrderDto {
    orderId: string;
    clientId: string;
    orderDate: string;
    totalAmount: number;
    statusId: number;
    statusName: string;
    createdDate: string;
    updatedDate: string;
    orderItems: OrderItem[];
  }


export interface OrderStatusUpdateDto {
  statusUpdateId: string; 
  orderId: string;      
  statusId: number;     
  statusName: string;   
  updateDate: Date;     
}


  