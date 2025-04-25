"use server";

import { revalidatePath } from "next/cache";
import {
  ClassSchema,
  ExamSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { clerkClient } from '@clerk/clerk-sdk-node';  
import error from "next/error";



type CurrentState = { success: boolean; error: boolean };

// export const createSubject = async (
//   currentState: CurrentState,
//   data: SubjectSchema
// ) => {
//   try {
//     await prisma.subject.create({
//       data: {
//         name: data.name,
//         teachers: {
//           connect: data.teachers.map((teacherId) => ({ id: teacherId })),
//         },
//       },
//     });

//     // revalidatePath("/list/subjects");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const updateSubject = async (
//   currentState: CurrentState,
//   data: SubjectSchema
// ) => {
//   try {
//     await prisma.subject.update({
//       where: {
//         id: data.id,
//       },
//       data: {
//         name: data.name,
//         teachers: {
//           set: data.teachers.map((teacherId) => ({ id: teacherId })),
//         },
//       },
//     });

//     // revalidatePath("/list/subjects");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const deleteSubject = async (
//   currentState: CurrentState,
//   data: FormData
// ) => {
//   const id = data.get("id") as string;
//   try {
//     await prisma.subject.delete({
//       where: {
//         id: parseInt(id),
//       },
//     });

//     // revalidatePath("/list/subjects");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

type currentState = { success: boolean; error: boolean };

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
): Promise<CurrentState> => {
  const { name, teachers } = data;

  try {
    // Start by checking if the subject already exists to prevent duplicates
    const existingSubject = await prisma.subject.findUnique({
      where: { name },
    });

    if (existingSubject) {
      return { success: false, error: true }; // Subject already exists
    }

    // Create a new subject with teacher connections
    const subjectToCreate = {
      name,
      teachers: { connect: teachers.map((teacherId) => ({ id: teacherId })) },
    };

    await prisma.subject.create({
      data: subjectToCreate,
    });

    // Revalidate path after creation
    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error creating subject:", err);
    return { success: false, error: true };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
): Promise<CurrentState> => {
  const { id, name, teachers } = data;

  try {
    // First, fetch the current subject to ensure it exists
    const subject = await prisma.subject.findUnique({
      where: { id },
    });

    if (!subject) {
      return { success: false, error: true }; // Subject not found
    }

    // Proceed to update the subject's name and teachers
    const updatedSubject = {
      name,
      teachers: { set: teachers.map((teacherId) => ({ id: teacherId })) },
    };

    await prisma.subject.update({
      where: { id },
      data: updatedSubject,
    });

    // Revalidate path after update
    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error updating subject:", err);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
): Promise<CurrentState> => {
  const id = data.get("id") as string;

  try {
    // Fetch the subject to ensure it exists before deletion
    const subject = await prisma.subject.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!subject) {
      return { success: false, error: true }; // Subject not found
    }

    // Perform the deletion
    await prisma.subject.delete({
      where: { id: parseInt(id, 10) },
    });

    // Revalidate path after deletion
    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error deleting subject:", err);
    return { success: false, error: true };
  }
};


// export const createClass = async (
//   currentState: CurrentState,
//   data: ClassSchema
// ) => {
//   try {
//     await prisma.class.create({
//       data,
//     });

//     // revalidatePath("/list/class");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const updateClass = async (
//   currentState: CurrentState,
//   data: ClassSchema
// ) => {
//   try {
//     await prisma.class.update({
//       where: {
//         id: data.id,
//       },
//       data,
//     });

//     // revalidatePath("/list/class");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const deleteClass = async (
//   currentState: CurrentState,
//   data: FormData
// ) => {
//   const id = data.get("id") as string;
//   try {
//     await prisma.class.delete({
//       where: {
//         id: parseInt(id),
//       },
//     });

//     // revalidatePath("/list/class");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const createTeacher = async (
//   currentState: CurrentState,
//   data: TeacherSchema
// ) => {
//   console.log(currentState);
//   console.log(data);
//   try {
    
//     const user = await clerkClient.users.createUser({
//       username: data.username,
//       password: data.password,
//       firstName: data.name,
//       lastName: data.surname,
//       publicMetadata:{role:"teacher"}
//     });

//     await prisma.teacher.create({
//       data: {
//         id: user.id,
//         username: data.username,
//         name: data.name,
//         surname: data.surname,
//         email: data.email || null,
//         phone: data.phone || null,
//         address: data.address,
//         img: data.img || null,
//         bloodType: data.bloodType,
//         sex: data.sex,
//         //birthday: data.birthday,
//         subjects: {
//           connect: data.subjects?.map((subjectId: string) => ({
//             id: parseInt(subjectId),
//           })),
//         },
//       },
//     });

//     // revalidatePath("/list/teachers");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };
export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    // Check required fields are present
    if (!data.name || !data.capacity || !data.gradeId) {
      throw new Error("Incomplete class data.");
    }

    const newClass = await prisma.class.create({
      data: {
        name: data.name,
        capacity: data.capacity,
        gradeId: data.gradeId,
        supervisorId: data.supervisorId ?? null,
      },
    });

    if (!newClass) throw new Error("Class creation failed.");

    return { success: true, error: false };
  } catch (error) {
    console.error("Error creating class:", error);
    return { success: false, error: true };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    const existing = await prisma.class.findUnique({
      where: { id: data.id },
    });

    if (!existing) throw new Error("Class not found.");

    await prisma.class.update({
      where: { id: data.id },
      data: {
        name: data.name,
        capacity: data.capacity,
        gradeId: data.gradeId,
        supervisorId: data.supervisorId ?? null,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error("Error updating class:", error);
    return { success: false, error: true };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    const idString = data.get("id");
    if (!idString) throw new Error("Class ID missing.");

    const id = parseInt(idString as string);

    const target = await prisma.class.findUnique({ where: { id } });
    if (!target) throw new Error("Class does not exist.");

    await prisma.class.delete({ where: { id } });

    return { success: true, error: false };
  } catch (error) {
    console.error("Error deleting class:", error);
    return { success: false, error: true };
  }
};

// export const createTeacher = async (
//   currentState: CurrentState,
//   data: TeacherSchema
// ) => {
//   console.log("createTeacher data:", data);

//   try {
//     if (!data.password || data.password.trim() === "") {
//       return { success: false, error: true, message: "Password is required." };
//     }

//     let user;
//     try {
//       user = await clerkClient.users.createUser({
//         username: data.username,
//         password: data.password,
//         firstName: data.name,
//         lastName: data.surname,
//         publicMetadata: { role: "teacher" },
//       });
//     } catch (err) {
//       const error = err as any;
//       console.error("Clerk error (createUser):", JSON.stringify(error, null, 2));

//       const messages =
//         error?.errors?.map((e: any) => e.message).join(", ") ??
//         "Failed to create user.";

//       return {
//         success: false,
//         error: true,
//         message: messages,
//       };
//     }

//     await prisma.teacher.create({
//       data: {
//         id: user.id,
//         username: data.username,
//         name: data.name,
//         surname: data.surname,
//         email: data.email || null,
//         phone: data.phone || null,
//         address: data.address,
//         img: data.img || null,
//         bloodType: data.bloodType,
//         sex: data.sex,
//         subjects: {
//           connect: data.subjects?.map((subjectId: string) => ({
//             id: parseInt(subjectId),
//           })),
//         },
//       },
//     });

//     return { success: true, error: false };
//   } catch (err: any) {
//     console.error("Unexpected error in createTeacher:", err);
//     return {
//       success: false,
//       error: true,
//       message: err.message || "Unexpected server error.",
//     };
//   }
// };


// export const updateTeacher = async (
//   currentState: CurrentState,
//   data: TeacherSchema
// ) => {
//   if (!data.id) {
//     return { success: false, error: true };
//   }
//   try {
//     const user = await clerkClient.users.updateUser(data.id, {
//       username: data.username,
//       ...(data.password !== "" && { password: data.password }),
//       firstName: data.name,
//       lastName: data.surname,
//     });

//     await prisma.teacher.update({
//       where: {
//         id: data.id,
//       },
//       data: {
//         ...(data.password !== "" && { password: data.password }),
//         username: data.username,
//         name: data.name,
//         surname: data.surname,
//         email: data.email || null,
//         phone: data.phone || null,
//         address: data.address,
//         img: data.img || null,
//         bloodType: data.bloodType,
//         sex: data.sex,
//         //birthday: data.birthday,
//         subjects: {
//           set: data.subjects?.map((subjectId: string) => ({
//             id: parseInt(subjectId),
//           })),
//         },
//       },
//     });
//     // revalidatePath("/list/teachers");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const deleteTeacher = async (
//   currentState: CurrentState,
//   data: FormData
// ) => {
//   const id = data.get("id") as string;
//   try {
//     await clerkClient.users.deleteUser(id);

//     await prisma.teacher.delete({
//       where: {
//         id: id,
//       },
//     });

//     // revalidatePath("/list/teachers");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const createStudent = async (
//   currentState: CurrentState,
//   data: StudentSchema
// ) => {
//   console.log(data);
//   try {
//     const classItem = await prisma.class.findUnique({
//       where: { id: data.classId },
//       include: { _count: { select: { students: true } } },
//     });

//     if (classItem && classItem.capacity === classItem._count.students) {
//       return { success: false, error: true };
//     }

//     let user;
//     try {
//       user = await clerkClient.users.createUser({
//         username: data.username,
//         password: data.password,
//         firstName: data.name,
//         lastName: data.surname,
//         publicMetadata: { role: "student" },
//       });
//     } catch (clerkErr: any) {
//       console.error("Clerk error:", clerkErr);
//       return { success: false, error: true, message: clerkErr.errors?.[0]?.message ?? "Failed to create user" };
//     }

//     await prisma.student.create({
//       data: {
//         id: user.id,
//         username: data.username,
//         name: data.name,
//         surname: data.surname,
//         email: data.email || null,
//         phone: data.phone || null,
//         address: data.address,
//         img: data.img || null,
//         bloodType: data.bloodType,
//         sex: data.sex,
//         //birthday: data.birthday,
//         gradeId: data.gradeId,
//         classId: data.classId,
//         parentId: data.parentId,
//       },
//     });

//     // revalidatePath("/list/students");
//     return { success: true, error: false };
//   } catch (err: any) {
//     console.error("Error in createStudent:", err);
//     return { success: false, error: true, message: err.message };
//   }
// };
export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  console.log("Creating teacher with data:", data);

  if (!data.password?.trim()) {
    return { success: false, error: true, message: "Password is required." };
  }

  try {
    const newUser = await clerkClient.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "teacher" },
    });

    const subjectConnections =
      data.subjects?.map((subjectId) => ({
        id: typeof subjectId === 'string' ? parseInt(subjectId) : subjectId,
      })) || [];

    const classConnections =
      data.classes?.map((classId) => ({
        id: typeof classId === 'string' ? parseInt(classId) : classId,
      })) || [];

    // Create the teacher record
    await prisma.teacher.create({
      data: {
        id: newUser.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email ?? null,
        phone: data.phone ?? null,
        address: data.address,
        img: data.img ?? null,
        bloodType: data.bloodType,
        sex: data.sex,
        subjects: {
          connect: subjectConnections,
        },
        classes: {
          connect: classConnections,
        },
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    const errorDetails = err?.errors
      ?.map((e: any) => e.message)
      ?.join(", ") ?? err.message ?? "Teacher creation failed.";

    console.error("Error while creating teacher:", errorDetails);
    return { success: false, error: true, message: errorDetails };
  }
};

// Helper function to convert numeric day to Day enum
function getDayEnumFromNumber(dayNumber: number): "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" {
  switch (dayNumber) {
    case 1: return "MONDAY";
    case 2: return "TUESDAY";
    case 3: return "WEDNESDAY";
    case 4: return "THURSDAY";
    case 5: return "FRIDAY";
    default: return "MONDAY"; // Default to Monday if invalid
  }
}

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }

  try {
    // Update Clerk user
    await clerkClient.users.updateUser(data.id, {
      username: data.username,
      firstName: data.name,
      lastName: data.surname,
      ...(data.password && { password: data.password }),
    });

    // Convert subject and class IDs to numbers if they're strings
    const updatedSubjects =
      data.subjects?.map((subjectId) => ({
        id: typeof subjectId === 'string' ? parseInt(subjectId) : subjectId,
      })) || [];

    const updatedClasses =
      data.classes?.map((classId) => ({
        id: typeof classId === 'string' ? parseInt(classId) : classId,
      })) || [];

    // Update teacher in database
    await prisma.teacher.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email ?? null,
        phone: data.phone ?? null,
        address: data.address,
        img: data.img ?? null,
        bloodType: data.bloodType,
        sex: data.sex,
        subjects: {
          set: updatedSubjects,
        },
        classes: {
          set: updatedClasses,
        },
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error updating teacher:", err);
    return { success: false, error: true };
  }
};
export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    // Delete from Clerk
    await clerkClient.users.deleteUser(id);

    // Delete from database
    await prisma.teacher.delete({
      where: { id },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error deleting teacher:", err);
    return { success: false, error: true };
  }
};


