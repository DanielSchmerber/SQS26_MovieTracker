import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "#/components/ui/pagination.tsx";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    setPage: (page: number) => void;
    /** How many pages to show on each side of the current page. */
    pageRange?: number;
}

const ELLIPSIS = "ellipsis";

/**
 * Builds a compact list of page numbers with `ellipsis` placeholders, e.g.
 * `[1, "ellipsis", 4, 5, 6, "ellipsis", 20]`. The first and last pages are
 * always shown, plus a window of `pageRange` pages on each side of the
 * current page. Adjacent gaps collapse into a single page rather than an
 * ellipsis, so the row never grows unbounded.
 */
function buildPageRange(
    currentPage: number,
    totalPages: number,
    pageRange: number,
): Array<number | typeof ELLIPSIS> {
    const start = Math.max(2, currentPage - pageRange);
    const end = Math.min(totalPages - 1, currentPage + pageRange);

    const pages: Array<number | typeof ELLIPSIS> = [1];

    // A gap of exactly one page (e.g. page 2) is shown as the page itself.
    if (start > 3) {
        pages.push(ELLIPSIS);
    } else if (start === 3) {
        pages.push(2);
    }

    for (let page = start; page <= end; page++) {
        pages.push(page);
    }

    if (end < totalPages - 2) {
        pages.push(ELLIPSIS);
    } else if (end === totalPages - 2) {
        pages.push(totalPages - 1);
    }

    pages.push(totalPages);

    return pages;
}

export function PaginationBar({
    currentPage,
    totalPages,
    setPage,
    pageRange = 1,
}: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const pages = buildPageRange(currentPage, totalPages, pageRange);
    const isFirstPage = currentPage <= 1;
    const isLastPage = currentPage >= totalPages;

    return (
        <Pagination className="mt-8">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        aria-disabled={isFirstPage}
                        tabIndex={isFirstPage ? -1 : undefined}
                        className={isFirstPage ? "pointer-events-none opacity-50" : undefined}
                        onClick={(e) => {
                            e.preventDefault();
                            if (!isFirstPage) setPage(currentPage - 1);
                        }}
                    />
                </PaginationItem>

                {pages.map((page, index) =>
                    page === ELLIPSIS ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href="#"
                                isActive={page === currentPage}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage(page);
                                }}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ),
                )}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        aria-disabled={isLastPage}
                        tabIndex={isLastPage ? -1 : undefined}
                        className={isLastPage ? "pointer-events-none opacity-50" : undefined}
                        onClick={(e) => {
                            e.preventDefault();
                            if (!isLastPage) setPage(currentPage + 1);
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
