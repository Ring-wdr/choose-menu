import { MenuProvider } from './_component/MenuContext';
import NameSection from './_component/NameSection';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MenuProvider>
      <NameSection />
      {children}
    </MenuProvider>
  );
}
