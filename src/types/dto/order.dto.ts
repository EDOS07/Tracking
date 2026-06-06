// src/types/dto/order.dto.ts

export interface OrderResponseDto<T> {
  status: number;
  result: T;
}

// Interfaz para la respuesta de upcoming (Lista)
export interface OrderSummaryDto {
  _id: string;
  order_number: string;
  type: string;
  status_string: string;
  start_date: number;
  end_date: number;
  destinations: {
    nickname: string;
    address: string;
    start_date: number;
    end_date: number;
  }[];
}

// Interfaz para la respuesta de orders (Detalle)
export interface OrderDetailDto {
  _id: string;
  order_number: string;
  reference_number: string;
  start_date: number;
  end_date: number;
  cargo?: {
    description: string;
    weigth: number[];
    weight_unit: string;
  };
  manager?: {
    nickname: string;
    email: string;
    telephone: string;
  };
  driver?: {
    nickname: string;
    thumbnail: string;
  };
  pricing?: {
    total: number;
  };
  status_list?: {
    pickup: { status: string; active: boolean }[];
    dropoff: { status: string; active: boolean }[];
  };
  destinations?: {
    address: string;
    // 🚀 Tipamos las fechas internas también
    startDate?: number; 
    endDate?: number;
  }[];
}