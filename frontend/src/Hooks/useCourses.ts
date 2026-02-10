import { useQuery } from "@tanstack/react-query";
import axiosInstace from "../Services/api-service";

export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  teacher_id: number;
  teacher?: {
    id: number;
    name: string;
  };
  price: string;
  level: string;
  status: "pending" | "approved" | "rejected";
  category?: string;
  sections_count?: number;
  lectures_count?: number;
  sections?: Array<{
    id: number;
    title: string;
    order: number;
    lectures?: Array<{
      id: number;
      title: string;
      video_url: string;
      video_type: "file" | "youtube";
      content: string;
      order: number;
      is_preview: boolean;
    }>;
  }>;
  resources?: Array<{
    id: number;
    title: string;
    file_path: string;
    link?: string;
    type: string;
  }>;
}

const useCourses = (category?: string) => {
  return useQuery<Course[]>({
    queryKey: ["courses", category],
    queryFn: () => {
      const params = category ? { category } : {};
      return axiosInstace.get("/courses", { params }).then((res) => res.data);
    },
  });
};

export default useCourses;
