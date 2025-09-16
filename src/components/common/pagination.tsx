import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { IPaginationProps } from "@/types/props.types";


const CustomPagination: React.FC<IPaginationProps> = ({totalPages,currentPage,setCurrentPage}) => {


  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Pagination className="p-2 w-full">
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              goToPage(currentPage - 1);
            }}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {/* Page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          // Only show 1, currentPage, neighbors, last + ellipsis
          if (
            page === 1 ||
            page === totalPages ||
            (page > currentPage - 1 && page < currentPage + 1)
          ) {
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  className="select-none"
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    goToPage(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          }

          // Add ellipsis
          if (page === currentPage - 1 || page === currentPage + 1) {
            return (
              <PaginationItem key={`ellipsis-${page}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return null;
        })}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault();
              goToPage(currentPage + 1);
            }}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
