import { useQuery } from "@tanstack/react-query";
import axiosInstace from "../Services/api-service";
import type { Course } from "./useCourses";

export interface Lecture {
  id: number;
  title: string;
  video_url: string;
  video_type: "file" | "youtube";
  content: string;
  duration: number;
  order: number;
  is_preview: boolean;
}

export interface Section {
  id: number;
  title: string;
  order: number;
  lectures: Lecture[];
}

export interface CourseWithDetails extends Course {
  sections: Section[];
}

const useCourseDetails = (id: string | number) => {
  return useQuery<CourseWithDetails>({
    queryKey: ["course", id],
    queryFn: () => {
      return axiosInstace.get(`/courses/${id}`).then((res) => res.data);
    },
    enabled: !!id,
  });
};

export default useCourseDetails;
