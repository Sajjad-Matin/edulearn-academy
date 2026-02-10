import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../Services/api-service";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

const useGetUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => {
      return axiosInstance.get("/admin/users").then((res) => res.data);
    },
  });
};

export default useGetUsers;
