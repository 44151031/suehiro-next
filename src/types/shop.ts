export type Shop = {
  name: string;
  address: string;
  shopid?: string;
};

export type ShopDetail = {
  shopid: string;
  name: string;
  address: string;
  description: string;
  paytypes: string[];
  note?: string;
  homepage?: string;
  instagram?: string;
  x?: string;
  line?: string;
};