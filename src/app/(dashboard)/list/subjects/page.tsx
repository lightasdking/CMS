import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type SubjectList = Subject & { teachers: Teacher[] };

const SubjectListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    {
      header: "Subject Name",
      accessor: "name",
    },
    {
      header: "Teachers",
      accessor: "teachers",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
    },
  ];

  const renderRow = (item: SubjectList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="inline-flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden md:table-cell">
        {item.teachers.length > 0 ? item.teachers.map((teacher) => teacher.name).join(",") : "-"}
      </td>
      <td>
        <section className="inline-flex items-center gap-2">
          {role === "admin" ? (
            <div className="inline-flex items-center gap-2">
              <FormContainer table="subject" type="update" data={item} />
              <FormContainer table="subject" type="delete" id={item.id} />
            </div>
          ) : null}
        </section>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? Number(page) : 1;

  // QUERY CONSTRUCTION
  const query: Prisma.SubjectWhereInput = {};

  const applySearchFilter = () => {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value && key === "search") {
        query.name = { contains: value };
      }
    });
  };

  applySearchFilter();

  const fetchSubjects = async () => {
    const subjects = await prisma.subject.findMany({
      where: query,
      include: { teachers: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    });
    const total = await prisma.subject.count({ where: query });
    return { subjects, total };
  };

  const { subjects: data, total: count } = await fetchSubjects();

  const renderHeader = () => (
    <header className="inline-flex items-center justify-between w-full">
      <h1 className="hidden md:inline text-lg font-semibold">All Subjects</h1>
      <section className="flex flex-col md:inline-flex md:flex-row items-center gap-4 w-full md:w-auto">
        <TableSearch />
        <div className="inline-flex items-center gap-4 self-end">
          <button className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-lamaYellow">
            <Image src="/filter.png" alt="" width={14} height={14} />
          </button>
          <button className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-lamaYellow">
            <Image src="/sort.png" alt="" width={14} height={14} />
          </button>
          {role === "admin" ? <FormContainer table="subject" type="create" /> : null}
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
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {renderHeader()}
      {renderContent()}
    </div>
  );
};

export default SubjectListPage; 