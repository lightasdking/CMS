// export const ITEM_PER_PAGE = 10

// type RouteAccessMap = {
//     [key: string]: string[];
//   };
  
  
//   export const routeAccessMap: RouteAccessMap = {
//     "/admin(.*)": ["admin"],
//     "/student(.*)": ["student"],
//     "/teacher(.*)": ["teacher"],
//     "/parent(.*)": ["parent"],
//     "/list/teachers": ["admin", "teacher"],
//     "/list/students": ["admin", "teacher"],
//     "/list/parents": ["admin", "teacher"],
//     "/list/subjects": ["admin"],
//     "/list/classes": ["admin", "teacher"],
//     "/list/exams": ["admin", "teacher", "student", "parent"],
//     "/list/assignments": ["admin", "teacher", "student", "parent"],
//     "/list/results": ["admin", "teacher", "student", "parent"],
//     "/list/attendance": ["admin", "teacher", "student", "parent"],
//     "/list/events": ["admin", "teacher", "student", "parent"],
//     "/list/announcements": ["admin", "teacher", "student", "parent"],
//   };

// lib/settings.ts

export const ITEM_PER_PAGE = 10;

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  // Role-specific dashboard routes
  "/(dashboard)/admin": ["admin"],
  "/(dashboard)/student": ["student"],
  "/(dashboard)/teacher": ["teacher"],
  "/(dashboard)/parent": ["parent"],
  
  // Root level role routes (redirects)
  "/admin": ["admin"],
  "/student": ["student"],
  "/teacher": ["teacher"],
  "/parent": ["parent"],

  // List routes accessible by different roles
  "/(dashboard)/list/teachers": ["admin", "teacher"],
  "/(dashboard)/list/students": ["admin", "teacher"],
  "/(dashboard)/list/parents": ["admin", "teacher"],
  "/(dashboard)/list/subjects": ["admin"],
  "/(dashboard)/list/classes": ["admin", "teacher"],
  "/(dashboard)/list/exams": ["admin", "teacher", "student", "parent"],
  "/(dashboard)/list/assignments": ["admin", "teacher", "student", "parent"],
  "/(dashboard)/list/results": ["admin", "teacher", "student", "parent"],
  "/(dashboard)/list/attendance": ["admin", "teacher", "student", "parent"],
  "/(dashboard)/list/events": ["admin", "teacher", "student", "parent"],
  "/(dashboard)/list/announcements": ["admin", "teacher", "student", "parent"],
};
