import { connectToDb } from "@/lib/connectToDb";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { NextRequest, NextResponse } from "next/server";

// This rest api fetches single product taking as an input
export const GET = async (
  request: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    await connectToDb();

    // this query finds the collection taking its id
    const product = await Product.findById(params.productId).populate({
      path: "collections",
      model: Collection,
    });

    // response when the product does not exist
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Unable to find this product" }),
        {
          status: 500,
        }
      );
    }

    // response if the product exists
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log("products_GET", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
