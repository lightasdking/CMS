
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "@/components/FormContainer";

type ResultList = {
  id: number;
  title: string;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  teacherSurname: string;
  score: number;
  className: string;
  startTime: Date;
};

const ResultListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Student",
      accessor: "student",
    },
    {
      header: "Score",
      accessor: "score",
      className: "hidden md:table-cell",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Class",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "teacher" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: ResultList | null) => {
    if (!item) return null;
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        <td className="inline-flex items-center gap-4 p-4">{item.title}</td>
        <td>{`${item.studentName} ${item.studentSurname}`}</td>
        <td className="hidden md:table-cell">{item.score}</td>
        <td className="hidden md:table-cell">{`${item.teacherName} ${item.teacherSurname}`}</td>
        <td className="hidden md:table-cell">{item.className}</td>
        <td className="hidden md:table-cell">{item.startTime.toLocaleDateString("en-US")}</td>
        <td>
          <section className="inline-flex items-center gap-2">
            {role === "admin" || role === "teacher" ? (
              <div>
                <FormContainer table="result" type="update" data={item} />
                <FormContainer table="result" type="delete" id={item.id} />
              </div>
            ) : null}
          </section>
        </td>
      </tr>
    );
  };

  const { page, ...queryParams } = searchParams;
  const p = page ? Number(page) : 1;

  // QUERY CONSTRUCTION
  const query: Prisma.ResultWhereInput = {};

  const applyFilters = () => {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) {
        if (key === "studentId") {
          query.studentId = value;
        } else if (key === "search") {
          query.OR = [
            { exam: { title: { contains: value } } },
            { student: { name: { contains: value } } },
          ];
        }
      }
    });
  };

  applyFilters();

  // ROLE-BASED FILTERS
  const setRoleFilters = () => {
    if (role === "teacher") {
      query.OR = [
        { exam: { lesson: { teacherId: currentUserId! } } },
        { assignment: { lesson: { teacherId: currentUserId! } } },
      ];
    } else if (role === "student") {
      query.studentId = currentUserId!;
    } else if (role === "parent") {
      query.student = { parentId: currentUserId! };
    }
  };

  if (role !== "admin") {
    setRoleFilters();
  }

  const fetchResults = async () => {
    const results = await prisma.result.findMany({
      where: query,
      include: {
        student: { select: { name: true, surname: true } },
        exam: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
        assignment: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    });
    const total = await prisma.result.count({ where: query });
    return { results, total };
  };

  const { results: dataRes, total: count } = await fetchResults();

  const data = dataRes 
    .map((item) => {
      const assessment = item.exam || item.assignment;
      if (!assessment) return null;
      return {
        id: item.id,
        title: assessment.title,
        studentName: item.student.name,
        studentSurname: item.student.surname,
        teacherName: assessment.lesson.teacher.name,
        teacherSurname: assessment.lesson.teacher.surname,
        score: item.score,
        className: assessment.lesson.class.name,
        startTime: "startTime" in assessment ? assessment.startTime : assessment.startDate,
      };
    })
    .filter((item): item is ResultList => item !== null);

  const renderHeader = () => (
    <header className="inline-flex items-center justify-between w-full">
      <h1 className="hidden md:inline text-lg font-semibold">All Results</h1>
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
            <FormContainer table="result" type="create" />
          )}
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

export default ResultListPage;