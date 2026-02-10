import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../Services/api-service";

const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => {
      return axiosInstance.delete(`/admin/users/${id}`).then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export default useDeleteUser;
