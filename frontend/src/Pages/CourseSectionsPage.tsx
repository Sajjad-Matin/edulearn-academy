import {
  Box,
  Heading,
  Image,
  Text,
  Container,
  Grid,
  Badge,
  Flex,
  Spinner,
  Center,
  HStack,
  Icon,
  Stack,
  Avatar,
  Button,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import useCourses from "../Hooks/useCourses";
import { FiClock, FiVideo, FiChevronLeft } from "react-icons/fi";

const CourseSectionsPage = () => {
  const { category } = useParams<{ category: string }>();
  const { data: courses, isLoading, error } = useCourses(category);

  if (isLoading) {
    return (
      <Center h="70vh">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }

  if (error || !courses) {
    return (
      <Center h="70vh">
        <Stack align="center" spacing={4}>
          <Text color="red.500" fontWeight="600">
            Error loading courses. Please try again later.
          </Text>
          <Link to="/">
            <Text color="brand.600" fontWeight="700">
              Go Back Home
            </Text>
          </Link>
        </Stack>
      </Center>
    );
  }

  const sortedCourses = [...courses].reverse(); // Show newest first? Or just use as is

  return (
    <Box minH="100vh" pt={32} pb={20}>
      <Container maxW="7xl">
        <HStack mb={10} spacing={4}>
          <Link to="/">
            <Center
              boxSize="40px"
              bg="white"
              rounded="xl"
              shadow="sm"
              border="1px solid"
              borderColor="slate.100"
              _hover={{ color: "brand.600", borderColor: "brand.200" }}
            >
              <Icon as={FiChevronLeft} boxSize={5} />
            </Center>
          </Link>
          <Stack spacing={0}>
            <Text
              fontSize="xs"
              fontWeight="800"
              color="brand.600"
              textTransform="uppercase"
              letterSpacing="widest"
            >
              Explore Courses
            </Text>
            <Heading
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="800"
              textTransform="capitalize"
            >
              {category?.replace(/-/g, " ")} Learning Path
            </Heading>
          </Stack>
        </HStack>

        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={10}
        >
          {sortedCourses.map((course) => (
            <Link to={`/course/${course.id}`} key={course.id}>
              <Box
                bg="white"
                borderRadius="3xl"
                overflow="hidden"
                border="1px solid"
                borderColor="slate.100"
                transition="all 0.3s cubic-bezier(.08,.52,.52,1)"
                h="100%"
                display="flex"
                flexDirection="column"
                _hover={{
                  transform: "translateY(-6px)",
                  shadow: "2xl",
                  borderColor: "brand.100",
                }}
                role="group"
              >
                <Box position="relative" h="200px">
                  <Image
                    src={
                      course.thumbnail_url ||
                      `https://picsum.photos/seed/${course.id}/400/225`
                    }
                    alt={course.title}
                    objectFit="cover"
                    w="100%"
                    h="100%"
                    transition="transform 0.5s ease"
                    _groupHover={{ transform: "scale(1.05)" }}
                  />
                  <Badge
                    position="absolute"
                    top={4}
                    left={4}
                    bg="white"
                    color="slate.800"
                    px={3}
                    py={1}
                    rounded="full"
                    shadow="md"
                    fontSize="xs"
                    fontWeight="700"
                  >
                    {course.level?.toUpperCase()}
                  </Badge>
                </Box>

                <Box p={8} display="flex" flexDirection="column" flex="1">
                  <Text
                    fontSize="xs"
                    fontWeight="800"
                    color="brand.600"
                    textTransform="uppercase"
                    mb={2}
                    letterSpacing="wider"
                  >
                    {course.category || category}
                  </Text>

                  <Heading
                    fontSize="xl"
                    mb={4}
                    noOfLines={2}
                    fontWeight="800"
                    lineHeight="base"
                    flex="1"
                  >
                    {course.title}
                  </Heading>

                  <HStack spacing={3} mb={6}>
                    <Avatar
                      size="xs"
                      name={course.teacher?.name}
                      src={`https://ui-avatars.com/api/?name=${course.teacher?.name}&background=6366f1&color=fff`}
                    />
                    <Text fontSize="sm" fontWeight="600" color="slate.600">
                      {course.teacher?.name || "Instructor"}
                    </Text>
                  </HStack>

                  <Flex
                    justify="space-between"
                    align="center"
                    pt={6}
                    borderTop="1px solid"
                    borderColor="slate.50"
                  >
                    <HStack spacing={4} color="slate.400">
                      <HStack spacing={1}>
                        <Icon as={FiVideo} />
                        <Text fontSize="xs" fontWeight="700">
                          {course.lectures_count || 0}
                        </Text>
                      </HStack>
                      <HStack spacing={1}>
                        <Icon as={FiClock} />
                        <Text fontSize="xs" fontWeight="700">
                          {course.sections_count || 0}
                        </Text>
                      </HStack>
                    </HStack>
                    <Text fontWeight="800" color="brand.600" fontSize="lg">
                      {parseFloat(course.price) === 0
                        ? "Free"
                        : `${course.price} AFN`}
                    </Text>
                  </Flex>
                </Box>
              </Box>
            </Link>
          ))}
        </Grid>

        {!isLoading && sortedCourses.length === 0 && (
          <Center
            py={20}
            bg="slate.50"
            borderRadius="3xl"
            border="2px dashed"
            borderColor="slate.200"
          >
            <Stack align="center" spacing={4}>
              <Text color="slate.500" fontWeight="600">
                No courses found in this category.
              </Text>
              <Link to="/">
                <Button variant="premium">Explore Other Categories</Button>
              </Link>
            </Stack>
          </Center>
        )}
      </Container>
    </Box>
  );
};

export default CourseSectionsPage;
