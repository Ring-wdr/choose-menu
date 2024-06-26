import { cache } from 'react';

import { MOCK } from '@/crawling/mock';
import clientPromise, { idToString } from '@/database';
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
  return orders.map(idToString);
};

const groupState = {
  $group: {
    _id: {
      userName: '$userName',
      sub: {
        $cond: {
          if: { $eq: ['$sub', 'on'] }, // sub이 'on'인 경우
          then: 'on',
          else: null, // 'on'이 아닌 경우
        },
      },
    },
    latestOrder: { $last: '$$ROOT' },
  },
} as const;
const sortRecentFirstState = {
  $sort: {
    _id: -1,
  },
} as const;
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
} as const;

type OrderOmitUserName = Omit<OrderItem, 'userName'>;
export type BillType = OrderOmitUserName & { count: number };

export const getOrderListGroupByUserName = async () => {
  if (process.env.NODE_ENV === 'development') {
    return MOCK.ORDER_LIST;
  }
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const orderCollection = db.collection<OrderItem>(COFFEEBEAN.COLLECTION.ORDER);
  const absenceList = db.collection<Absence>(COFFEEBEAN.COLLECTION.ABSENCE);
  const leaveList = (await absenceList.find({ leave: true }).toArray()).map(
    (item) => item.userName,
  );
  const orders = await orderCollection
    .aggregate<OrderItem>([
      {
        $match: { userName: { $nin: leaveList } },
      },
      groupState,
      sortRecentFirstState,
      projState,
    ])
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
        findOrderByName[order.sub === 'on' ? 'subMenu' : 'mainMenu'] = order;
        return result;
      }
      if (order.sub === 'on') {
        return [...result, { userName: order.userName, subMenu: order }];
      }
      return [...result, { userName: order.userName, mainMenu: order }];
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
    if (findUserState) {
      return (
        findUserState.absence !== true &&
        (findUserState.sub ? order.sub : !order.sub)
      );
    } else {
      return order.sub !== 'on';
    }
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
  return categoryList.map(idToString);
});

export const getMenuList = async (): Promise<
  Array<ReturnType<typeof idToString<MenuProps>>>
> => {
  if (process.env.NODE_ENV === 'development') return MOCK.MENULIST;
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const menuCollection = db.collection<MenuProps>(COFFEEBEAN.COLLECTION.MENU);
  return (
    await menuCollection
      .find({
        soldOut: { $ne: true },
      })
      .sort({ _id: -1 })
      .toArray()
  ).map(idToString);
};

export const cachedGetMenuList = cache(getMenuList);

type PaginatedMenuParams = {
  slug?: number;
  category?: string;
  keyword?: string;
  limit?: number;
  length?: number;
};

export const getPaginatedMenuList = cache(
  async ({
    limit = 10,
    length = 10,
    slug = 1,
    category,
    keyword,
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
    const filterObject = {
      ...(category && { category }),
      ...(keyword && { 'name.kor': { $regex: keyword, $options: 'i' } }),
    };

    const [menuList, totalDocuments] = await Promise.all([
      menuCollection.find(filterObject).limit(limit).skip(offset).toArray(),
      !category && !keyword
        ? menuCollection.estimatedDocumentCount()
        : menuCollection.countDocuments(filterObject),
    ]);

    const totalPage = Math.ceil(totalDocuments / length);

    return {
      menuList: menuList.map(idToString),
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
  return (await menuCollection.find({ category }).toArray()).map(idToString);
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
  const [[latestMainOrder, seclatestMainOrder], lastSubOrder] =
    await Promise.all([
      orderCollection
        .find({ userName, sub: { $ne: 'on' } }, { sort: { _id: -1 } })
        .limit(2)
        .toArray(),
      orderCollection.findOne({ userName, sub: 'on' }, { sort: { _id: -1 } }),
    ]);

  if (!latestMainOrder) return null;
  /**
   * 2순위 메뉴
   * 1. sub: 'on'인 메뉴가 있는 경우 해당 조건에서 최신 메뉴를 전달
   * 2. sub: 'on'인 메뉴가 없는 경우 최신 메뉴 직전의 메뉴를 전달
   */
  const parsedSubOrder = lastSubOrder ?? seclatestMainOrder ?? null;
  return [
    idToString(latestMainOrder),
    parsedSubOrder ? idToString(parsedSubOrder) : null,
  ];
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
  return (await absenceList.find().toArray()).map(idToString);
};
