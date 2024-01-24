import { TriangleLeftIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const pathnames = ['control', 'menu', 'user'];

export default function AdminSideBar() {
  return (
    <div className="relative flex h-full z-10">
      <input
        type="checkbox"
        id={'admin-sidebar'}
        className="peer/check"
        defaultChecked
        hidden
      />
      <div className="absolute w-48 bg-primary h-full peer-checked/check:w-0 peer-checked/check:[&>*]:hidden gap-3 transition-all">
        {pathnames.map((pathname) => (
          <Link key={pathname} href={`/admin/${pathname}`}>
            <Button className="w-full peer-checked/check:hidden rounded-none">
              {pathname.toUpperCase()}
            </Button>
          </Link>
        ))}
      </div>
      <label
        htmlFor="admin-sidebar"
        className="absolute -top-10 -right-8 bg-slate-200 rounded-full peer-checked/check:rotate-180  hover:cursor-pointer transition-all"
      >
        <TriangleLeftIcon width={30} height={30} />
      </label>
    </div>
  );
}
