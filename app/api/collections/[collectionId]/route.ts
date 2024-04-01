import { connectToDb } from "@/lib/connectToDb";
import Collection from "@/lib/models/Collection";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

// This rest api fetches single collection taking as an input
export const GET = async (
  request: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    await connectToDb();

    // this query finds the collection taking its id
    const collection = await Collection.findById(params.collectionId);

    // response when the collection does not exist
    if (!collection) {
      return new NextResponse(
        JSON.stringify({ message: "Unable to find this collection" }),
        {
          status: 500,
        }
      );
    }

    // response if the collection exists
    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    console.log("collections_GET", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// This rest api updates the collection by taking its id
export const POST = async (
  request: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized Request", { status: 401 });
    }

    await connectToDb();

    // using let to update the collection later
    let collection = await Collection.findById(params.collectionId);

    // response when there is no collection update
    if (!collection) {
      return new NextResponse("Collection not found", { status: 404 });
    }

    // if found then destructuring to update it
    const { title, description, image } = await request.json();

    // response if there is no image or title
    if (!title || !image) {
      return new NextResponse("Image and title are required", {
        status: 500,
      });
    }

    // updated collection once above conditions are true
    collection = await Collection.findByIdAndUpdate(
      params.collectionId,
      { title, image, description },
      { new: true }
    );

    // now saving the updated collection
    await collection.save();

    // response once the updated collection is saved
    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    console.log("collections_POST", error);
    return new Response("Internal server error", { status: 500 });
  }
};

// This rest api deletes the collection from the database taking collectionId as param
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    // getting userId from auth a clerk method
    const { userId } = auth();

    // response if user not logged in
    if (!userId) {
      return new NextResponse("Unauthorized Request", { status: 500 });
    }

    // connecting to the database
    await connectToDb();

    // query that deletes the Collection taking its id
    await Collection.findByIdAndDelete(params.collectionId);

    // now returning the response
    return new NextResponse("Collection deleted", { status: 500 });
  } catch (error) {
    console.log("[collectionsId_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
