import { CheerioAPI, load } from "cheerio";
import { MenuProps, ingredientList, initialIngredient } from "@/type";

export async function getCategories(url: string) {
  const coffeeBeanPages = await fetch(url, { cache: "no-store" })
    .then((res) => res.text())
    .then(load)
    .then(getHrefFromTags)
    .then((list) =>
      list.map(({ title, category }) => {
        const [, categoryNum] = category.split("?category=");
        return {
          title,
          category: categoryNum,
        };
      })
    );
  return coffeeBeanPages;
}

function getHrefFromTags($: CheerioAPI) {
  const contents = $("#contents .lnb_wrap2 li:first-child a").toArray();
  const namesAndCategories = contents
    .map((el) => {
      const $this = $(el);
      return {
        title: $this.html() || "",
        category: $this.attr("href") || "",
      };
    })
    .filter(
      ({ title, category }) =>
        category &&
        category?.includes("category") &&
        title &&
        title.localeCompare("음료") !== 0
    );

  const result = namesAndCategories.reduce<typeof namesAndCategories>(
    (acc, item) =>
      acc.find(({ category }) => category === item.category)
        ? acc
        : [...acc, item],
    []
  );

  return result;
}

export async function getMenuFromPages(url: string) {
  let result: MenuProps[] = [];
  const urlObject = new URL(url);
  const protocolAndHostname = `${urlObject.protocol}//${urlObject.hostname}`;
  let cnt = 1;
  while (cnt < 6) {
    await new Promise((res) => setTimeout(res, 500));
    const data = await fetch(`${url}&page=${cnt++}`, { cache: "no-store" })
      .then((res) => res.text())
      .then(load)
      .then(getMenuFromPage(protocolAndHostname));
    result = [...result, ...data.list];
    if (!data.hasNextPage) break;
  }
  return result;
}

function getMenuFromPage(protocolAndHostname: string) {
  return function ($: CheerioAPI): { list: MenuProps[]; hasNextPage: boolean } {
    const breadcrumb = $("#wrap .location li a");
    const href = breadcrumb.last().attr("href");
    let category: string;
    if (href) {
      [, category] = href.split("=");
    }
    const contents = $("#contents .menu_list li").toArray();
    const list = contents.map((el) => {
      const $this = $(el);
      const photo = `${protocolAndHostname}${$this
        .find("figure img")
        .attr("src")}`;
      const name = $this
        .find("dl.txt dt span")
        .toArray()
        .reduce(
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
        category,
        info,
      };
    });
    const pagination = $(".list_wrap .paging a").toArray();
    const hasNextPage = pagination.some((el) => el.attribs.class === "next");

    return {
      list,
      hasNextPage,
    };
  };
}
