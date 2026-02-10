import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../Services/api-service";

interface UpdateUserData {
  name: string;
  email: string;
  password?: string;
  role: string;
}

const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserData }) => {
      return axiosInstance
        .put(`/admin/users/${id}`, data)
        .then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export default useUpdateUser;
