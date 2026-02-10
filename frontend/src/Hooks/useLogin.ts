import { useMutation } from "@tanstack/react-query"
import axiosInstace from "../Services/api-service";

const useLogin = () => {
    return useMutation({
        mutationFn: async (credentials: { email: string; password: string }) => {
            const response = await axiosInstace.post("/login", credentials);
            return response.data;
        },
    })
}

export default useLogin