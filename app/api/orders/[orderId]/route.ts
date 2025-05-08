import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { orderId: String }}) => {
  try {
    await connectToDB()

    const orderDetails = await Order.findById(params.orderId).populate({
      path: "products.product",
      model: Product
    })

    if (!orderDetails) {
      return new NextResponse(JSON.stringify({ message: "Order Not Found" }), { status: 404 })
    }

    const customer = await Customer.findOne({ clerkId: orderDetails.customerClerkId})

    return NextResponse.json({ orderDetails, customer }, { status: 200 })
  } catch (err) {
    console.log("[orderId_GET]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const PATCH = async (req: NextRequest, { params }: { params: { orderId: string } }) => {
  try {
    await connectToDB();
    const { status } = await req.json();

    const updatedOrder = await Order.findByIdAndUpdate(
      params.orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return new NextResponse(JSON.stringify({ message: "Order not found" }), { status: 404 });
    }

    return NextResponse.json({ message: "Order updated", updatedOrder });
  } catch (err) {
    console.error("[orderId_PATCH]", err);
    return new NextResponse(JSON.stringify({ message: "Failed to update order" }), {
      status: 500,
    });
  }
};


export const dynamic = "force-dynamic";
