export interface IAddress {
  id: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood?: string | null;
  city: string;
  state: string;
  zip_code: string;
  created_at?: string;
  updated_at?: string;
}

export interface IAddressCreateDTO {
  street: string;
  number: string;
  complement?: string | null;
  neighborhood?: string | null;
  city: string;
  state: string;
  zip_code: string;
}

export type IAddressUpdateDTO = Partial<IAddressCreateDTO>