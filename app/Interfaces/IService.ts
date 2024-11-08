export interface Service {
  service: {
    id: number;
    name: string;
    logo: string;
    short_desc: string;
    desc: string;
    long: string;
    lat: string;
    open_at: string;
    close_at: string;
    discount: number;
    category_id: number;
    city_id: number;
  } | null;
}
