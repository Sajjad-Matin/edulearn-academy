import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstace from "../Services/api-service";

interface UpdateCourseParams {
  id: number | string;
  title?: string;
  description?: string;
  teacher_id?: number;
  price?: number;
  level?: string;
  thumbnail?: File;
}

const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateCourseParams) => {
      const { id, ...data } = params;
      const formData = new FormData();

      // Laravel update with files often needs _method: 'PUT' with POST request
      formData.append("_method", "PUT");

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === "thumbnail" && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      return axiosInstace
        .post(`/courses/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => res.data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", data.id] });
    },
  });
};

export default useUpdateCourse;
