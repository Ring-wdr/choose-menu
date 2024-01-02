import Image from "next/image";

const imgPlaceholder =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg==";

export default function BevImage({
  alt = "beverage",
  ...props
}: React.ComponentProps<typeof Image>) {
  return <Image alt={alt} placeholder={imgPlaceholder} {...props} />;
}