// export const createStudent = async (
//   currentState: CurrentState,
//   data: StudentSchema
// ) => {
  
//   console.log(currentState);
//   console.log(data);
//   try {
//     // Check if the class exists and if there's space for more students
//     const classItem = await prisma.class.findUnique({
//       where: { id: data.classId },
//       include: { _count: { select: { students: true } } },
//     });

//     // If class is full, return an error response
//     if (classItem && classItem.capacity === classItem._count.students) {
//       return { success: false, error: true, message: "Class is full" };

//     }
    

//     // Ensure password is provided before making a request to Clerk
//     if (!data.password || data.password.trim() === "") {
//       return { success: false, error: true, message: "Password is required." };
//     }

//     // Try to create the user with Clerk
//     let user;
//     try {
//       user = await clerkClient.users.createUser({
//         username: data.username,
//         password: data.password,
//         firstName: data.name,
//         lastName: data.surname,
//         publicMetadata: { role: "student" },
//       });
//     }  catch (err) {
//       const error = err as any; // Explicitly cast to 'any' to access Clerk error properties
//       console.error("Clerk error:", error);
    
//       // Specific password breach error
//       if (
//         error?.errors?.some((e: any) => e.code === "form_password_pwned")
//       ) {
//         return {
//           success: false,
//           error: true,
//           message:
//             "Password has been found in a data breach. Please use a different one.",
//         };
//       }
    
