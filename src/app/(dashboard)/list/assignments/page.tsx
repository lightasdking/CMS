// import FormModal from "@/components/FormModal";
// import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import TableSearch from "@/components/TableSearch";
// import prisma from "@/lib/prisma";
// import { ITEM_PER_PAGE } from "@/lib/settings";
// import { Assignment, Class, Prisma, Subject, Teacher } from "@prisma/client";
// import Image from "next/image";
// import { auth } from "@clerk/nextjs/server";

// type AssignmentList = Assignment & {
//   lesson: {
//     subject: Subject;
//     class: Class;
//     teacher: Teacher;
//   };
// };

// const AssignmentListPage = async ({
//   searchParams,
// }: {
//   searchParams: { [key: string]: string | undefined };
// }) => {

//   const { userId, sessionClaims } = await auth();
//   const role = (sessionClaims?.metadata as { role?: string })?.role;
//   const currentUserId = userId;
  
  
//   const columns = [
//     {
//       header: "Subject Name",
//       accessor: "name",
//     },
//     {
//       header: "Class",
//       accessor: "class",
//     },
//     {
//       header: "Teacher",
//       accessor: "teacher",
//       className: "hidden md:table-cell",
//     },
//     {
//       header: "Due Date",
//       accessor: "dueDate",
//       className: "hidden md:table-cell",
//     },
//     ...(role === "admin" || role === "teacher"
//       ? [
//           {
//             header: "Actions",
//             accessor: "action",
//           },
//         ]
//       : []),
//   ];
  
//   const renderRow = (item: AssignmentList) => (
//     <tr
//       key={item.id}
//       className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
//     >
//       <td className="flex items-center gap-4 p-4">{item.lesson.subject.name}</td>
//       <td>{item.lesson.class.name}</td>
//       <td className="hidden md:table-cell">
//         {item.lesson.teacher.name + " " + item.lesson.teacher.surname}
//       </td>
//       <td className="hidden md:table-cell">
//         {new Intl.DateTimeFormat("en-US").format(item.dueDate)}
//       </td>
//       <td>
//         <div className="flex items-center gap-2">
//           {(role === "admin" || role === "teacher") && (
//             <>
//               <FormModal table="assignment" type="update" data={item} />
//               <FormModal table="assignment" type="delete" id={item.id} />
//             </>
//           )}
//         </div>
//       </td>
//     </tr>
//   );

//   const { page, ...queryParams } = searchParams;

//   const p = page ? parseInt(page) : 1;

//   // URL PARAMS CONDITION

//   const query: Prisma.AssignmentWhereInput = {};

//   query.lesson = {};

//   if (queryParams) {
//     for (const [key, value] of Object.entries(queryParams)) {
//       if (value !== undefined) {
//         switch (key) {
//           case "classId":
//             query.lesson.classId = parseInt(value);
//             break;
//           case "teacherId":
//             query.lesson.teacherId = value;
//             break;
//           case "search":
//             query.lesson.subject = {
//               name: { contains: value},
//             };
//             break;
//           default:
//             break;
//         }
//       }
//     }
//   }

//   // ROLE CONDITIONS

//   switch (role) {
//     case "admin":
//       break;
//     case "teacher":
//       query.lesson.teacherId = currentUserId!;
//       break;
//     case "student":
//       query.lesson.class = {
//         students: {
//           some: {
//             id: currentUserId!,
//           },
//         },
//       };
//       break;
//     case "parent":
//       query.lesson.class = {
//         students: {
//           some: {
//             parentId: currentUserId!,
//           },
//         },
//       };
//       break;
//     default:
//       break;
//   }

//   const [data, count] = await prisma.$transaction([
//     prisma.assignment.findMany({
//       where: query,
//       include: {
//         lesson: {
//           select: {
//             subject: { select: { name: true } },
//             teacher: { select: { name: true, surname: true } },
//             class: { select: { name: true } },
//           },
//         },
//       },
//       take: ITEM_PER_PAGE,
//       skip: ITEM_PER_PAGE * (p - 1),
//     }),
//     prisma.assignment.count({ where: query }),
//   ]);
//   return (
//     <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//       {/* TOP */}
//       <div className="flex items-center justify-between">
//         <h1 className="hidden md:block text-lg font-semibold">
//           All Assignments
//         </h1>
//         <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
//           <TableSearch />
//           <div className="flex items-center gap-4 self-end">
//             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
//               <Image src="/filter.png" alt="" width={14} height={14} />
//             </button>
//             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
//               <Image src="/sort.png" alt="" width={14} height={14} />
//             </button>
//             {role === "admin" ||
//               (role === "teacher" && (
//                 <FormModal table="assignment" type="create" />
//               ))}
//           </div>
//         </div>
//       </div>
//       {/* LIST */}
//       <Table columns={columns} renderRow={renderRow} data={data} />
//       {/* PAGINATION */}
//       <Pagination page={p} count={count} />
//     </div>
//   );
// };

// export default AssignmentListPage;

import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { Assignment, Class, Prisma } from "@prisma/client";
import Image from "next/image";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
// Remove currentUserId import since it's not exported from utils
// Instead we'll use the userId from auth() directly

type AssignmentList = Assignment & { class: Class };

const AssignmentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Class",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Due Date",
      accessor: "dueDate",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "teacher" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: AssignmentList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="inline-flex items-center gap-4 p-4">{item.title}</td>
      <td className="hidden md:table-cell">{item.class.name}</td>
      <td className="hidden md:table-cell">{new Date(item.dueDate).toLocaleDateString()}</td>
      <td>
        <section className="inline-flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <div>
              <FormModal table="assignment" type="update" data={item} />
              <FormModal table="assignment" type="delete" id={item.id} />
            </div>
          )}
        </section>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? Number(page) : 1;

  // QUERY CONSTRUCTION
  const query: Prisma.AssignmentWhereInput = {};

  const applySearchFilter = () => {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value && key === "search") {
        query.title = { contains: value };
      }
    });
  };

  applySearchFilter();

  // ROLE-BASED FILTERS
  const roleConditions = {
    teacher: { lessons: { some: { teacherId: currentUserId! } } },
    student: { students: { some: { id: currentUserId! } } },
    parent: { students: { some: { parentId: currentUserId! } } },
  };

  if (role !== "admin") {
    query.class = roleConditions[role as keyof typeof roleConditions] || {};
  }

  const fetchAssignments = async () => {
    const assignments = await prisma.assignment.findMany({
      where: query,
      include: { class: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    });
    const total = await prisma.assignment.count({ where: query });
    return { assignments, total };
  };

  const { assignments: data, total: count } = await fetchAssignments();

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <header className="inline-flex items-center justify-between w-full">
        <h1 className="hidden md:inline text-lg font-semibold">All Assignments</h1>
        <section className="flex flex-col md:inline-flex md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="inline-flex items-center gap-4 self-end">
            <button className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher") && (
              <FormModal table="assignment" type="create" />
            )}
          </div>
        </section>
      </header>
      <div>
        <Table columns={columns} renderRow={renderRow} data={data} />
        <section>
          <Pagination page={p} count={count} />
        </section>
      </div>
    </div>
  );
};

export default AssignmentListPage;
