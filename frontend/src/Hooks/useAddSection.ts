import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstace from "../Services/api-service";

interface SectionData {
  courseId: number | string;
  title: string;
  order?: number;
}

const useAddSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SectionData) => {
      return axiosInstace.post(`/courses/${data.courseId}/sections`, {
        title: data.title,
        order: data.order,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
    },
  });
};

export default useAddSection;
