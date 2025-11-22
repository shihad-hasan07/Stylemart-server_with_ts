
export interface IProduct {
    name: string;
    slug: string;
    brand: string;
    description: string;
    price: number;

    sale?: {
        active: boolean;
        price?: number;
        ends?: string;
    };

    images: string[];
    categories: string[];
    tags: string[];

    rating: {
        average: number;
        count: number;
    };

    stock: {
        inStock: boolean;
        quantity: number;
    };

    variations: {
        attribute: string;
        options: string[];
    }[];

    cartCount: number;
    wishlistCount: number;
}
