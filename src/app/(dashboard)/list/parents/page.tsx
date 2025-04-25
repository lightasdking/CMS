
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Parent, Prisma, Student } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type ParentList = Parent & { students: Student[] };

const ParentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Student Names",
      accessor: "students",
      className: "hidden md:table-cell",
    },
    {
      header: "Phone",
      accessor: "phone",
      className: "hidden lg:table-cell",
    },
    {
      header: "Address",
      accessor: "address",
      className: "hidden lg:table-cell",
    },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: ParentList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="inline-flex items-center gap-4 p-4">
        <section className="inline-flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.email || ""}</p>
        </section>
      </td>
      <td className="hidden md:table-cell">
        {item.students.reduce((acc, student, i) => acc + (i > 0 ? "," : "") + student.name, "")}
      </td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <section className="inline-flex items-center gap-2">
          {role === "admin" ? (
            <div>
              <FormContainer table="parent" type="update" data={item} />
              <FormContainer table="parent" type="delete" id={item.id} />
            </div>
          ) : null}
        </section>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? Number(page) : 1;

  // QUERY CONSTRUCTION
  const query: Prisma.ParentWhereInput = {};

  const applySearchFilter = () => {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value && key === "search") {
        query.name = { contains: value };
      }
    });
  };

  applySearchFilter();

  const fetchParents = async () => {
    const parents = await prisma.parent.findMany({
      where: query,
      include: { students: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    });
    const total = await prisma.parent.count({ where: query });
    return { parents, total };
  };

  const { parents: data, total: count } = await fetchParents();

  const renderHeader = () => (
    <header className="inline-flex items-center justify-between w-full">
      <h1 className="hidden md:inline text-lg font-semibold">All Parents</h1>
      <section className="flex flex-col md:inline-flex md:flex-row items-center gap-4 w-full md:w-auto">
        <TableSearch />
        <div className="inline-flex items-center gap-4 self-end">
          <button className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-lamaYellow">
            <Image src="/filter.png" alt="" width={14} height={14} />
          </button>
          <button className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-lamaYellow">
            <Image src="/sort.png" alt="" width={14} height={14} />
          </button>
          {role === "admin" && <FormContainer table="parent" type="create" />}
        </div>
      </section>
    </header>
  );

  const renderContent = () => (
    <div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <section>
        <Pagination page={p} count={count} />
      </section>
    </div>
  );

  return (
    <main className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {renderHeader()}
      {renderContent()}
    </main>
  );
};

export default ParentListPage;