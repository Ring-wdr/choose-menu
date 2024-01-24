import clsx from 'clsx';

import BS from '@/components/BottomSheet';

import styles from './bottomsheet.module.css';

type MenuBottomSheetProps = React.ComponentProps<typeof BS>;

export default function CustomBottomSheet({
  children,
  ...props
}: MenuBottomSheetProps) {
  return (
    <BS {...props}>
      <BS.BottomSheet>
        <div className={clsx(styles.bottomSheet, 'dark:bg-black')}>
          <BS.Handle className={styles.handle} />
          <div className={styles.children}>{children}</div>
        </div>
      </BS.BottomSheet>
    </BS>
  );
}
