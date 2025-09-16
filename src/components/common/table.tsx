import type { IPaginationProps } from "@/types/props.types";
import PaginationComponent from "./pagination";

interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  className?: string;
}

// Table component props
interface TableProps<T> extends Partial<IPaginationProps> {
  data: T[];
  columns: TableColumn<T>[];
  className?: string;
}

// Simple reusable table component
const Table = <T extends Record<string, any>>({
  data,
  columns,
  className = "",
  currentPage,
  setCurrentPage,
  totalPages,
}: TableProps<T>) => {
  return (
    <>
      <div
        className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}
      >
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ${
                      column.className || ""
                    }`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-900 text-xs sm:text-sm"
                    >
                      {column.render
                        ? column.render(item[column.key], item)
                        : String(item[column.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center  w-full">
          {currentPage && setCurrentPage && totalPages && (
            <PaginationComponent
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Table;
