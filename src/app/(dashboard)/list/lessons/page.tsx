import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Lesson, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "@/components/FormContainer";

type LessonList = Lesson & { subject: Subject } & { class: Class } & {
  teacher: Teacher;
};

const LessonListPage = async ({
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
      header: "Class",
      accessor: "class",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: LessonList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="inline-flex items-center gap-4 p-4">{item.subject.name}</td>
      <td>{item.class.name}</td>
      <td className="hidden md:table-cell">
        {`${item.teacher.name} ${item.teacher.surname}`}
      </td>
      <td>
        <section className="inline-flex items-center gap-2">
          {role === "admin" ? (
            <div className="inline-flex items-center gap-2">
              <FormContainer table="lesson" type="update" data={item} />
              <FormContainer table="lesson" type="delete" id={item.id} />
            </div>
          ) : null}
        </section>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? Number(page) : 1;

  // QUERY CONSTRUCTION
  const query: Prisma.LessonWhereInput = {};

  const applyFilters = () => {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) {
        if (key === "classId") {
          query.classId = Number(value);
        } else if (key === "teacherId") {
          query.teacherId = value;
        } else if (key === "search") {
          query.OR = [
            { subject: { name: { contains: value } } },
            { teacher: { name: { contains: value } } },
          ];
        }
      }
    });
  };

  applyFilters();

  const testDatabaseConnection = async () => {
    try {
      // Just try to count records to see if we can access the table
      await prisma.lesson.count();
      console.log("Database connection successful - can access lessons table");
      return true;
    } catch (error) {
      console.error("Database connection error:", error);
      return false;
    }
  };

  await testDatabaseConnection();

  const fetchLessons = async () => {
    try {
      console.log("Query conditions:", JSON.stringify(query, null, 2));
      
      // First try to get any lessons at all to verify the table has data
      const allLessons = await prisma.lesson.findMany({
        take: 5, // Just get a few to verify data exists
      });
      
      console.log("Database has lessons:", allLessons.length > 0, "Count:", allLessons.length);
      
      const lessons = await prisma.lesson.findMany({
        where: query,
        include: {
          subject: { select: { name: true } },
          class: { select: { name: true } },
          teacher: { select: { name: true, surname: true } },
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
      });
      
      console.log("Filtered lessons count:", lessons.length);
      
      const total = await prisma.lesson.count({ where: query });
      
      if (lessons.length === 0) {
        console.log("No lessons found with the current query. Returning all lessons instead.");
        return { 
          lessons: allLessons.map(lesson => ({
            ...lesson,
            subject: { name: "Subject data missing" },
            class: { name: "Class data missing" },
            teacher: { name: "Teacher", surname: "missing" }
          })),
          total: allLessons.length 
        };
      }
      
      return { lessons, total };
    } catch (error) {
      console.error("Error fetching lessons:", error);
      return { lessons: [], total: 0 };
    }
  };

  const { lessons: data, total: count } = await fetchLessons();

  const renderHeader = () => (
    <header className="inline-flex items-center justify-between w-full">
      <h1 className="hidden md:inline text-lg font-semibold">All Lessons</h1>
      <section className="flex flex-col md:inline-flex md:flex-row items-center gap-4 w-full md:w-auto">
        <TableSearch />
        <div className="inline-flex items-center gap-4 self-end">
          <button className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-lamaYellow">
            <Image src="/filter.png" alt="" width={14} height={14} />
          </button>
          <button className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-lamaYellow">
            <Image src="/sort.png" alt="" width={14} height={14} />
          </button>
          {role === "admin" && <FormContainer table="lesson" type="create" />}
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

export default LessonListPage;