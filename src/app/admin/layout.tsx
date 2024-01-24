import { headers } from 'next/headers';

import AdminSideBar from './sidebar';

type AdminLayoutProps = {
  children: React.ReactNode;
};
export default function Layout({ children }: AdminLayoutProps) {
  const referer = headers().get('referer');
  const isAdminRoot =
    typeof referer === 'string' && new URL(referer).pathname === '/admin';
  return (
    <div className="flex h-[calc(100%-var(--header-height))]">
      {!isAdminRoot && <AdminSideBar />}
      {children}
    </div>
  );
}
