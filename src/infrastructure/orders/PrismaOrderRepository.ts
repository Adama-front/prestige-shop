import type { CreateOrderInput } from "@/application/orders/createOrderSchema";
import { calculateShippingCost } from "@/domain/cart/shippingPolicy";
import { prisma } from "@/infrastructure/database/prisma";

export class StockUnavailableError extends Error {}
export class ProductUnavailableError extends Error {}
export class OrderAmountTooLargeError extends Error {}

export const orderInclude = {
  items: {
    select: {
      productId: true,
      productTitle: true,
      imageUrl: true,
      unitPriceXof: true,
      quantity: true,
      lineTotalXof: true
    }
  }
} as const;

export const toOrderDto = (order: {
  id: string;
  status: string;
  firstName: string;
  lastName: string;
  phone: string;
  secondaryPhone: string | null;
  city: string;
  district: string;
  address: string;
  additionalInfo: string | null;
  subtotalXof: number;
  shippingCostXof: number;
  totalXof: number;
  createdAt: Date;
  items: Array<{
    productId: number | null;
    productTitle: string;
    imageUrl: string;
    unitPriceXof: number;
    quantity: number;
    lineTotalXof: number;
  }>;
}) => ({
  id: order.id,
  status: order.status.toLowerCase(),
  items: order.items.map((item) => ({
    productId: item.productId === null ? null : String(item.productId),
    title: item.productTitle,
    imageUrl: item.imageUrl,
    unitPriceXof: item.unitPriceXof,
    quantity: item.quantity,
    lineTotalXof: item.lineTotalXof
  })),
  deliveryAddress: {
    firstName: order.firstName,
    lastName: order.lastName,
    phone: order.phone,
    secondaryPhone: order.secondaryPhone,
    city: order.city,
    district: order.district,
    address: order.address,
    additionalInfo: order.additionalInfo
  },
  subtotalXof: order.subtotalXof,
  shippingCostXof: order.shippingCostXof,
  totalXof: order.totalXof,
  paymentMethod: "cash_on_delivery" as const,
  createdAt: order.createdAt.toISOString()
});

export class PrismaOrderRepository {
  async create(userId: string, idempotencyKey: string, input: CreateOrderInput) {
    return prisma.$transaction(async (transaction) => {
      const previousOrder = await transaction.order.findUnique({
        where: { userId_idempotencyKey: { userId, idempotencyKey } },
        include: orderInclude
      });
      if (previousOrder) return previousOrder;

      const productIds = input.items.map((item) => item.productId);
      const products = await transaction.product.findMany({
        where: { id: { in: productIds }, isPublished: true },
        select: {
          id: true,
          title: true,
          imageUrl: true,
          priceXof: true,
          stock: true
        }
      });
      if (products.length !== productIds.length) {
        throw new ProductUnavailableError("Un produit n’est plus disponible.");
      }

      const productsById = new Map(products.map((product) => [product.id, product]));
      const orderItems = input.items.map((item) => {
        const product = productsById.get(item.productId);
        if (!product) throw new ProductUnavailableError("Produit non trouvé.");
        if (product.stock < item.quantity) {
          throw new StockUnavailableError(
            `Stock insuffisant pour « ${product.title} ».`
          );
        }
        return {
          product,
          quantity: item.quantity,
          lineTotalXof: product.priceXof * item.quantity
        };
      });

      const subtotalXof = orderItems.reduce(
        (subtotal, item) => subtotal + item.lineTotalXof,
        0
      );
      const shippingCostXof = calculateShippingCost(subtotalXof);
      if (
        !Number.isSafeInteger(subtotalXof) ||
        subtotalXof + shippingCostXof > 2_147_483_647
      ) {
        throw new OrderAmountTooLargeError(
          "Le montant total dépasse la limite autorisée."
        );
      }

      for (const item of orderItems) {
        const update = await transaction.product.updateMany({
          where: {
            id: item.product.id,
            isPublished: true,
            stock: { gte: item.quantity }
          },
          data: { stock: { decrement: item.quantity } }
        });
        if (update.count !== 1) {
          throw new StockUnavailableError(
            `Stock insuffisant pour « ${item.product.title} ».`
          );
        }
      }

      return transaction.order.create({
        data: {
          userId,
          idempotencyKey,
          firstName: input.deliveryAddress.firstName,
          lastName: input.deliveryAddress.lastName,
          phone: input.deliveryAddress.phone,
          secondaryPhone: input.deliveryAddress.secondaryPhone || null,
          city: input.deliveryAddress.city,
          district: input.deliveryAddress.district,
          address: input.deliveryAddress.address,
          additionalInfo: input.deliveryAddress.additionalInfo || null,
          subtotalXof,
          shippingCostXof,
          totalXof: subtotalXof + shippingCostXof,
          items: {
            create: orderItems.map(({ product, quantity, lineTotalXof }) => ({
              productId: product.id,
              productTitle: product.title,
              imageUrl: product.imageUrl,
              unitPriceXof: product.priceXof,
              quantity,
              lineTotalXof
            }))
          }
        },
        include: orderInclude
      });
    });
  }

  async listForUser(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: orderInclude
    });
  }

  async getForUser(userId: string, orderId: string) {
    return prisma.order.findFirst({
      where: { id: orderId, userId },
      include: orderInclude
    });
  }
}

export const prismaOrderRepository = new PrismaOrderRepository();
