import { Cheerio, CheerioAPI, load } from "cheerio";

async function getMenu(url: string) {
  const coffeeBeanPages = await fetch(url)
    .then((res) => res.text())
    .then(load)
    .then(getHrefFromTags);

  const menuList: string[] = [];
  for (const page of coffeeBeanPages) {
    const menu = await fetch(page)
      .then((res) => res.text())
      .then(load)
      .then(getMenuFromPage);
    menuList.push(menu);
  }

  return [];
}

function getHrefFromTags($: CheerioAPI) {
  const contents = $("#contents .lnb_wrap2 li:first-child a");
  const contentToArray = Array.from(contents);
  return contentToArray
    .map((el) => $(el).attr("href") || "")
    .filter((href) => href && href?.includes("category"));
}

function getMenuFromPage($: CheerioAPI) {
  return "";
}

export default async function Menu() {
  const data = await getMenu("https://www.coffeebeankorea.com/menu/list.asp");
  return (
    <ul>
      {data?.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  );
}
