import ClientSide from "./ClientSide";
import { getMenu } from "./action";

export default async function Menu({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  try {
    const userName = searchParams?.userName || "사용자";
    const data = await getMenu("https://www.coffeebeankorea.com/menu/list.asp");
    return (
      <div>
        <p>{userName}님, 메뉴를 고르세요</p>
        <ClientSide data={data} userName={userName as string} />
      </div>
    );
  } catch {
    return <div>현재 메뉴를 불러올 수 없습니다.</div>;
  }
}
