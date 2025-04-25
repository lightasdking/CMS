import prisma from "@/lib/prisma";
import BigCalendar from "@/components/BigCalendar";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  try {
    // Fetch lessons including subject information
    const lessons = await prisma.lesson.findMany({
      where: {
        ...(type === "teacherId"
          ? { teacherId: id as string }
          : { classId: id as number }),
      },
      include: {
        subject: true,
        class: true,
      },
    });

    if (lessons.length === 0) {
      return (
        <div className="h-full flex items-center justify-center bg-gray-50 border rounded-md">
          <div className="text-center p-8">
            <h3 className="text-lg font-medium text-gray-600 mb-2">No lessons scheduled</h3>
            <p className="text-gray-500 text-sm">
              {type === "teacherId" 
                ? "This teacher doesn't have any lessons scheduled yet." 
                : "This class doesn't have any lessons scheduled yet."}
            </p>
          </div>
        </div>
      );
    }

    // Process all lessons
    const processedLessons = lessons.flatMap((lesson) => {
      const baseTitle = `${lesson.subject.name}${lesson.name ? ` - ${lesson.name}` : ''}`;
      const title = type === "teacherId" 
        ? `${baseTitle} (${lesson.class.name})` 
        : baseTitle;
      
      // Treat all lessons as single events for now to avoid TypeScript errors
      return [{
        title,
        start: lesson.startTime,
        end: lesson.endTime,
        resourceId: lesson.id,
      }];
    });

    const schedule = adjustScheduleToCurrentWeek(processedLessons);

    return (
      <div className="h-full">
        <BigCalendar data={schedule} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching timetable data:", error);
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 border rounded-md">
        <div className="text-center p-8">
          <h3 className="text-lg font-medium text-red-600 mb-2">Error loading timetable</h3>
          <p className="text-gray-500 text-sm">
            There was a problem loading the timetable. Please try again later.
          </p>
        </div>
      </div>
    );
  }
};

export default BigCalendarContainer;
