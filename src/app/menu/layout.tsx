import NameSection from './_component/NameSection';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NameSection />
      {children}
    </>
  );
}
