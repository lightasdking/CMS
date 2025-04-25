"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { subjectSchema, SubjectSchema } from "@/lib/formValidationSchemas";
import { createSubject, updateSubject } from "@/lib/actions";
import { useActionState } from "react";
import { Dispatch, SetStateAction, useEffect, startTransition } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SubjectForm = ({
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
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      ...data,
      teachers: data?.teachers || [],
    },
  });

  const [state, formAction] = useActionState(
    type === "create" ? createSubject : updateSubject,
    {
      success: false,
      error: false,
    }
  );

  const processForm = handleSubmit((formData) => {
    startTransition(() => {
      formAction(formData);
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Subject has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { teachers } = relatedData;

  const renderFormFields = () => (
    <section className="inline-flex flex-wrap gap-4 justify-between">
      <InputField
        label="Subject name"
        name="name"
        defaultValue={data?.name || ""}
        register={register}
        error={errors?.name}
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
        <label className="text-gray-500 text-xs">Teachers</label>
        <select
          multiple
          className="w-full text-sm rounded-md p-2 ring-[1.5px] ring-gray-300"
          {...register("teachers")}
          defaultValue={data?.teachers || []}
        >
          {teachers.map((teacher: { id: string; name: string; surname: string }) => (
            <option key={teacher.id} value={teacher.id}>
              {`${teacher.name} ${teacher.surname}`}
            </option>
          ))}
        </select>
        {errors.teachers?.message && (
          <span className="text-red-400 text-xs">{String(errors.teachers.message)}</span>
        )}
      </div>
    </section>
  );

  return (
    <form className="inline-flex flex-col gap-8" onSubmit={processForm}>
      <h1 className="font-semibold text-xl">
        {type === "create" ? "Create a new subject" : "Update the subject"}
      </h1>
      {renderFormFields()}
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="text-white bg-blue-400 rounded-md p-2">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default SubjectForm;