import { useId } from "react";
import { MenuProps } from "@/type";
import BS from "@/component/BottomSheet";
import Button from "@/component/Button";
import styles from "./modal.module.css";

type NameChangeProps = {
  userName: string;
  formAction: (payload: FormData) => void;
};

export function NameChangeForm({ userName, formAction }: NameChangeProps) {
  return (
    <div className={styles.modal_container}>
      <p>이름을 변경하세요.</p>
      <form action={formAction}>
        <input
          type="text"
          name="userName"
          placeholder={userName}
          required
          title="같은 이름은 입력할 수 없습니다."
          pattern={`^(?:(?!${userName}).)*$`}
          maxLength={4}
        />
        <BS.Submit fullWidth>변경</BS.Submit>
      </form>
    </div>
  );
}

type MenuSubmitProps = {
  selectedMenu: MenuProps;
  formAction: (payload: FormData) => void;
};

const coffeeSize = ["L", "M", "S"] as const;
const temperatures = ["HOT", "ICE"] as const;

export function MenuSubmitForm({ selectedMenu, formAction }: MenuSubmitProps) {
  const menuNameId = useId();
  const sizeId = useId();
  const tId = useId();
  return (
    <div className={styles.modal_container}>
      <form action={formAction}>
        <input
          id={menuNameId}
          type="text"
          name="menuName"
          value={selectedMenu?.name.kor}
          hidden
          readOnly
        />
        <div className={styles["menu-column"]}>
          <label htmlFor={menuNameId}>메뉴이름</label>
          <span>[{selectedMenu?.name.kor}]</span>
        </div>
        <div className={styles["menu-column"]}>
          <label htmlFor={sizeId}>사이즈</label>
          <select id={sizeId} name="size">
            {coffeeSize.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className={styles["menu-column"]}>
          <label htmlFor={tId}>온도</label>
          <select id={tId} name="temperature">
            {temperatures.map((temp) => (
              <option key={temp} value={temp}>
                {temp}
              </option>
            ))}
          </select>
        </div>
        <p>선택하시겠습니까?</p>
        <Button fullWidth>확인</Button>
      </form>
    </div>
  );
}
