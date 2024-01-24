import AdminSideBar from './sidebar';

type AdminLayoutProps = {
  children: React.ReactNode;
};
export default function Layout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-[calc(100%-var(--header-height))]">
      <AdminSideBar />
      {children}
    </div>
  );
}
