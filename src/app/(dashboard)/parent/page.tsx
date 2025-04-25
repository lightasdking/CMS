import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const ParentPage = async () => {
  const { userId } = await auth();
  const currentUserId = userId;

  const students = await prisma.student.findMany({
    where: {
      parentId: currentUserId!,
    },
  });

  return (
    <div className="flex flex-col xl:flex-row gap-4 p-4">
      {/* LEFT: Calendar for each student */}
      <div className="flex flex-col gap-4 flex-1">
        {students.map((student) => (
          <div key={student.id} className="bg-white p-4 rounded-md shadow">
            <h1 className="text-xl font-semibold mb-2">
              Schedule ({student.name} {student.surname})
            </h1>
            <BigCalendarContainer type="classId" id={student.classId} />
          </div>
        ))}
      </div>

      {/* RIGHT: Announcements */}
      <div className="w-full xl:w-[400px] flex-shrink-0">
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
