import mongoose from 'mongoose';
import { Bill } from '../models/Bill.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/apiError.js';

export const createBill = async (req, res) => {
  const { customerName, items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'items must be a non-empty array');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let totalAmount = 0;
    const billItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) throw new ApiError(404, `Product not found: ${item.productId}`);

      if (item.quantity > product.quantity) {
        throw new ApiError(400, `Insufficient stock for ${product.name}`);
      }

      const lineTotal = product.price * item.quantity;
      totalAmount += lineTotal;

      product.quantity -= item.quantity;
      await product.save({ session });

      billItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        lineTotal,
      });
    }

    const [bill] = await Bill.create(
      [
        {
          customerName,
          items: billItems,
          totalAmount,
          createdBy: req.user.userId,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    res.status(201).json(bill);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const listBills = async (req, res) => {
  const bills = await Bill.find().sort({ createdAt: -1 });
  res.json(bills);
};
