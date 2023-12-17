import { useId } from "react";
import { MenuProps } from "@/type";
import Radio from "@/component/Radio";
import BS from "@/component/BottomSheet";
import Toggle from "@/component/Toggle";
import LoadingButton from "@/component/Loading/Button";
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
  const decafId = useId();

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
          <span>[{selectedMenu?.name.kor}]</span>
        </div>
        <div className={styles["menu-column"]}>
          <label>사이즈</label>
          <div className={styles.radio}>
            {coffeeSize.map((size, idx) => (
              <Radio
                key={size}
                name="size"
                value={size}
                label={size}
                defaultChecked={idx === 0}
              />
            ))}
          </div>
        </div>
        <div className={styles["menu-column"]}>
          <label>온도</label>
          <div className={styles.radio}>
            {temperatures.map((temperature, idx) => (
              <Radio
                key={temperature}
                name="temperature"
                value={temperature}
                label={temperature}
                defaultChecked={idx === 0}
              />
            ))}
          </div>
        </div>
        <div className={styles["menu-column"]}>
          <label htmlFor={decafId}>디카페인</label>
          <Toggle name="decaf" />
        </div>
        <p>선택하시겠습니까?</p>
        <LoadingButton />
      </form>
    </div>
  );
}
