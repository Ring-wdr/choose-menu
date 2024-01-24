import { useId } from 'react';

import BS from '@/components/BottomSheet';
import LoadingButton from '@/components/Loading/Button';
import Radio from '@/components/Radio';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { coffeeSize, MenuProps, OrderItem } from '@/type';

import styles from './modal.module.css';

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

const temperatures = ['HOT', 'ICE'] as const;
const shots = Array.from({ length: 5 }, (_, idx) => idx);

export function MenuSubmitForm({
  previousMenu,
  selectedMenu,
  formAction,
}: MenuSubmitProps) {
  const menuNameId = useId();
  /** 기존 선택 메뉴와 현재 선택 메뉴가 같을 경우 체크 */
  const prevEqualSelected = previousMenu?.menuName === selectedMenu.name.kor;
  const showingCoffeeSize = !selectedMenu.size
    ? coffeeSize
    : coffeeSize.filter((size) => selectedMenu.size?.includes(size));

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
        <div className={styles['menu-column']}>
          <span>[{selectedMenu?.name.kor}]</span>
        </div>
        <div className={styles['menu-column']}>
          <label>사이즈</label>
          <div className={styles.radio}>
            {showingCoffeeSize.map((size, idx) => (
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
        <div className={styles['menu-column']}>
          <label>온도</label>
          <div className={styles.radio}>
            {selectedMenu.only && (
              <Radio
                name="temperature"
                value={selectedMenu.only.toUpperCase()}
                label={`${selectedMenu.only.toUpperCase()} ONLY`}
                theme={selectedMenu.only}
                defaultChecked
              />
            )}
            {!selectedMenu.only &&
              temperatures.map((temperature, idx) => (
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
        <div className="flex flex-col justify-between w-2/3 mb-3 gap-3">
          {selectedMenu.decaf && (
            <div className="flex flex-row justify-between items-center">
              <label>디카페인</label>
              <Switch
                name="decaf"
                className="mt-0"
                defaultChecked={
                  prevEqualSelected ? !!previousMenu.decaf : false
                }
              />
            </div>
          )}
          {/* <div className="flex flex-row justify-between items-center">
            <label>예비 메뉴</label>
            <Switch
              name="sub"
              className="mt-0"
              defaultChecked={prevEqualSelected ? !!previousMenu.sub : false}
            />
          </div> */}
          <div className="flex flex-row justify-between items-center">
            <label>샷</label>
            <Select name="shot">
              <SelectTrigger className="w-36">
                <SelectValue placeholder="추가 시 선택" />
              </SelectTrigger>
              <SelectContent>
                {shots.map((num) => (
                  <SelectItem key={num} value={String(num)}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="mt-6">선택하시겠습니까?</p>
        <LoadingButton className={styles.submit} />
      </form>
    </div>
  );
}
