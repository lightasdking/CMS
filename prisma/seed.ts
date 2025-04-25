import { Day, PrismaClient, UserSex } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Delete all existing data in reverse order (to respect foreign key constraints)
  console.log("Cleaning up existing data...");
  try {
    await prisma.announcement.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.result.deleteMany({});
    await prisma.attendance.deleteMany({});
    await prisma.assignment.deleteMany({});
    await prisma.exam.deleteMany({});
    await prisma.lesson.deleteMany({});
    await prisma.student.deleteMany({});
    await prisma.parent.deleteMany({});
    await prisma.class.deleteMany({});
    await prisma.teacher.deleteMany({});
    await prisma.subject.deleteMany({});
    await prisma.grade.deleteMany({});
    await prisma.admin.deleteMany({});
    console.log("Cleanup completed successfully.");
  } catch (error) {
    console.error("Error during cleanup:", error);
  }

  console.log("Starting to seed data...");

  // ADMIN
  await prisma.admin.create({
    data: {
      id: "admin6",
      username: "admin6",
    },
  });

  // GRADE - Create grades first since classes depend on them
  console.log("Creating grades...");
  for (let i = 1; i <= 6; i++) {
    await prisma.grade.create({
      data: {
        level: i,
      },
    });
  }

  // SUBJECT - Create subjects before teachers since teachers need to reference subjects
  console.log("Creating subjects...");
  const subjectData = [
    { name: "Mathematics" },
    { name: "Science" },
    { name: "English" },
    { name: "History" },
    { name: "Geography" },
    { name: "Physics" },
    { name: "Chemistry" },
    { name: "Biology" },
    { name: "Computer Science" },
    { name: "Art" },
  ];

  for (const subject of subjectData) {
    await prisma.subject.create({ data: subject });
  }

  // TEACHER - Create teachers before classes, since classes need teachers as supervisors
  console.log("Creating teachers...");
  for (let i = 1; i <= 15; i++) {
    // Make sure subject IDs are within valid range (1-10)
    const subjectId = (i % 10) || 10; // Ensure it's 1-10, not 0
    
    await prisma.teacher.create({
      data: {
        id: `teacher${i}`,
        username: `teacher${i}`,
        name: `TName${i}`,
        surname: `TSurname${i}`,
        email: `teacher${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Address${i}`,
        bloodType: "A+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        subjects: { connect: [{ id: subjectId }] }, 
      },
    });
  }
  
  // CLASS - Create classes after grades and teachers
  console.log("Creating classes...");
  for (let i = 1; i <= 6; i++) {
    await prisma.class.create({
      data: {
        name: `${i}A`, 
        gradeId: i, 
        capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
        supervisorId: `teacher${i}`, // Connect supervisor after teacher creation
      },
    });
  }

  // Connect teachers to classes (a separate step to avoid circular dependencies)
  console.log("Connecting teachers to classes...");
  for (let i = 1; i <= 15; i++) {
    await prisma.teacher.update({
      where: { id: `teacher${i}` },
      data: {
        classes: { connect: [{ id: (i % 6) + 1 }] },
      },
    });
  }

  // PARENT
  console.log("Creating parents...");
  for (let i = 1; i <= 25; i++) {
    await prisma.parent.create({
      data: {
        id: `parentId${i}`,
        username: `parentId${i}`,
        name: `PName ${i}`,
        surname: `PSurname ${i}`,
        email: `parent${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Address${i}`,
      },
    });
  }
  
  // STUDENT
  console.log("Creating students...");
  for (let i = 1; i <= 50; i++) {
    await prisma.student.create({
      data: {
        id: `student${i}`, 
        username: `student${i}`, 
        name: `SName${i}`,
        surname: `SSurname ${i}`,
        email: `student${i}@example.com`,
        phone: `987-654-321${i}`,
        address: `Address${i}`,
        bloodType: "O-",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`, 
        gradeId: (i % 6) + 1, 
        classId: (i % 6) + 1, 
      },
    });
  }

  // LESSON
  console.log("Creating lessons...");
  const now = new Date();
  for (let i = 1; i <= 30; i++) {
    // Create a new date object for each lesson to avoid reference issues
    const lessonDate = new Date(now);
    
    await prisma.lesson.create({
      data: {
        name: `Lesson${i}`, 
        startTime: new Date(lessonDate.setHours(8 + (i % 8), 0, 0, 0)), 
        endTime: new Date(lessonDate.setHours(9 + (i % 8), 0, 0, 0)), 
        subjectId: (i % 10) + 1, 
        classId: (i % 6) + 1, 
        teacherId: `teacher${(i % 15) + 1}`,
        day: i % 5 === 0 ? Day.FRIDAY : 
             i % 5 === 1 ? Day.MONDAY : 
             i % 5 === 2 ? Day.TUESDAY : 
             i % 5 === 3 ? Day.WEDNESDAY : 
             Day.THURSDAY,
      },
    });
  }

  // EXAM
  console.log("Creating exams...");
  for (let i = 1; i <= 10; i++) {
    await prisma.exam.create({
      data: {
        title: `Exam ${i}`, 
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)), 
        lessonId: (i % 30) + 1, 
      },
    });
  }

  // ASSIGNMENT
  console.log("Creating assignments...");
  for (let i = 1; i <= 10; i++) {
    await prisma.assignment.create({
      data: {
        title: `Assignment ${i}`, 
        startDate: new Date(new Date().setHours(new Date().getHours() + 1)), 
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), 
        lessonId: (i % 30) + 1, 
      },
    });
  }

  // RESULT
  console.log("Creating results...");
  for (let i = 1; i <= 10; i++) {
    await prisma.result.create({
      data: {
        score: 90, 
        studentId: `student${i}`, 
        ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }), 
      },
    });
  }

  // ATTENDANCE
  console.log("Creating attendance records...");
  for (let i = 1; i <= 10; i++) {
    await prisma.attendance.create({
      data: {
        date: new Date(), 
        present: true, 
        studentId: `student${i}`, 
        lessonId: (i % 30) + 1, 
      },
    });
  }

  // EVENT
  console.log("Creating events...");
  for (let i = 1; i <= 5; i++) {
    await prisma.event.create({
      data: {
        title: `Event ${i}`, 
        description: `Description for Event ${i}`, 
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)), 
        classId: (i % 5) + 1, 
      },
    });
  }

  // ANNOUNCEMENT
  console.log("Creating announcements...");
  for (let i = 1; i <= 5; i++) {
    await prisma.announcement.create({
      data: {
        title: `Announcement ${i}`, 
        description: `Description for Announcement ${i}`, 
        date: new Date(), 
        classId: (i % 5) + 1, 
      },
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });