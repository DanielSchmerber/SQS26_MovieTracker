import {
    Pagination,
    PaginationContent, PaginationEllipsis, PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "#/components/ui/pagination.tsx";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    setPage: (page: number) => void;
    pageRange: number;
}

export function PaginationBar({ currentPage, totalPages, setPage, pageRange=3  }: PaginationProps) {

    const hasNext = currentPage < totalPages;
    const hasPrevious = currentPage > 0;

    const navigateNextPage = setPage.bind(null, currentPage +1);
    const navigatePreviousPage = setPage.bind(null, currentPage -1);

    const pages = []
    for (let i = Math.max(1,currentPage-pageRange); i <= Math.min(totalPages,currentPage+pageRange); i++) {
        pages.push(i)
    }



    return <>
        <Pagination>
            <PaginationContent>



                {hasPrevious && <PaginationPrevious onClick={navigatePreviousPage}></PaginationPrevious>}
                {currentPage > pageRange+1 && <>
                    <PaginationItem>
                        <PaginationLink
                            onClick={setPage.bind(null,1)}>
                            {1}
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationEllipsis></PaginationEllipsis>
                </>}
                {pages.map((page, _) => <>
                    <PaginationItem>
                        <PaginationLink
                            isActive={currentPage === page}
                            onClick={setPage.bind(null,page)}>
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                </>)}
                {currentPage < totalPages - pageRange && <>
                    <PaginationEllipsis></PaginationEllipsis>
                    <PaginationItem>
                        <PaginationLink
                            onClick={setPage.bind(null,totalPages)}>
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>

                </>}
                {hasNext && <PaginationNext onClick={navigateNextPage}></PaginationNext>}
            </PaginationContent>
        </Pagination>
    </>

}