export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    address: Address[];
    ip: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    stock: number;
    images: string[];
    ratings: {
        average: number;
        count: number;
    };
    reviews: {
        userId: string;
        rating: number;
        comment: string;
        createdAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Order {
    _id: string;
    user: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: Address;
    paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'cash_on_delivery';
    paymentStatus: 'pending' | 'paid' | 'failed';
    orderDate: Date;
    trackingUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItem {
    product: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}