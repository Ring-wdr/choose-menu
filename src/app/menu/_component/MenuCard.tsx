import BevImage from "./BevImage";
import { MenuProps } from "@/type";
import styles from "./card.module.css";
import clsx from "clsx";

type MenuCardProps = {
  selectedMenu?: MenuProps | null;
  className?: string;
};

export default function MenuCard({ selectedMenu, className }: MenuCardProps) {
  return (
    <section className={clsx(styles.container, className)}>
      <div className={styles.item}>
        {selectedMenu ? (
          <BevImage
            src={selectedMenu.photo}
            width={200}
            height={200}
            alt={selectedMenu.name.kor}
          />
        ) : (
          <div className={styles.fallback}></div>
        )}
        <p>{selectedMenu?.name.kor || "메뉴를 골라주세요"}</p>
        {selectedMenu && (
          <>
            <p>{selectedMenu.name.eng}</p>
            <pre>{selectedMenu.description.trim()}</pre>
          </>
        )}
      </div>
      {/* {selectedMenu ? (
          <div>
            <div>{selectedMenu.info.calories}</div>
            <div>{selectedMenu.info.saturatedFat}</div>
            <div>{selectedMenu.info.sodium}</div>
            <div>{selectedMenu.info.carbohydrate}</div>
            <div>{selectedMenu.info.sugars}</div>
            <div>{selectedMenu.info.caffeine}</div>
            <div>{selectedMenu.info.protain}</div>
          </div>
        ) : null} */}
    </section>
  );
}
