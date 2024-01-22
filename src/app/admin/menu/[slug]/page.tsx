import { redirect } from 'next/navigation';

import Paginations from '@/components/Pagination';
import { getPaginatedMenuList } from '@/database/coffeebean/get';

import MenuAdmin from '../../_component/AdminMenu';

export default async function MenuAdminPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = Number(params.slug);
  const { menuList, totalPage } = await getPaginatedMenuList({ slug });
  if (slug > totalPage) redirect(`/admin/menu/${totalPage}`);
  return (
    <div className="flex flex-col justify-center m-auto w-4/5 h-[calc(100%-var(--header-height))]">
      <MenuAdmin menuList={menuList} />
      <Paginations href="/admin/menu" slug={slug} totalPage={totalPage} />
    </div>
  );
}