//       // Username already taken
//       if (
//         error?.errors?.some((e: any) =>
//           e.message.toLowerCase().includes("username")
//         )
//       ) {
//         return {
//           success: false,
//           error: true,
//           message: "Username already taken. Please choose a unique one.",
//         };
//       }
    
//       return {
//         success: false,
//         error: true,
//         message:
//           error?.errors?.[0]?.message ??
//           "Failed to create user. Please check the form.",
//       };
//     }
//     // Create the student record in the database
//     await prisma.student.create({
//       data: {
//         id: user.id,
//         username: data.username,
//         name: data.name,
//         surname: data.surname,
//         email: data.email || null,
//         phone: data.phone || null,
//         address: data.address,
//         img: data.img || null,
//         bloodType: data.bloodType,
//         sex: data.sex,
//         gradeId: data.gradeId,
//         classId: data.classId,
//         parentId: data.parentId,
//       },
//     });

//     return { success: true, error: false };
//   } catch (err: any) {
//     console.error("Error in createStudent:", err);
//     return { success: false, error: true, message: err.message };
//   }
// };


// export const updateStudent = async (
//   currentState: CurrentState,
//   data: StudentSchema
// ) => {
//   if (!data.id) {
//     return { success: false, error: true };
//   }
//   try {
//     const user = await clerkClient.users.updateUser(data.id, {
//       username: data.username,
//       ...(data.password !== "" && { password: data.password }),
//       firstName: data.name,
//       lastName: data.surname,
//     });

