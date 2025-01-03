import { type ColumnDef } from "@tanstack/react-table";

import { Table } from "./Table";
import { RowIndexColumn } from "./Column/RowIndexColumn";
import { TableContainer } from "./Container/TableContainer";
import { SearchTest } from "./SearchTest";

function generateRandomData(count = 500) {
  const firstNames = [
    "John",
    "Jane",
    "Alice",
    "Bob",
    "Charlie",
    "Eve",
    "Grace",
    "Tom",
    "Emily",
    "David",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Martinez",
    "Hernandez",
  ];
  const statuses = ["Single", "Married", "Divorced", null];

  const getRandomElement = (array: string[]) =>
    array[Math.floor(Math.random() * array.length)];
  const getRandomNumber = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const data = Array.from({ length: count }, () => {
    return {
      firstName: getRandomElement(firstNames),
      lastName: getRandomElement(lastNames),
      age: getRandomNumber(18, 80),
      visits: getRandomNumber(0, 1000),
      status: getRandomElement(statuses),
      progress: getRandomNumber(0, 100),
    };
  });

  return data;
}

// Example usage
const randomData = generateRandomData(50);

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const columns: ColumnDef<Person>[] = [
  // TODO: minSize, maxSize 속성 지우기
  {
    accessorKey: "checkbox",
    header: () => (
      <div className="dbmaster-checkbox">
        <input type="checkbox" />
      </div>
    ),
    cell: () => (
      <div className="dbmaster-checkbox">
        <input type="checkbox" />
      </div>
    ),
    size: 28,
    minSize: 28,
    enableResizing: false,
    enableSorting: false,
  },
  RowIndexColumn,
  {
    accessorKey: "firstName",
    header: "First Name",

    enableResizing: true,
    minSize: 120,
  },
  {
    accessorKey: "lastName",
    header: () => <button>Last Name</button>,
    cell: ({
      row: {
        original: { lastName },
      },
    }) => <button>{lastName}</button>,
    enableResizing: false,
    minSize: 80,
  },
  {
    accessorKey: "age",
    header: "Age",
    minSize: 80,
  },
  {
    accessorKey: "visits",
    header: "Visits",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 80,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "progress",
    header: "Progress",
    size: 500,
    enableGlobalFilter: false,
  },
];
export const TableTest = () => {
  console.log(randomData.length);
  return (
    <div style={{ padding: "60px" }}>
      <Table<Person>
        data={randomData}
        columns={columns}
        option={{ tableSize: { height: "500px" } }}
      >
        <SearchTest />
        <TableContainer />
      </Table>
    </div>
  );
};
