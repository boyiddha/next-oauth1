import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import User from "@/models/user";
import { connect } from "@/lib/mongodb";

export async function POST(request) {
  const { name, email, password, confirmPassword } = await request.json();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json(
      {
        message: "All fields are required",
      },
      { status: 400 }
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { message: "Invalid email format" },
      { status: 400 }
    );
  }
  if (confirmPassword !== password) {
    return NextResponse.json(
      { message: "Password do'nt match" },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { message: "Password must be at least 6 character" },
      { status: 400 }
    );
  }

  try {
    await connect();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already Exist" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = User({
      email,
      name,
      password: hashedPassword,
    });

    await newUser.save();
    return NextResponse.json({ message: "User Create" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
