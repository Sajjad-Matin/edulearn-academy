import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../Services/api-service";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

const useCreateUser = () => {
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserData) => {
      return axiosInstance.post("/admin/users", data).then((res) => res.data);
    },
    onSuccess: () => {
      // You might want to invalidate a users list query here if you had one
      // queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export default useCreateUser;
