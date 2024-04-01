import { connectToDb } from "@/lib/connectToDb";
import Collection from "@/lib/models/Collection";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

// This rest api creates the collection in the db & being used in collections/new page
export const POST = async (req: NextRequest) => {
  try {
    // destructuring userId from clerk auth method
    const { userId } = auth();

    // response if there is no userId
    if (!userId) {
      return new NextResponse("Unauthorized request", { status: 403 });
    }

    // in case of userId create a connection database
    await connectToDb();

    // destructuring required data from json request to POST collection
    const { title, description, image } = await req.json();

    // searching if it exist already
    const existingCollection = await Collection.findOne({ title });

    // response when collection already exists
    if (existingCollection) {
      return new NextResponse("Collection already exits", { status: 400 });
    }

    // if the JSON has no image and title which are required
    if (!title || !image) {
      return new NextResponse("Image and title are required", { status: 400 });
    }

    // now posting new collection into collections DB after all above checks
    const newCollection = await Collection.create({
      userId,
      title,
      image,
      description,
    });

    // now saving it in the db
    await newCollection.save();

    // returning the created collection as a JSON response
    return NextResponse.json(newCollection, {
      status: 200,
    });
  } catch (error) {
    console.log("[collections_POST]", error);
    return new NextResponse("Internal server  error", { status: 500 });
  }
};

// This rest api fetches all collections from the db to display in colleCtions page
export const GET = async (req: NextRequest) => {
  try {
    await connectToDb();

    // this query finds all collections and sorts in date order
    const collections = await Collection.find().sort({ createdAt: "desc" });

    // returning the response
    return NextResponse.json(collections, { status: 200 });
  } catch (error) {
    console.log("[collections_GET]", error);
    // response if there is an error
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

