import { cache } from 'react';

import { MOCK } from '@/crawling/mock';
import clientPromise from '@/database';
import {
  Absence,
  Category,
  MenuProps,
  OrderBlock,
  OrderItem,
  OrderWithSubMenu,
} from '@/type';

import { COFFEEBEAN } from '.';

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
    _id: { userName: '$userName', sub: '$sub' },
    latestOrder: { $last: '$$ROOT' },
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
    userName: '$_id.userName',
    sub: '$_id.sub',
    menuName: '$latestOrder.menuName',
    size: '$latestOrder.size',
    shot: '$latestOrder.shot',
    temperature: '$latestOrder.temperature',
    decaf: '$latestOrder.decaf',
  },
};

type OrderOmitUserName = Omit<OrderItem, 'userName'>;
export type BillType = OrderOmitUserName & { count: number };

export const getOrderListGroupByUserName = async () => {
  if (process.env.NODE_ENV === 'development') {
    return MOCK.ORDER_LIST;
  }
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const orderCollection = db.collection<OrderItem>(COFFEEBEAN.COLLECTION.ORDER);
  const orders = await orderCollection
    .aggregate<OrderItem>([groupStage, sortStage, projState])
    .toArray();
  return orders;
};

export const getOrderListGroupByUserNameAdmin = async () => {
  const orders = await getOrderListGroupByUserName();
  const ordersContainSubmenu = orders.reduce<Array<OrderWithSubMenu>>(
    (result, order) => {
      const findOrderByName = result.find(
        ({ userName }) => userName === order.userName,
      );
      if (findOrderByName) {
        findOrderByName[order.sub === 'on' ? 'subMenuName' : 'menuName'] =
          order.menuName;
      }
      if (order.sub === 'on') {
        result.push({ ...order, subMenuName: order.menuName });
      }
      return result;
    },
    [],
  );
  return ordersContainSubmenu;
};

export const getOrderListGroupByNameSizeTemp = cache(async () => {
  const [orders, absenceList] = await Promise.all([
    getOrderListGroupByUserName(),
    getAbsenceList(),
  ]);
  /** absence = true, sub */
  const filteredOrders = orders.filter((order) => {
    const findUserState = absenceList.find(
      ({ userName }) => userName === order.userName,
    );
    return (
      !findUserState ||
      (!findUserState.absence && (findUserState.sub ? order.sub : !order.sub))
    );
  });

  const orderList = filteredOrders.reduce<BillType[]>((res, lastOrder) => {
    const existGroup = res.find(
      (order) =>
        order.menuName === lastOrder.menuName &&
        order.size === lastOrder.size &&
        order.temperature === lastOrder.temperature &&
        !!order.decaf === !!lastOrder.decaf,
    );
    if (existGroup) {
      existGroup.count++;
      return res;
    }
    return [...res, { ...lastOrder, count: 1 }];
  }, []);
  const result = orderList.map((lastOrder, idx) => ({
    id: idx,
    title: `(${lastOrder.size || 'S'})${lastOrder.temperature || ''} ${
      lastOrder.menuName
    }${lastOrder.shot ? `[${lastOrder.shot} SHOT]` : ''}`,
    decaf: lastOrder.decaf,
    count: lastOrder.count,
  }));
  return result;
});

export const getCategoryList = async () => {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const categoryCollection = db.collection<Category>(
    COFFEEBEAN.COLLECTION.CATEGORY,
  );
  return categoryCollection.find().toArray();
};

/** cached method */
export const cachedGetCategoryList = cache(async () => {
  if (process.env.NODE_ENV === 'development') return MOCK.CATEGORY_LIST;
  const categoryList = await getCategoryList();
  return categoryList.map((menu) => ({ ...menu, _id: menu._id.toString() }));
});

export const getMenuList = async (): Promise<MenuProps[]> => {
  if (process.env.NODE_ENV === 'development') return MOCK.MENULIST;
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const menuCollection = db.collection<MenuProps>(COFFEEBEAN.COLLECTION.MENU);
  return (
    await menuCollection
      .find({
        soldOut: { $ne: true },
      })
      .toArray()
  ).map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));
};

export const cachedGetMenuList = cache(getMenuList);

type PaginatedMenuParams = {
  slug: number;
  limit?: number;
  length?: number;
};

export const getPaginatedMenuList = cache(
  async ({
    limit = 10,
    length = 10,
    slug = 1,
  }: PaginatedMenuParams): Promise<{
    menuList: Array<MenuProps & { _id: string }>;
    totalPage: number;
  }> => {
    if (isNaN(slug) || slug < 1) {
      throw new Error('Invalid slug value.');
    }
    const offset = (slug - 1) * length;
    if (process.env.NODE_ENV === 'development') {
      return {
        menuList: MOCK.MENULIST.slice(offset, offset + limit),
        totalPage: Math.floor(MOCK.MENULIST.length / length) + 1,
      };
    }
    const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
    const menuCollection = db.collection<MenuProps>(COFFEEBEAN.COLLECTION.MENU);

    const [menuList, totalDocuments] = await Promise.all([
      menuCollection.find().limit(limit).skip(offset).toArray(),
      menuCollection.estimatedDocumentCount(),
    ]);
    const totalPage = Math.ceil(totalDocuments / length);
    return {
      menuList: menuList.map((item) => ({ ...item, _id: item._id.toString() })),
      totalPage,
    };
  },
);

export const getMenuListById = async (
  category: string,
): Promise<MenuProps[]> => {
  if (process.env.NODE_ENV === 'development') {
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
  userName: string,
): Promise<[OrderItem, OrderItem | null] | null> => {
  if (process.env.NODE_ENV === 'development') {
    const dice = Math.random();
    if (dice < 0.3) {
      throw new Error('server error');
    }
    if (dice > 0.7) {
      return null;
    }
    const randomMenu =
      MOCK.MENULIST[Math.floor(Math.random() * MOCK.MENULIST.length)];
    return [
      {
        ...MOCK.ORDER,
        menuName: randomMenu.name.kor,
        decaf: dice > 0.5 ? null : 'on',
        size: dice > 0.5 ? 'L' : 'S',
        temperature: dice > 0.5 ? 'ICE' : 'HOT',
      },
      {
        ...MOCK.ORDER,
        menuName: randomMenu.name.kor,
        decaf: dice > 0.5 ? null : 'on',
        size: dice > 0.5 ? 'L' : 'S',
        temperature: dice > 0.5 ? 'ICE' : 'HOT',
        sub: 'on',
      },
    ];
  }

  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const orderCollection = db.collection<OrderItem>(COFFEEBEAN.COLLECTION.ORDER);
  const [firstOrder, subOrder] = await Promise.all([
    orderCollection.findOne({ userName }, { sort: { _id: -1 } }),
    orderCollection.findOne({ userName, sub: 'on' }, { sort: { _id: -1 } }),
  ]);

  if (!firstOrder) return null;
  return [firstOrder, subOrder];
};

export const getOrderBlock = async () => {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const orderBlock = db.collection<OrderBlock>(
    COFFEEBEAN.COLLECTION.ORDER_BLOCK,
  );
  return orderBlock.findOne();
};

export const getAbsenceList = async () => {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const absenceList = db.collection<Absence>(COFFEEBEAN.COLLECTION.ABSENCE);
  return (await absenceList.find().toArray()).map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));
};
