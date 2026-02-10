import {
  Box,
  Container,
  Grid,
  Stack,
  Heading,
  Text,
  Avatar,
  Button,
  HStack,
  VStack,
  Badge,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useToast,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Checkbox,
  Flex,
} from "@chakra-ui/react";
import { ExternalLinkIcon, AddIcon } from "@chakra-ui/icons";
import Navbar from "../Components/Navbar";
import useCourses from "../Hooks/useCourses";
import useCreateCourse from "../Hooks/useCreateCourse";
import useAuth from "../Hooks/useAuth";
import { useState } from "react";
import useAddSection from "../Hooks/useAddSection";
import useAddLecture from "../Hooks/useAddLecture";

import useAddResource from "../Hooks/useAddResource";
import BookViewer from "../Components/BookViewer";
import { ViewIcon } from "@chakra-ui/icons";

const TeacherDashboardPage = () => {
  const { data: user } = useAuth();
  const { data: courses, isLoading } = useCourses();
  const createCourse = useCreateCourse();
  const addSection = useAddSection();
  const addLecture = useAddLecture();
  const addResource = useAddResource();
  const toast = useToast();

  const {
    isOpen: isCourseOpen,
    onOpen: onCourseOpen,
    onClose: onCourseClose,
  } = useDisclosure();
  const {
    isOpen: isSectionOpen,
    onOpen: onSectionOpen,
    onClose: onSectionClose,
  } = useDisclosure();
  const {
    isOpen: isLectureOpen,
    onOpen: onLectureOpen,
    onClose: onLectureClose,
  } = useDisclosure();
  const {
    isOpen: isResourceOpen,
    onOpen: onResourceOpen,
    onClose: onResourceClose,
  } = useDisclosure();
  const {
    isOpen: isViewerOpen,
    onOpen: onViewerOpen,
    onClose: onViewerClose,
  } = useDisclosure();

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: 0,
    level: "beginner",
    category: "computer",
    thumbnail: null as File | null,
  });
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [newSection, setNewSection] = useState({ title: "", order: 0 });
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(
    null,
  );
  const [newLecture, setNewLecture] = useState({
    title: "",
    content: "",
    video_type: "file" as "file" | "youtube",
    video: null as File | null,
    external_url: "",
    is_preview: false,
  });
  const [newResource, setNewResource] = useState({
    title: "",
    type: "book",
    file: null as File | null,
    link: "",
  });
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const handleCreateCourse = async () => {
    if (!user) return;
    try {
      await createCourse.mutateAsync({
        ...newCourse,
        teacher_id: user.id,
        thumbnail: newCourse.thumbnail || undefined,
      });
      toast({ title: "Course created", status: "success" });
      onCourseClose();
    } catch (err: any) {
      toast({
        title: "Error creating course",
        description: err.response?.data?.message,
        status: "error",
      });
    }
  };

  const handleAddSection = async () => {
    if (!selectedCourseId) return;
    try {
      await addSection.mutateAsync({
        courseId: selectedCourseId,
        title: newSection.title,
        order: newSection.order,
      });
      toast({ title: "Section added", status: "success" });
      setNewSection({ title: "", order: 0 }); // Reset state
      onSectionClose();
    } catch (err: any) {
      toast({
        title: "Error adding section",
        description: err.response?.data?.message,
        status: "error",
      });
    }
  };

  const handleAddLecture = async () => {
    if (!selectedSectionId || !selectedCourseId) return;
    try {
      await addLecture.mutateAsync({
        sectionId: selectedSectionId,
        courseId: selectedCourseId,
        title: newLecture.title,
        content: newLecture.content,
        video_type: newLecture.video_type,
        video: newLecture.video || undefined,
        external_url: newLecture.external_url,
        is_preview: newLecture.is_preview,
      });
      toast({ title: "Lecture added", status: "success" });
      setNewLecture({
        title: "",
        content: "",
        video_type: "file",
        video: null,
        external_url: "",
        is_preview: false,
      }); // Reset state
      onLectureClose();
    } catch (err: any) {
      toast({
        title: "Error adding lecture",
        description: err.response?.data?.message,
        status: "error",
      });
    }
  };

  const handleAddResource = async () => {
    if (!selectedCourseId) return;
    try {
      await addResource.mutateAsync({
        courseId: selectedCourseId,
        title: newResource.title,
        type: newResource.link ? "fliphtml" : "book",
        file: newResource.file || undefined,
        link: newResource.link,
      });
      toast({ title: "Resource added", status: "success" });
      setNewResource({ title: "", type: "book", file: null, link: "" });
      onResourceClose();
    } catch (err: any) {
      toast({
        title: "Error adding resource",
        description: err.response?.data?.message,
        status: "error",
      });
    }
  };

  const openBook = (book: any) => {
    setSelectedBook(book);
    onViewerOpen();
  };

  return (
    <>
      <Navbar />

      <Box bg="gray.50" minH="100vh" pt={{ base: 20, md: 24 }} pb={12}>
        <Container maxW="7xl">
          <Grid
            templateColumns={{ base: "1fr", lg: "280px 1fr" }}
            gap={{ base: 6, md: 8 }}
          >
            {/* LEFT SIDEBAR */}
            <Box
              bg="white"
              borderRadius="2xl"
              p={{ base: 4, md: 6 }}
              shadow="sm"
              position={{ lg: "sticky" }}
              top="100px"
              alignSelf="start"
            >
              <VStack spacing={6} align="start">
                <HStack spacing={4}>
                  <Avatar
                    size="lg"
                    name={user?.name || "Teacher"}
                    border="2px solid"
                    borderColor="blue.400"
                  />
                  <Box>
                    <Heading size="sm">{user?.name || "Teacher Name"}</Heading>
                    <Badge mt={1} colorScheme="blue">
                      Instructor
                    </Badge>
                  </Box>
                </HStack>

                <Button
                  colorScheme="blue"
                  width="100%"
                  leftIcon={<AddIcon />}
                  onClick={onCourseOpen}
                >
                  Create New Course
                </Button>
              </VStack>
            </Box>

            {/* MAIN CONTENT */}
            <Stack spacing={10}>
              <Box
                bgGradient="linear(to-r, blue.500, teal.400)"
                color="white"
                p={{ base: 5, md: 6 }}
                borderRadius="2xl"
              >
                <Heading size="md">Teacher Dashboard</Heading>
                <Text opacity={0.9} mt={1}>
                  Manage your courses, sections, and video lectures.
                </Text>
              </Box>

              {/* COURSES MANAGEMENT */}
              <Box>
                <Heading size="lg" mb={6}>
                  My Courses
                </Heading>

                {isLoading ? (
                  <Text>Loading courses...</Text>
                ) : (
                  <Stack spacing={6}>
                    {courses
                      ?.filter((c) => c.teacher_id === user?.id)
                      .map((course) => (
                        <Box
                          key={course.id}
                          bg="white"
                          borderRadius="2xl"
                          p={6}
                          shadow="sm"
                        >
                          <Flex justify="space-between" align="start" mb={4}>
                            <Box>
                              <Heading size="md">{course.title}</Heading>
                              <Text
                                fontSize="sm"
                                color="gray.500"
                                noOfLines={2}
                                mt={1}
                              >
                                {course.description}
                              </Text>
                            </Box>
                            <Badge colorScheme="blue">{course.level}</Badge>
                            <Badge
                              ml={2}
                              colorScheme={
                                course.status === "approved"
                                  ? "green"
                                  : course.status === "rejected"
                                    ? "red"
                                    : "yellow"
                              }
                            >
                              {course.status}
                            </Badge>
                          </Flex>

                          <Divider mb={4} />

                          <HStack spacing={4}>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              variant="outline"
                              onClick={() => {
                                setSelectedCourseId(course.id);
                                onSectionOpen();
                              }}
                            >
                              Add Section
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="purple"
                              variant="outline"
                              onClick={() => {
                                setSelectedCourseId(course.id);
                                onResourceOpen();
                              }}
                            >
                              Add Book/Resource
                            </Button>
                          </HStack>

                          {/* Quick View of Sections */}
                          <Box mt={4}>
                            <Text fontWeight="bold" fontSize="sm" mb={2}>
                              Course Content:
                            </Text>
                            <Accordion allowMultiple>
                              {course.sections?.map((section) => (
                                <AccordionItem key={section.id}>
                                  <h2>
                                    <AccordionButton>
                                      <Box
                                        flex="1"
                                        textAlign="left"
                                        fontSize="xs"
                                        fontWeight="semibold"
                                      >
                                        {section.title} (
                                        {section.lectures?.length || 0}{" "}
                                        Lectures)
                                      </Box>
                                      <AccordionIcon />
                                    </AccordionButton>
                                  </h2>
                                  <AccordionPanel pb={2}>
                                    <VStack align="stretch" spacing={1}>
                                      {section.lectures?.map((lec) => (
                                        <Text
                                          key={lec.id}
                                          fontSize="xs"
                                          color="gray.600"
                                        >
                                          • {lec.title}
                                        </Text>
                                      ))}
                                      <Button
                                        size="xs"
                                        colorScheme="teal"
                                        variant="ghost"
                                        mt={2}
                                        onClick={() => {
                                          setSelectedCourseId(course.id);
                                          setSelectedSectionId(section.id);
                                          onLectureOpen();
                                        }}
                                      >
                                        + Add Lecture
                                      </Button>
                                    </VStack>
                                  </AccordionPanel>
                                </AccordionItem>
                              ))}
                            </Accordion>

                            {/* Resources List */}
                            {course.resources &&
                              course.resources.length > 0 && (
                                <Box mt={4}>
                                  <Text fontWeight="bold" fontSize="sm" mb={2}>
                                    Books & Resources:
                                  </Text>
                                  <VStack align="stretch" spacing={2}>
                                    {course.resources.map((res: any) => (
                                      <HStack
                                        key={res.id}
                                        justify="space-between"
                                        bg="gray.50"
                                        p={2}
                                        borderRadius="md"
                                      >
                                        <HStack>
                                          <Icon
                                            as={
                                              res.type === "fliphtml"
                                                ? ExternalLinkIcon
                                                : ViewIcon
                                            }
                                            color="purple.500"
                                          />
                                          <Text fontSize="sm">{res.title}</Text>
                                          {res.type === "fliphtml" && (
                                            <Badge colorScheme="purple">
                                              FlipBook
                                            </Badge>
                                          )}
                                        </HStack>
                                        <Button
                                          size="xs"
                                          onClick={() => openBook(res)}
                                        >
                                          View
                                        </Button>
                                      </HStack>
                                    ))}
                                  </VStack>
                                </Box>
                              )}

                            {!course.sections?.length &&
                              !course.resources?.length && (
                                <Text fontSize="xs" color="gray.400 italic">
                                  No sections created yet.
                                </Text>
                              )}
                          </Box>
                        </Box>
                      ))}
                  </Stack>
                )}
              </Box>
            </Stack>
          </Grid>
        </Container>
      </Box>

      {/* CREATE COURSE MODAL */}
      <Modal isOpen={isCourseOpen} onClose={onCourseClose}>
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader>Create New Course</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  value={newCourse.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewCourse({ ...newCourse, title: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={newCourse.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                />
              </FormControl>
              <Grid templateColumns="1fr 1fr" gap={4} w="100%">
                <FormControl>
                  <FormLabel>Price (AFN)</FormLabel>
                  <Input
                    type="number"
                    value={newCourse.price}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewCourse({
                        ...newCourse,
                        price: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Level</FormLabel>
                  <Select
                    value={newCourse.level}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setNewCourse({ ...newCourse, level: e.target.value })
                    }
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={newCourse.category}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setNewCourse({ ...newCourse, category: e.target.value })
                    }
                  >
                    <option value="computer">Computer</option>
                    <option value="english">English</option>
                    <option value="math">Math</option>
                    <option value="science">Science</option>
                  </Select>
                </FormControl>
              </Grid>
              <FormControl>
                <FormLabel>Thumbnail Image</FormLabel>
                <Input
                  type="file"
                  pt={1}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      thumbnail: e.target.files?.[0] || null,
                    })
                  }
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCourseClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleCreateCourse}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ADD SECTION MODAL */}
      <Modal isOpen={isSectionOpen} onClose={onSectionClose}>
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader>Add New Section</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Section Title</FormLabel>
                <Input
                  value={newSection.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewSection({ ...newSection, title: e.target.value })
                  }
                  placeholder="e.g. Getting Started"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Order</FormLabel>
                <Input
                  type="number"
                  value={newSection.order}
                  onChange={(e) =>
                    setNewSection({
                      ...newSection,
                      order: parseInt(e.target.value),
                    })
                  }
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onSectionClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleAddSection}
              isLoading={addSection.isPending}
            >
              Add Section
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ADD LECTURE MODAL */}
      <Modal isOpen={isLectureOpen} onClose={onLectureClose}>
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader>Add New Lecture</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Lecture Title</FormLabel>
                <Input
                  value={newLecture.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewLecture({ ...newLecture, title: e.target.value })
                  }
                  placeholder="e.g. Introduction to React"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Content/Description</FormLabel>
                <Textarea
                  value={newLecture.content}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewLecture({ ...newLecture, content: e.target.value })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Video Type</FormLabel>
                <Select
                  value={newLecture.video_type}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const type = e.target.value as "file" | "youtube";
                    setNewLecture({
                      ...newLecture,
                      video_type: type,
                      video: type === "youtube" ? null : newLecture.video,
                      external_url:
                        type === "file" ? "" : newLecture.external_url,
                    });
                  }}
                >
                  <option value="file">Manual Upload</option>
                  <option value="youtube">YouTube Link</option>
                </Select>
              </FormControl>

              {newLecture.video_type === "file" ? (
                <FormControl>
                  <FormLabel>Video File</FormLabel>
                  <Input
                    type="file"
                    pt={1}
                    accept="video/*"
                    onChange={(e) =>
                      setNewLecture({
                        ...newLecture,
                        video: e.target.files?.[0] || null,
                      })
                    }
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Max 2GB. mp4, mov, avi, mkv, webm accepted.
                  </Text>
                </FormControl>
              ) : (
                <FormControl isRequired>
                  <FormLabel>YouTube URL</FormLabel>
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={newLecture.external_url}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewLecture({
                        ...newLecture,
                        external_url: e.target.value,
                      })
                    }
                  />
                </FormControl>
              )}
              <Checkbox
                isChecked={newLecture.is_preview}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewLecture({ ...newLecture, is_preview: e.target.checked })
                }
              >
                Allow Preview (Free)
              </Checkbox>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onLectureClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleAddLecture}
              isLoading={addLecture.isPending}
            >
              Add Lecture
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ADD RESOURCE MODAL */}
      <Modal isOpen={isResourceOpen} onClose={onResourceClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Book / Resource</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  value={newResource.title}
                  onChange={(e) =>
                    setNewResource({ ...newResource, title: e.target.value })
                  }
                  placeholder="e.g. Course Textbook"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Source Type</FormLabel>
                <Select
                  value={newResource.link ? "link" : "file"}
                  onChange={(e) => {
                    if (e.target.value === "link") {
                      setNewResource({
                        ...newResource,
                        file: null,
                        link: "https://",
                      });
                    } else {
                      setNewResource({ ...newResource, link: "", file: null });
                    }
                  }}
                >
                  <option value="file">Upload PDF File</option>
                  <option value="link">FlipHTML5 Link</option>
                </Select>
              </FormControl>

              {newResource.link !== "" ? (
                <FormControl isRequired>
                  <FormLabel>FlipHTML5 URL</FormLabel>
                  <Input
                    value={newResource.link}
                    onChange={(e) =>
                      setNewResource({ ...newResource, link: e.target.value })
                    }
                    placeholder="https://fliphtml5.com/..."
                  />
                </FormControl>
              ) : (
                <FormControl isRequired>
                  <FormLabel>PDF File</FormLabel>
                  <Input
                    type="file"
                    pt={1}
                    accept="application/pdf"
                    onChange={(e) =>
                      setNewResource({
                        ...newResource,
                        file: e.target.files?.[0] || null,
                      })
                    }
                  />
                </FormControl>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onResourceClose}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleAddResource}
              isLoading={addResource.isPending}
            >
              Add Resource
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <BookViewer
        isOpen={isViewerOpen}
        onClose={onViewerClose}
        book={selectedBook}
      />
    </>
  );
};

export default TeacherDashboardPage;
