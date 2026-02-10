import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../Services/api-service";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => {
      return axiosInstance.post("/logout").then((res) => res.data);
    },
    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      navigate("/login");
    },
    onError: () => {
      // Even if the server call fails, we should clear the token locally
      localStorage.removeItem("token");
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      navigate("/login");
    },
  });
};

export default useLogout;
