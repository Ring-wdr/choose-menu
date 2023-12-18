import { cache } from "react";
import { Category, MenuProps, OrderBlock, OrderItem } from "@/type";
import clientPromise from "@/database";
import { COFFEEBEAN } from ".";
import { MOCK } from "@/crawling/mock";

export const getOrderedList = async () => {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const orderCollection = db.collection<OrderItem>(COFFEEBEAN.COLLECTION.ORDER);
  const orders = await orderCollection.find().toArray();
  return orders.map((order) => ({
    ...order,
    _id: order._id.toString(),
    timestamp: order._id.getTimestamp(),
  }));
};

const groupStage = {
  $group: {
    _id: "$userName",
    latestOrder: { $last: "$$ROOT" },
  },
};
const sortStage = {
  $sort: {
    _id: -1,
  },
};
const projState = {
  $project: {
    _id: 0,
    userName: "$_id",
    menuName: "$latestOrder.menuName",
    size: "$latestOrder.size",
    temperature: "$latestOrder.temperature",
    decaf: "$latestOrder.decaf",
  },
};

type OrderOmitUserName = Omit<OrderItem, "userName">;
export type BillType = OrderOmitUserName & { count: number };

export const getOrderListGroupByUserName = async () => {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const orderCollection = db.collection<OrderItem>(COFFEEBEAN.COLLECTION.ORDER);
  const orders = (await orderCollection
    .aggregate([groupStage, sortStage, projState])
    .toArray()) as OrderItem[];
  return orders;
};

export const getOrderListGroupByNameSizeTemp = async () => {
  const orders = await getOrderListGroupByUserName();
  const result = orders.reduce<BillType[]>((res, lastOrder) => {
    const existGroup = res.find(
      (order) =>
        order.menuName === lastOrder.menuName &&
        order.size === lastOrder.size &&
        order.temperature === lastOrder.temperature &&
        !!order.decaf === !!lastOrder.decaf
    );
    if (existGroup) {
      existGroup.count++;
      return res;
    }
    return [...res, { ...lastOrder, count: 1 }];
  }, []);
  return result;
};

export const getCategoryList = async () => {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const categoryCollection = db.collection<Category>(
    COFFEEBEAN.COLLECTION.CATEGORY
  );
  return categoryCollection.find().toArray();
};

/** cached method */
export const cachedGetCategoryList = cache(async () => {
  if (process.env.NODE_ENV === "development") return MOCK.CATEGORY_LIST;
  const categoryList = await getCategoryList();
  return categoryList.map((menu) => ({ ...menu, _id: menu._id.toString() }));
});

export const getMenuList = async (): Promise<MenuProps[]> => {
  if (process.env.NODE_ENV === "development") return MOCK.MENULIST;
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const menuCollection = db.collection<MenuProps>(COFFEEBEAN.COLLECTION.MENU);
  return (await menuCollection.find().toArray()).map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));
};

export const cachedGetMenuList = cache(getMenuList);

export const getMenuListById = async (
  category: string
): Promise<MenuProps[]> => {
  if (process.env.NODE_ENV === "development") {
    const menuById = MOCK.MENULIST.filter((menu) => menu.category === category);
    return menuById;
  }

  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const menuCollection = db.collection<MenuProps>(COFFEEBEAN.COLLECTION.MENU);
  return (await menuCollection.find({ category }).toArray()).map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));
};

export const getRecentMenuByUserName = async (
  userName: string
): Promise<MenuProps | null> => {
  if (process.env.NODE_ENV === "development") {
    const dice = Math.random();
    if (dice < 0.3) {
      throw new Error("server error");
    }
    if (dice > 0.6) {
      return null;
    }
    return MOCK.MENULIST[Math.floor(Math.random() * MOCK.MENULIST.length)];
  }

  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const orderCollection = db.collection<OrderItem>(COFFEEBEAN.COLLECTION.ORDER);
  const orderByUserName = await orderCollection.findOne(
    { userName },
    { sort: { _id: -1 } }
  );
  const menuCollection = db.collection<MenuProps>(COFFEEBEAN.COLLECTION.MENU);
  if (!orderByUserName) return null;
  const menuByOrder = await menuCollection.findOne({
    "name.kor": orderByUserName.menuName,
  });
  if (!menuByOrder) return null;
  const { _id, ...result } = menuByOrder;
  return result;
};

export const getOrderBlock = async () => {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const orderBlock = db.collection<OrderBlock>(
    COFFEEBEAN.COLLECTION.ORDER_BLOCK
  );
  return orderBlock.findOne();
};
