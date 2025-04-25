import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from 'next/image';
import Link from "next/link";
import FormModal from "@/components/FormModal";
import { Announcement, Class, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { currentUserId } from "@/lib/utils";
import { role } from "@/lib/data";

type AnnouncementList = Announcement & { class: Class };

const columns = [
    {
        header: 'Title',
        accessor: "title",
    },
    {
        header: 'Class',
        accessor: "class",
    },
    {
        header: "Date",
        accessor: "date",
        className: "hidden md:table-cell"
    },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
];

const renderRow = (item: AnnouncementList) => (
    <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
        <td className="inline-flex items-center gap-4 p-4">{item.title}</td>
        <td>{item.class ? item.class.name : "-"}</td>
        <td className="hidden md:table-cell">{item.date.toLocaleDateString("en-US")}</td>
        <td>
            <section className="inline-flex items-center gap-2">
                {role === "admin" ? (
                    <div>
                        <FormModal table="announcement" type="update" data={item} />
                        <FormModal table="announcement" type="delete" id={item.id} />
                    </div>
                ) : null}
            </section>
        </td>
    </tr>
);

const AnnouncementListPage = async ({ searchParams }: {
    searchParams: { [key: string]: string | undefined };
}) => {
    const { sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    const { page, ...queryParams } = searchParams;
    const p = page ? Number(page) : 1;

    // QUERY CONSTRUCTION
    const query: Prisma.AnnouncementWhereInput = {};

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

    query.OR = [
        { classId: null },
        {
            class: roleConditions[role as keyof typeof roleConditions] || {},
        },
    ];

    const fetchAnnouncements = async () => {
        const announcements = await prisma.announcement.findMany({
            where: query,
            include: { class: true },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        });
        const total = await prisma.announcement.count({ where: query });
        return { announcements, total };
    };

    const { announcements: data, total: count } = await fetchAnnouncements();

    const renderHeader = () => (
        <header className="inline-flex items-center justify-between w-full">
            <h1 className="hidden md:inline text-lg font-semibold">All Announcements</h1>
            <section className="flex flex-col md:inline-flex md:flex-row items-center gap-4 w-full md:w-auto">
                <TableSearch />
                <div className="inline-flex items-center gap-4 self-end">
                    <button className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-lamaYellow">
                        <Image src="/filter.png" alt="" width={14} height={14} />
                    </button>
                    <button className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-lamaYellow">
                        <Image src="/sort.png" alt="" width={14} height={14} />
                    </button>
                    {role === "admin" && <FormModal table="announcement" type="create" />}
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
}

export default AnnouncementListPage;