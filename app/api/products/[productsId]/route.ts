import { connectToDb } from "@/lib/connectToDb";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { auth } from "@clerk/nextjs";
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

// this rest api updates the product with POST method taking its id as an input
export const POST = async (
  request: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    // checking if user exist
    const { userId } = auth();

    // response if there is no user
    if (!userId) {
      return new Response("Unauthorized request", { status: 401 });
    }

    // connecting to the db now
    await connectToDb();

    // query to find product
    const product = await Product.findById(params.productId);

    // response if there is no product
    if (!product) {
      return NextResponse.json(
        { message: "Product Not Found" },
        { status: 404 }
      );
    }

    // destructuring essential data from request body to update product
    const {
      title,
      description,
      media,
      category,
      collections,
      tags,
      sizes,
      colors,
      price,
      expense,
    } = await request.json();

    // response if below data does not exist in the request body
    if (!title || !description || !media || !category || !price || !expense) {
      return new NextResponse("Not enough data to create a new product", {
        status: 400,
      });
    }

    // included in new data, but not included in the previous data
    const addedCollections = collections.filter(
      (collectionId: string) => !product.collections.includes(collectionId)
    );

    // included in previous data, but not included in the new data
    const removedCollections = product.collections.filter(
      (collectionId: string) => !collections.includes(collectionId)
    );

    // Update collections
    await Promise.all([
      // Update added collections with this product
      ...addedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $push: { products: product._id },
        })
      ),

      // Update removed collections without this product
      ...removedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id },
        })
      ),
    ]);

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        title,
        description,
        media,
        category,
        collections,
        tags,
        sizes,
        colors,
        price,
        expense,
      },
      { new: true }
    ).populate({ path: "collections", model: Collection });

    await updatedProduct.save();

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.log("[productsId_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// this rest api DELETES the product from the db
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    // checking user
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
   
    await connectToDb();
     
    // query to find product
    const product = await Product.findById(params.productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }
    
    // query to delete product with id
    await Product.findByIdAndDelete(product._id);

    // Update collections when a product is deleted
    await Promise.all(
      product.collections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id },
        })
      )
    );
     
    // response when product is deleted
    return new NextResponse(JSON.stringify({ message: "Product deleted" }), {
      status: 200,
    });
  } catch (err) {
    console.log("[productId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
