import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  await dbConnect();
  const messageId = params.messageid;

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        messsage: "User not authenticated",
      },
      { status: 401 }
    );
  }

  try {
    const filteredMessages = await UserModel.updateOne(
      { _id: user?._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (filteredMessages.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      );
    }

    Response.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in delete message route", error);
    return Response.json(
      {
        success: false,
        message: "Error while delete Message",
      },
      { status: 500 }
    );
  }
}
