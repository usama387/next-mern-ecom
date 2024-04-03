import mongoose from "mongoose";

// Define the schema for products
const ProductSchema = new mongoose.Schema(
  {
    // Title of the product
    title: String,
    // Description of the product
    description: String,
    // Media files associated with the product
    media: [String],
    // Category of the product
    category: String,
    // Collections the product belongs to
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collections" }],
    // Tags associated with the product
    tags: [String],
    // Price of the product
    price: {
      type: mongoose.Schema.Types.Decimal128,
      // Custom getter to convert Decimal128 to float
      get: (v: mongoose.Schema.Types.Decimal128) => {
        return parseFloat(v.toString());
      },
    },
    // Expense of the product
    expense: {
      type: mongoose.Schema.Types.Decimal128,
      // Custom getter to convert Decimal128 to float
      get: (v: mongoose.Schema.Types.Decimal128) => {
        return parseFloat(v.toString());
      },
    },
    // Available sizes of the product
    sizes: [String],
    // Available colors of the product
    colors: [String],
    // Date when the product was created
    createdAt: { type: Date, default: Date.now },
    // Date when the product was last updated
    updatedAt: { type: Date, default: Date.now },
  },
  // Ensure that getters are applied when converting to JSON
  { toJSON: { getters: true } }
);

// Create or retrieve the 'Product' model from Mongoose
const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