//     await prisma.student.update({
//       where: {
//         id: data.id,
//       },
//       data: {
//         ...(data.password !== "" && { password: data.password }),
//         username: data.username,
//         name: data.name,
//         surname: data.surname,
//         email: data.email || null,
//         phone: data.phone || null,
//         address: data.address,
//         img: data.img || null,
//         bloodType: data.bloodType,
//         sex: data.sex,
//         //birthday: data.birthday,
//         gradeId: data.gradeId,
//         classId: data.classId,
//         parentId: data.parentId,
//       },
//     });
//     // revalidatePath("/list/students");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const deleteStudent = async (
//   currentState: CurrentState,
//   data: FormData
// ) => {
//   const id = data.get("id") as string;
//   try {
//     await clerkClient.users.deleteUser(id);

//     await prisma.student.delete({
//       where: {
//         id: id,
//       },
//     });

//     // revalidatePath("/list/students");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };
export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  console.log("Current state:", currentState);
  console.log("Received student data:", data);

  try {
    const classData = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });

    const isClassFull =
      classData && classData.capacity === classData._count.students;

    if (isClassFull) {
      return { success: false, error: true, message: "Class has reached its capacity." };
    }

    if (!data.password?.trim()) {
      return { success: false, error: true, message: "Password must be provided." };
    }

    let createdUser;

    try {
      createdUser = await clerkClient.users.createUser({
        username: data.username,
        password: data.password,
        firstName: data.name,
        lastName: data.surname,
        publicMetadata: { role: "student" },
      });
    } catch (err: any) {
      console.error("Error from Clerk:", err);

      const clerkErrors = err?.errors || [];

      if (clerkErrors.some((e: any) => e.code === "form_password_pwned")) {
        return {
          success: false,
          error: true,
          message: "This password was found in a breach. Use a different one.",
        };
      }

      if (
        clerkErrors.some((e: any) =>
          e.message.toLowerCase().includes("username")
        )
      ) {
        return {
          success: false,
          error: true,
          message: "Username is already in use. Please pick another.",
        };
      }

      return {
        success: false,
        error: true,
        message: clerkErrors[0]?.message || "Could not create student user.",
      };
    }

    await prisma.student.create({
      data: {
        id: createdUser.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email ?? null,
        phone: data.phone ?? null,
        address: data.address,
        img: data.img ?? null,
        bloodType: data.bloodType,
        sex: data.sex,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    console.error("Unexpected error during student creation:", err);
    return { success: false, error: true, message: err.message };
  }
};
export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }

  try {
    await clerkClient.users.updateUser(data.id, {
      username: data.username,
      firstName: data.name,
      lastName: data.surname,
      ...(data.password && { password: data.password }),
    });

    await prisma.student.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email ?? null,
        phone: data.phone ?? null,
        address: data.address,
        img: data.img ?? null,
        bloodType: data.bloodType,
        sex: data.sex,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
        ...(data.password && { password: data.password }),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error while updating student:", err);
    return { success: false, error: true };
  }
};
export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await clerkClient.users.deleteUser(id);
    await prisma.student.delete({ where: { id } });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error while deleting student:", err);
    return { success: false, error: true };
  }
};

export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.exam.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteExam = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
