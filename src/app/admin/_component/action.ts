"use server";

export const action = async (data: any) => {
  "use server";
  await new Promise((res) => setTimeout(res, 1000));
  console.log(Object.fromEntries(data));
};
