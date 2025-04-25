"use client";
import Image from "next/image";
import prisma from "@/lib/prisma";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";

const AttendanceOverview = () => {
  const [attendanceStats, setAttendanceStats] = useState<
    { day: string; present: number; absent: number }[]
  >([]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      const today = new Date();
      const currentDay = today.getDay();
      const mondayOffset = currentDay === 0 ? 6 : currentDay - 1;

      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - mondayOffset);
      weekStart.setHours(0, 0, 0, 0);

      const response = await prisma.attendance.findMany({
        where: {
          date: {
            gte: weekStart,
          },
        },
        select: {
          date: true,
          present: true,
        },
      });

      const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
      const attendanceSummary: Record<
        string,
        { present: number; absent: number }
      > = weekdays.reduce((acc, day) => {
        acc[day] = { present: 0, absent: 0 };
        return acc;
      }, {} as any);

      response.forEach((entry) => {
        const entryDate = new Date(entry.date);
        const weekday = entryDate.getDay();
        if (weekday >= 1 && weekday <= 5) {
          const key = weekdays[weekday - 1];
          entry.present
            ? attendanceSummary[key].present++
            : attendanceSummary[key].absent++;
        }
      });

      const transformedData = weekdays.map((day) => ({
        day,
        present: attendanceSummary[day].present,
        absent: attendanceSummary[day].absent,
      }));

      setAttendanceStats(transformedData);
    };

    fetchAttendanceData();
  }, []);

  return (
    <section className="bg-white p-5 rounded-xl shadow-md h-full">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-700">Weekly Attendance</h2>
        <Image src="/moreDark.png" alt="options" width={20} height={20} />
      </header>

      {attendanceStats.length === 0 ? (
        <p className="text-center text-gray-500">No attendance records found for this week.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={attendanceStats} barSize={24}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value: number, name: string) =>
                [`${value} students`, name.charAt(0).toUpperCase() + name.slice(1)]
              }
              contentStyle={{ borderRadius: "8px", borderColor: "#e5e7eb" }}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar
              dataKey="present"
              fill="#A5D6A7"
              radius={[6, 6, 0, 0]}
              name="Present"
              legendType="circle"
            />
            <Bar
              dataKey="absent"
              fill="#EF9A9A"
              radius={[6, 6, 0, 0]}
              name="Absent"
              legendType="circle"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  );
};

export default AttendanceOverview;
