import { type ColumnDef } from '@tanstack/react-table';

import { Table } from './Table';

function generateRandomData(count = 500) {
   const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Eve', 'Grace', 'Tom', 'Emily', 'David'];
   const lastNames = [
      'Smith',
      'Johnson',
      'Williams',
      'Brown',
      'Jones',
      'Garcia',
      'Miller',
      'Davis',
      'Martinez',
      'Hernandez',
   ];
   const statuses = ['Single', 'Married', 'Divorced', 'Complicated'];

   const getRandomElement = (array: string[]) => array[Math.floor(Math.random() * array.length)];
   const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

   const data = Array.from({ length: count }, (_, index) => {
      return {
         no: index + 1,
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
const randomData = generateRandomData(150000);

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
      accessorKey: 'checkbox',
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
   {
      accessorKey: 'no',
      header: 'No',

      enableResizing: true,
      minSize: 80,
   },
   {
      accessorKey: 'firstName',
      header: 'First Name',

      enableResizing: true,
      minSize: 120,
   },
   {
      accessorKey: 'lastName',
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
      accessorKey: 'age',
      header: 'Age',
      minSize: 80,
   },
   {
      accessorKey: 'visits',
      header: 'Visits',
      minSize: 40,
   },
   {
      accessorKey: 'status',
      header: 'Status',
      minSize: 80,
      maxSize: 100,
   },
   {
      accessorKey: 'progress',
      header: 'Progress',
      size: 500,
      minSize: 80,
   },
   // columnHelper.accessor(row => row.lastName, {
   //   id: 'lastName',
   //   header: () => <span>Last Name</span>,
   // }),
   // columnHelper.accessor('age', {
   //   header: () => 'Age',
   //   cell: info => info.renderValue(),
   // }),
   // columnHelper.accessor('visits', {
   //   header: () => <span>Visits</span>,
   // }),
   // columnHelper.accessor('status', {
   //   header: 'Status',
   // }),
   // columnHelper.accessor('progress', {
   //   header: 'Profile Progress',
   // }),
];
export const TableTest = () => {
   console.log(randomData.length);
   return (
      <div style={{ padding: '60px' }}>
         <Table data={randomData} columns={columns} option={{ tableSize: { height: '500px' } }} />
      </div>
   );
};
