import type { IPaginationProps } from "@/types/props.types";
import PaginationComponent from "./Pagination";
import SelectTag from "./Select";

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
  setItemsPerPage?: React.Dispatch<React.SetStateAction<string>>;
  itemsPerPage?: string;
}

// Simple reusable table component
const Table = <T extends Record<string, any>>({
  data,
  columns,
  className = "",
  currentPage,
  setCurrentPage,
  totalPages,
  setItemsPerPage,
  itemsPerPage,
}: TableProps<T>) => {
  return (
    <>
      <div className={`bg-white shadow-md rounded-lg  max-w-full ${className}`}>
        <div className="overflow-x-auto w-full">
          <table className="overflow-x-scroll w-full ">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider break-words ${
                      column.className || ""
                    }`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 ">
              {data.map((item, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-gray-900 text-[11px] sm:text-xs md:text-sm break-words"
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

        {data.length > 0 ? (
          <div className="flex justify-between items-center py-2 w-full sm:px-5">
            {itemsPerPage !== undefined && setItemsPerPage && (
              <div className="w-[15%]">
                <SelectTag
                  options={[
                    { label: "4", value: "4" },
                    { label: "5", value: "5" },
                    { label: "6", value: "6" },
                    { label: "7", value: "7" },
                  ]}
                  name="itemPerPage"
                  label="Items Per Page"
                  placeholder="Items Per Page"
                  value={itemsPerPage}
                  handleChange={(value) => setItemsPerPage(value)}
                />
              </div>
            )}
            {currentPage && setCurrentPage && totalPages && (
              <PaginationComponent
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-9 w-full">
            No matching data found
          </p>
        )}
      </div>
    </>
  );
};

export default Table;
