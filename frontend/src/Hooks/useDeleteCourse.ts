import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstace from "../Services/api-service";

const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => {
      return axiosInstace.delete(`/courses/${id}`).then((res: any) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export default useDeleteCourse;
