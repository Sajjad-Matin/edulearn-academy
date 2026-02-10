import {
  Box,
  Container,
  Grid,
  Stack,
  Heading,
  Text,
  Avatar,
  Progress,
  SimpleGrid,
  Image,
  AspectRatio,
  Button,
  HStack,
  VStack,
  Badge,
} from "@chakra-ui/react";
import Navbar from "../Components/Navbar";
import useAuth from "../Hooks/useAuth";
import useMyCourses from "../Hooks/useMyCourses";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";

const StudentDashboardPage = () => {
  const { data: user } = useAuth();
  const { data: courses, isLoading } = useMyCourses();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      toast({
        title: "Payment Successful!",
        description: "You have been successfully enrolled in the course.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Clear the search params
      navigate("/student-dashboard", { replace: true });
    }
  }, [searchParams, toast, navigate]);

  const upcoming = [
    { id: 1, title: "Live Q&A: AI Apps", time: "Tomorrow 6:00 PM" },
    { id: 2, title: "Project Review Session", time: "In 3 days" },
  ];
  return (
    <>
      <Navbar />

      <Box bg="gray.50" minH="100vh" pt={{ base: 20, md: 24 }} pb={12}>
        <Container maxW="6xl">
          <Grid
            templateColumns={{ base: "1fr", lg: "260px 1fr 320px" }}
            gap={{ base: 4, md: 8 }}
          >
            {/* LEFT SIDEBAR */}
            <Box
              bg="white"
              borderRadius="2xl"
              p={{ base: 4, md: 6 }}
              shadow="sm"
              position={{ base: "static", lg: "sticky" }}
              top={{ lg: "100px" }}
              alignSelf="start"
            >
              <VStack align="start" spacing={4}>
                <HStack spacing={4} alignItems="center">
                  <Avatar
                    size="lg"
                    name={user?.name || "Student"}
                    src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                  />
                  <Box>
                    <Heading size="sm">{user?.name || "Loading..."}</Heading>
                    <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }}>
                      {user?.email || "..."}
                    </Text>
                  </Box>
                </HStack>

                <Box w="100%">
                  <Text fontSize="sm" color="gray.500">
                    Learning Progress
                  </Text>
                  <Progress mt={2} value={0} colorScheme="teal" />
                  <Text mt={2} fontSize="sm" color="gray.600">
                    0% complete • {courses?.length || 0} courses in progress
                  </Text>
                </Box>

                <Box w="100%">
                  <Text fontSize="sm" color="gray.500">
                    Achievements
                  </Text>
                  <HStack mt={2} spacing={2}>
                    <Badge colorScheme="green">Completed 1 Course</Badge>
                    <Badge colorScheme="purple">Active Learner</Badge>
                  </HStack>
                </Box>
              </VStack>
            </Box>

            {/* MAIN */}
            <Box>
              <Stack spacing={6}>
                <Heading size="lg">My Courses</Heading>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={6}>
                  {isLoading ? (
                    <Text>Loading courses...</Text>
                  ) : courses?.length === 0 ? (
                    <Box
                      p={8}
                      bg="white"
                      borderRadius="xl"
                      textAlign="center"
                      gridColumn="span 2"
                    >
                      <Text color="gray.500" mb={4}>
                        You haven't enrolled in any courses yet.
                      </Text>
                      <Button colorScheme="blue" onClick={() => navigate("/")}>
                        Browse Courses
                      </Button>
                    </Box>
                  ) : (
                    courses?.map((course) => (
                      <Box
                        key={course.id}
                        bg="white"
                        borderRadius="2xl"
                        overflow="hidden"
                        shadow="sm"
                        _hover={{ shadow: "lg" }}
                      >
                        <AspectRatio ratio={16 / 9}>
                          <Image
                            src={
                              course.thumbnail_url ||
                              `https://picsum.photos/seed/${course.id}/800/450`
                            }
                            alt={course.title}
                          />
                        </AspectRatio>

                        <Box p={{ base: 4, md: 5 }}>
                          <Heading fontSize={{ base: "md", md: "lg" }}>
                            {course.title}
                          </Heading>
                          <Text color="gray.500" fontSize="sm">
                            {course.teacher?.name}
                          </Text>

                          <Box mt={4}>
                            <Text fontSize="sm" color="gray.500">
                              Progress
                            </Text>
                            <Progress mt={2} value={0} />
                            <HStack mt={3} spacing={3}>
                              <Button
                                colorScheme="teal"
                                size={{ base: "sm", md: "md" }}
                                onClick={() =>
                                  navigate(`/courses/${course.id}`)
                                }
                              >
                                Continue
                              </Button>
                              <Button
                                variant="ghost"
                                size={{ base: "sm", md: "md" }}
                                onClick={() =>
                                  navigate(`/courses/${course.id}`)
                                }
                              >
                                Details
                              </Button>
                            </HStack>
                          </Box>
                        </Box>
                      </Box>
                    ))
                  )}
                </SimpleGrid>
              </Stack>
            </Box>

            {/* RIGHT ASIDE */}
            <Box
              bg="white"
              borderRadius="2xl"
              p={{ base: 4, md: 6 }}
              shadow="sm"
              position={{ base: "static", lg: "sticky" }}
              top={{ lg: "100px" }}
              alignSelf="start"
            >
              <Stack spacing={4}>
                <Heading size="sm">Upcoming</Heading>
                <Stack spacing={3}>
                  {upcoming.map((u) => (
                    <Box key={u.id} p={3} borderRadius="md" bg="gray.50">
                      <Text
                        fontWeight={600}
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {u.title}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {u.time}
                      </Text>
                    </Box>
                  ))}
                </Stack>

                <Heading size="sm" pt={4}>
                  Recommended
                </Heading>
                <Box p={3} borderRadius="md" bg="gray.50">
                  <Text fontWeight={600}>UI/UX Foundations</Text>
                  <Text fontSize="sm" color="gray.500">
                    Improve design skills with practical exercises.
                  </Text>
                  <Button mt={3} colorScheme="blue" size="sm">
                    Explore
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default StudentDashboardPage;
