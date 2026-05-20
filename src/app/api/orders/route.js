import { prisma } from "@/lib/prisma";
import { sendOrderNotificationEmail } from "@/lib/emailService";

export async function POST(req) {
    try {
        const body = await req.json();

        const {
            email,
            phone,
            fullName,
            address,
            city,
            items,
            subtotal,
            deliveryFee,
            total,
            paymentMethod,
            deliveryMode,
            deliveryDate,
            deliveryTime,
            notes,
        } = body;

        // Validate required fields
        if (!email || !phone || !fullName || !items || items.length === 0) {
            return Response.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Find existing buyer
        let buyer = await prisma.buyer.findUnique({
            where: { email },
        });

        // Create if missing
        if (!buyer) {
            buyer = await prisma.buyer.create({
                data: {
                    email,
                    phone,
                    fullName,
                    address: address || null,
                    city: city || null,
                },
            });
        }

        // Create order first
        const order = await prisma.order.create({
            data: {
                buyerId: buyer.id,

                subtotal: Number(subtotal),
                deliveryFee: Number(deliveryFee),
                total: Number(total),

                paymentMethod,
                status: "pending",

                deliveryMode,
                deliveryDate: deliveryDate
                    ? new Date(deliveryDate)
                    : null,

                deliveryTime: deliveryTime || null,
                notes: notes || null,
            },
        });

        // Create items separately
        if (items.length > 0) {
            await prisma.orderItem.createMany({
                data: items.map((item) => ({
                    orderId: order.id,
                    name: item.name,
                    price: Number(item.price),
                    quantity: Number(item.quantity),
                })),
            });
        }

        // Fetch complete order
        const fullOrder = await prisma.order.findUnique({
            where: {
                id: order.id,
            },
            include: {
                buyer: true,
                items: true,
            },
        });

        // Send order notification email to seller (fire-and-forget)
        sendOrderNotificationEmail(fullOrder).catch((error) => {
            console.error("Email notification failed:", error);
            // Don't block order creation if email fails
        });

        return Response.json(
            {
                success: true,
                message: "Order created successfully",
                orderId: order.id,
                order: fullOrder,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Order creation error:", error);
        return Response.json(
            { error: "Failed to create order", details: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const buyerId = searchParams.get("buyerId");

        if (buyerId) {
            // Get orders for a specific buyer
            const orders = await prisma.order.findMany({
                where: { buyerId },
                include: {
                    items: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return Response.json({
                success: true,
                orders,
            });
        }

        // Get all orders (paginated)
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const orders = await prisma.order.findMany({
            skip,
            take: limit,
            include: {
                buyer: true,
                items: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const total = await prisma.order.count();

        return Response.json({
            success: true,
            orders,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get orders error:", error);
        return Response.json(
            { error: "Failed to fetch orders", details: error.message },
            { status: 500 }
        );
    }
}
