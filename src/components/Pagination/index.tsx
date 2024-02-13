'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type PaginationProps<T> = {
  href: string;
  slug: number;
  totalPage?: number;
  chunk?: number;
} & (T extends string ? Record<T, string | undefined> : {});

/** 5단위로 끊어서 보여줄 예정 */
export default function Paginations<T>({
  href,
  slug,
  totalPage,
  chunk = 5,
  ...props
}: PaginationProps<T>) {
  const searchParams = new URLSearchParams(Object.entries(props)).toString();
  const calculatedHref = `${href}?${searchParams.length !== 0 ? `${searchParams}&` : ''}`;
  const startPage = Math.floor((slug - 1) / chunk) * chunk + 1;
  const endOfPagination = totalPage && startPage + chunk > totalPage;
  const pageCount = endOfPagination ? totalPage % chunk : chunk;
  const linkArray = Array.from(
    { length: pageCount },
    (_, index) => startPage + index,
  );
  return (
    <Pagination className="overflow-hidden">
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst
            disabled={slug === 1}
            href={`${calculatedHref}slug=1`}
          />
        </PaginationItem>
        {slug > 1 && (
          <PaginationItem>
            <PaginationPrevious href={`${calculatedHref}slug=${slug - 1}`} />
          </PaginationItem>
        )}
        {slug > chunk && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {linkArray.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={page === slug}
              href={`${calculatedHref}slug=${page}`}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {!endOfPagination && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {!totalPage ||
          (slug < totalPage && (
            <PaginationItem>
              <PaginationNext href={`${calculatedHref}slug=${slug + 1}`} />
            </PaginationItem>
          ))}
        <PaginationItem>
          <PaginationLast href={`${calculatedHref}slug=${totalPage}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
