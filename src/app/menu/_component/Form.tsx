import { useId } from "react";
import { MenuProps, OrderItem } from "@/type";
import Radio from "@/components/Radio";
import BS from "@/components/BottomSheet";
import Toggle from "@/components/Toggle";
import LoadingButton from "@/components/Loading/Button";
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
        <BS.Submit fullWidth closeOnSubmit childrenOnPending="변경 중...">
          변경
        </BS.Submit>
      </form>
    </div>
  );
}

type MenuSubmitProps = {
  previousMenu?: OrderItem;
  selectedMenu: MenuProps;
  formAction: (payload: FormData) => void;
};

const coffeeSize = ["L", "M", "S"] as const;
const temperatures = ["HOT", "ICE"] as const;

export function MenuSubmitForm({
  previousMenu,
  selectedMenu,
  formAction,
}: MenuSubmitProps) {
  const menuNameId = useId();
  const decafId = useId();
  /** 기존 선택 메뉴와 현재 선택 메뉴가 같을 경우 체크 */
  const prevEqualSelected = previousMenu?.menuName === selectedMenu.name.kor;

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
                defaultChecked={
                  prevEqualSelected ? previousMenu.size === size : idx === 0
                }
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
                defaultChecked={
                  prevEqualSelected
                    ? previousMenu.temperature === temperature
                    : idx === 0
                }
              />
            ))}
          </div>
        </div>
        <div className={styles["menu-column"]}>
          <label htmlFor={decafId}>디카페인</label>
          <Toggle
            name="decaf"
            defaultChecked={prevEqualSelected ? !!previousMenu.decaf : false}
          />
        </div>
        <p>선택하시겠습니까?</p>
        <LoadingButton />
      </form>
    </div>
  );
}
