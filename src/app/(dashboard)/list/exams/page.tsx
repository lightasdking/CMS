import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Exam, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "@/components/FormContainer";

type ExamList = Exam & {
  lesson: {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
};

const ExamListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const columns = [
    {
      header: "Subject Name",
      accessor: "name",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "teacher" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: ExamList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="inline-flex items-center gap-4 p-4">{item.lesson.subject.name}</td>
      <td>{item.lesson.class.name}</td>
      <td className="hidden md:table-cell">
        {`${item.lesson.teacher.name} ${item.lesson.teacher.surname}`}
      </td>
      <td className="hidden md:table-cell">
        {item.startTime.toLocaleDateString("en-US")}
      </td>
      <td>
        <section className="inline-flex items-center gap-2">
          {role === "admin" || role === "teacher" ? (
            <div className="inline-flex items-center gap-2">
              <FormContainer table="exam" type="update" data={item} />
              <FormContainer table="exam" type="delete" id={item.id} />
            </div>
          ) : null}
        </section>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? Number(page) : 1;

  // QUERY CONSTRUCTION
  const query: Prisma.ExamWhereInput = { lesson: {} };

  const applyFilters = () => {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) {
        if (key === "classId") {
          query.lesson!.classId = Number(value);
        } else if (key === "teacherId") {
          query.lesson!.teacherId = value;
        } else if (key === "search") {
          query.lesson!.subject = { name: { contains: value } };
        }
      }
    });
  };

  applyFilters();

  // ROLE-BASED FILTERS
  const setRoleFilters = () => {
    if (role === "teacher") {
      query.lesson!.teacherId = currentUserId!;
    } else if (role === "student") {
      query.lesson!.class = { students: { some: { id: currentUserId! } } };
    } else if (role === "parent") {
      query.lesson!.class = { students: { some: { parentId: currentUserId! } } };
    }
  };

  if (role !== "admin") {
    setRoleFilters();
  }

  const fetchExams = async () => {
    const exams = await prisma.exam.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            subject: { select: { name: true } },
            teacher: { select: { name: true, surname: true } },
            class: { select: { name: true } },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    });
    const total = await prisma.exam.count({ where: query });
    return { exams, total };
  };

  const { exams: data, total: count } = await fetchExams();

  const renderHeader = () => (
    <header className="inline-flex items-center justify-between w-full">
      <h1 className="hidden md:inline text-lg font-semibold">All Exams</h1>
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
            <FormContainer table="exam" type="create" />
          )}
        </div>
      </section>
    </header>
  );

  const renderContent = () => (
    <div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={count} />
    </div>
  );

  return (
    <main className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {renderHeader()}
      {renderContent()}
    </main>
  );
};

export default ExamListPage;