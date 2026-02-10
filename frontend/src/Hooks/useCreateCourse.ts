import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstace from "../Services/api-service";

interface CourseData {
  title: string;
  description: string;
  teacher_id: number;
  thumbnail?: File;
  price?: number;
  level?: string;
}

const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CourseData) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("teacher_id", data.teacher_id.toString());
      if (data.thumbnail) formData.append("thumbnail", data.thumbnail);
      if (data.price) formData.append("price", data.price.toString());
      if (data.level) formData.append("level", data.level);

      return axiosInstace.post("/courses", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export default useCreateCourse;
