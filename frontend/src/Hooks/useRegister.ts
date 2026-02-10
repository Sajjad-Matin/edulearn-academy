import { useMutation } from "@tanstack/react-query"
import axiosInstace from "../Services/api-service"

const useRegister = () => {
    return useMutation({
        mutationFn: async (userInfo: { name: string; email: string; password: string }) => {
            const response = await axiosInstace.post("/register", userInfo);
            return response.data;
        }
    })
}

export default useRegister