import UserModel from "@/app/model/User";
import dbConnect from "@/app/lib/dbConnect";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found!",
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isExpiryValid = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isExpiryValid) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Account Verified Successfully!",
        },
        { status: 200 }
      );
    } else if (!isExpiryValid) {
      return Response.json(
        {
          success: false,
          message:
            "Your verficaton code has been expired. Please sign-up again to get the new verification code",
        },
        { status: 400 }
      );
    } else {
    }
    return Response.json(
      {
        success: false,
        message: "Incorrect verification code",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error verify-user code:", error);
    return Response.json(
      {
        success: false,
        message: "Error verify-user code:",
      },
      { status: 500 }
    );
  }
}
