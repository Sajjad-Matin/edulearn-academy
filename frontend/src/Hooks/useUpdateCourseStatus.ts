import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstace from "../Services/api-service";

interface UpdateStatusData {
  courseId: number;
  status: "pending" | "approved" | "rejected";
}

const useUpdateCourseStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, status }: UpdateStatusData) =>
      axiosInstace.put(`/courses/${courseId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export default useUpdateCourseStatus;
