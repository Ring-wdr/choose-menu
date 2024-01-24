'use client';

import { useEffect, useRef } from 'react';
import { TriangleLeftIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const pathnames = ['control', 'menu', 'user'];

export default function AdminSideBar() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        sidebarRef.current &&
        checkboxRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        checkboxRef.current.checked = true;
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);
  return (
    <div className="relative flex h-full z-10" ref={sidebarRef}>
      <input
        type="checkbox"
        id={'admin-sidebar'}
        className="peer/check"
        defaultChecked
        hidden
        ref={checkboxRef}
      />
      <div className="absolute w-48 bg-primary da h-full peer-checked/check:w-0 peer-checked/check:[&>*]:hidden gap-3 transition-all invert">
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
        className="absolute -top-10 -right-8 bg-slate-200 rounded-full peer-checked/check:rotate-180  hover:cursor-pointer transition-all invert"
      >
        <TriangleLeftIcon width={30} height={30} />
      </label>
    </div>
  );
}
