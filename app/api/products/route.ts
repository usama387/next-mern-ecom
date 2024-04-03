import { connectToDb } from "@/lib/connectToDb";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

// this rest api posts/creates a product in the db
export const POST = async (request: NextRequest) => {
  try {
    // checking if user is logged in by destructuring id
    const { userId } = auth();

    //response if user is not logged in
    if (!userId) {
      return new NextResponse("Unauthorized Request", { status: 401 });
    }

    // to create product first connect to the db
    await connectToDb();

    // destructuring essential details to POST product from request body
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

    // response if this condition is not met
    if (!title || !description || !media || !category || !price || !expense) {
      return new NextResponse("Bad request provide required details", {
        status: 400,
      });
    }

    //now creating new product
    const newProduct = await Product.create({
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
    });

    // saving it in the db
    await newProduct.save();

    // returning response once user is saved
    return NextResponse.json(newProduct, { status: 200 });
  } catch (error) {
    console.log("products_POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// This rest api fetches all  products from the database and returns them as a JSON
export const GET = async () => {
  try {
    await connectToDb();
    const products = await Product.find()
      .sort({ createdAt: "desc" })
      .populate({ path: "collections", model: Collection });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log("[products_GET]", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
