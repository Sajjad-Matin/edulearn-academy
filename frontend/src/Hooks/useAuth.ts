import { useQuery } from "@tanstack/react-query";
import axiosInstace from "../Services/api-service";

const useAuth = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: () => {
      return axiosInstace
            .get("/me")
            .then((res) => res.data);
    },
  });
};

export default useAuth;
