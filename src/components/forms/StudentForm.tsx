
"use client";

import { startTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { studentSchema, StudentSchema } from "@/lib/formValidationSchemas";
import { useActionState } from "react";
import { createStudent, updateStudent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";

const StudentForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
  });

  const [img, setImg] = useState<any>();

  const [state, formAction] = useActionState(
    type === "create" ? createStudent : updateStudent,
    {
      success: false,
      error: false,
    }
  );

  const processForm = handleSubmit((formData) => {
    console.log("hello");
    console.log(formData);
    startTransition(() => {
      formAction({ ...formData, img: img?.secure_url });
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Student has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  if (!relatedData) return <p>Loading...</p>;
  const { grades, classes } = relatedData;

  const renderAuthFields = () => (
    <section className="inline-flex flex-wrap gap-4 justify-between">
      <InputField
        label="Username"
        name="username"
        defaultValue={data?.username || ""}
        register={register}
        error={errors?.username}
      />
      <InputField
        label="Email"
        name="email"
        defaultValue={data?.email || ""}
        register={register}
        error={errors?.email}
      />
      <InputField
        label="Password"
        name="password"
        type="password"
        defaultValue={data?.password || ""}
        register={register}
        error={errors?.password}
      />
    </section>
  );

  const renderPersonalFields = () => (
    <section className="inline-flex flex-wrap gap-4 justify-between">
      <InputField
        label="First Name"
        name="name"
        defaultValue={data?.name || ""}
        register={register}
        error={errors.name}
      />
      <InputField
        label="Last Name"
        name="surname"
        defaultValue={data?.surname || ""}
        register={register}
        error={errors.surname}
      />
      <InputField
        label="Phone"
        name="phone"
        defaultValue={data?.phone || ""}
        register={register}
        error={errors.phone}
      />
      <InputField
        label="Address"
        name="address"
        defaultValue={data?.address || ""}
        register={register}
        error={errors.address}
      />
      <InputField
        label="Blood Type"
        name="bloodType"
        defaultValue={data?.bloodType || ""}
        register={register}
        error={errors.bloodType}
      />
      {/* <InputField
        label="Birthday"
        name="birthday"
        defaultValue={data?.birthday?.toISOString().split("T")[0] || ""}
        register={register}
        error={errors.birthday}
        type="date"
      /> */}
      <InputField
        label="Parent Id"
        name="parentId"
        defaultValue={data?.parentId || ""}
        register={register}
        error={errors.parentId}
      />
      {data && (
        <InputField
          label="Id"
          name="id"
          defaultValue={data?.id || ""}
          register={register}
          error={errors?.id}
          hidden
        />
      )}
      <div className="w-full md:w-1/4 flex flex-col gap-2">
        <label className="text-gray-500 text-xs">Sex</label>
        <select
          className="w-full text-sm rounded-md p-2 ring-[1.5px] ring-gray-300"
          {...register("sex")}
          defaultValue={data?.sex || ""}
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
        {errors.sex?.message && (
          <span className="text-red-400 text-xs">{String(errors.sex.message)}</span>
        )}
      </div>
      <div className="w-full md:w-1/4 flex flex-col gap-2">
        <label className="text-gray-500 text-xs">Grade</label>
        <select
          className="w-full text-sm rounded-md p-2 ring-[1.5px] ring-gray-300"
          {...register("gradeId")}
          defaultValue={data?.gradeId || ""}
        >
          {grades.map((grade: { id: number; level: number }) => (
            <option key={grade.id} value={grade.id}>
              {grade.level}
            </option>
          ))}
        </select>
        {errors.gradeId?.message && (
          <span className="text-red-400 text-xs">{String(errors.gradeId.message)}</span>
        )}
      </div>
      <div className="w-full md:w-1/4 flex flex-col gap-2">
        <label className="text-gray-500 text-xs">Class</label>
        <select
          className="w-full text-sm rounded-md p-2 ring-[1.5px] ring-gray-300"
          {...register("classId")}
          defaultValue={data?.classId || ""}
        >
          {classes.map(
            (classItem: {
              id: number;
              name: string;
              capacity: number;
              _count: { students: number };
            }) => (
              <option key={classItem.id} value={classItem.id}>
                {`${classItem.name} (${classItem._count.students}/${classItem.capacity} Capacity)`}
              </option>
            )
          )}
        </select>
        {errors.classId?.message && (
          <span className="text-red-400 text-xs">{String(errors.classId.message)}</span>
        )}
      </div>
    </section>
  );

  return (
    <form className="inline-flex flex-col gap-8" onSubmit={processForm}>
      <h1 className="font-semibold text-xl">
        {type === "create" ? "Create a new student" : "Update the student"}
      </h1>
      <span className="text-gray-400 font-medium text-xs">Authentication Information</span>
      {renderAuthFields()}
      <span className="text-gray-400 font-medium text-xs">Personal Information</span>
      <CldUploadWidget
        uploadPreset="school"
        onSuccess={(result, { widget }) => {
          setImg(result.info);
          widget.close();
        }}
      >
        {({ open }) => (
          <section
            className="inline-flex items-center gap-2 text-gray-500 text-xs cursor-pointer"
            onClick={() => open()}
          >
            <Image src="/upload.png" alt="" width={28} height={28} />
            <span>Upload a photo</span>
          </section>
        )}
      </CldUploadWidget>
      {renderPersonalFields()}
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button type="submit" className="text-white bg-blue-400 rounded-md p-2">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default StudentForm;