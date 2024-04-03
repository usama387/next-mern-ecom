type collectionType = {
  _id: string;
  title: string;
  description: string;
  image: string;
  products: productType[];
};

type productType = {
  _id: string;
  title: string;
  description: string;
  media: [string];
  category: string;
  collections: [collectionType];
  tags: [string];
  sizes: [string];
  colors: [string];
  price: number;
  expense: number;
  createdAt: Date;
  updatedAt: Date;
};
