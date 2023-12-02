import { CheerioAPI, load } from "cheerio";

const ingredientList = [
  { name: "calories", className: "bg1" },
  { name: "saturatedFat", className: "bg2" },
  { name: "sodium", className: "bg3" },
  { name: "carbohydrate", className: "bg4" },
  { name: "sugars", className: "bg5" },
  { name: "caffeine", className: "bg6" },
  { name: "protain", className: "bg7" },
] as const;

const initialIngredient = ingredientList.reduce(
  (acc, ingredient) => ({ ...acc, [ingredient.name]: "" }),
  {}
) as Record<IngredientKey, number>;

type IngredientKey = (typeof ingredientList)[number]["name"];

export type MenuContentsProps = {
  title: string;
  list: MenuProps[];
};

export type MenuProps = {
  photo: string;
  name: {
    kor: string;
    eng: string;
  };
  description: string;
  info: typeof initialIngredient;
};

export async function getMenu(url: string) {
  const urlObject = new URL(url);
  const protocolAndHostname = `${urlObject.protocol}//${urlObject.hostname}`;
  const coffeeBeanPages = await fetch(url)
    .then((res) => res.text())
    .then(load)
    .then(getHrefFromTags)
    .then((list) => list.map((href) => `${protocolAndHostname}${href}`));

  const menuContent: MenuContentsProps[] = [];
  for await (const page of coffeeBeanPages) {
    await new Promise((res) => setTimeout(res, 500));
    const menu = await getMenuFromPages(page, protocolAndHostname);
    menuContent.push(menu);
  }

  return menuContent;
}

function getHrefFromTags($: CheerioAPI) {
  const contents = $("#contents .lnb_wrap2 li:first-child a");
  const contentToArray = Array.from(contents);
  return contentToArray
    .map((el) => $(el).attr("href") || "")
    .filter((href) => href && href?.includes("category"));
}

async function getMenuFromPages(page: string, protocolAndHostname: string) {
  const result: MenuContentsProps = { title: "", list: [] };
  let cnt = 1;
  while (cnt < 6) {
    const data = await fetch(`${page}&page=${cnt++}`)
      .then((res) => res.text())
      .then(load)
      .then(getMenuFromPage(protocolAndHostname));
    if (!result.title) {
      result.title = data.title;
    }
    result.list = [...result.list, ...data.list];
    if (!data.hasNextPage) break;
    await new Promise((res) => setTimeout(res, 500));
  }
  return result;
}

function getMenuFromPage(protocolAndHostname: string) {
  return function (
    $: CheerioAPI
  ): MenuContentsProps & { hasNextPage: boolean } {
    const breadcrumb = $("#wrap .location li");
    const title = breadcrumb.last().text();
    const contents = $("#contents .menu_list li");
    const list = Array.from(contents).map((el) => {
      const $this = $(el);
      const photo = `${protocolAndHostname}${$this
        .find("figure img")
        .attr("src")}`;
      const name = Array.from($this.find("dl.txt dt span")).reduce(
        (obj, span) => ({ ...obj, [span.attribs.class]: $(span).text() }),
        { kor: "", eng: "" }
      );
      const description = $this.find("dl.txt dd").text();
      const infoDOM = $this.find(".info");
      const info = ingredientList.reduce(
        (obj, { className, name }) => {
          const qty = Number(infoDOM.find(`.${className} dt`).text());
          return { ...obj, [name]: !isNaN(qty) ? qty : 0 };
        },
        { ...initialIngredient }
      );

      return {
        photo,
        name,
        description,
        info,
      };
    });
    const pagination = $(".list_wrap .paging a");
    const hasNextPage = Array.from(pagination).some(
      (el) => el.attribs.class === "next"
    );

    return {
      title,
      list,
      hasNextPage,
    };
  };
}
