import {
  Box,
  Container,
  Grid,
  Stack,
  Heading,
  Text,
  Avatar,
  SimpleGrid,
  Button,
  HStack,
  VStack,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Select,
  useToast,
  Center,
  Spinner,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Textarea,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import useCreateUser from "../Hooks/useCreateUser";
import useUpdateUser from "../Hooks/useUpdateUser";
import useDeleteUser from "../Hooks/useDeleteUser";
import useGetUsers from "../Hooks/useGetUsers";
import useCourses from "../Hooks/useCourses";
import useCreateCourse from "../Hooks/useCreateCourse";
import useUpdateCourse from "../Hooks/useUpdateCourse";
import useDeleteCourse from "../Hooks/useDeleteCourse";
import useUpdateCourseStatus from "../Hooks/useUpdateCourseStatus";
import Navbar from "../Components/Navbar";
import BookViewer from "../Components/BookViewer";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  CheckIcon,
  CloseIcon,
} from "@chakra-ui/icons";

/* ---------------- COMPONENT ---------------- */

const AdminDashboardPage = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isViewerOpen,
    onOpen: onViewerOpen,
    onClose: onViewerClose,
  } = useDisclosure();
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const toast = useToast();
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { data: users = [], isLoading: isLoadingUsers } = useGetUsers();

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const cancelRef = useRef(null);

  // COURSE MANAGEMENT
  const { data: coursesList =[] } = useCourses();
  const { mutate: createCourse, isPending: isCourseCreating } =
    useCreateCourse();
  const { mutate: updateCourse, isPending: isCourseUpdating } =
    useUpdateCourse();
  const { mutate: deleteCourse, isPending: isCourseDeleting } =
    useDeleteCourse();
  const { mutate: updateStatus, isPending: isStatusUpdating } =
    useUpdateCourseStatus();

  const {
    isOpen: isCourseOpen,
    onOpen: onCourseOpen,
    onClose: onCourseClose,
  } = useDisclosure();
  const {
    isOpen: isCourseDeleteOpen,
    onOpen: onCourseDeleteOpen,
    onClose: onCourseDeleteClose,
  } = useDisclosure();

  const [isCourseEditMode, setIsCourseEditMode] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    teacher_id: 0,
    price: 0,
    level: "beginner",
    category: "computer",
    thumbnail: null as File | null,
  });

  // Calculate stats and books
  const books = coursesList
    .flatMap((c: any) => c.resources || [])
    .filter((r: any) => r.type === "book" || r.type === "fliphtml");
  const stats = [
    {
      label: "Students",
      value: users.filter((u: any) => u.role === "student").length,
    },
    {
      label: "Teachers",
      value: users.filter((u: any) => u.role === "teacher").length,
    },
    { label: "Courses", value: coursesList.length },
    { label: "Books", value: books.length },
  ];

  const [courseFilter, setCourseFilter] = useState("all");

  const handleStatusUpdate = (
    courseId: number,
    status: "approved" | "rejected",
  ) => {
    updateStatus(
      { courseId, status },
      {
        onSuccess: () =>
          toast({ title: `Course ${status}`, status: "success" }),
        onError: () =>
          toast({ title: "Error updating status", status: "error" }),
      },
    );
  };

  const handleSaveCourse = () => {
    if (isCourseEditMode && selectedCourseId) {
      updateCourse(
        {
          id: selectedCourseId,
          ...newCourse,
          thumbnail: newCourse.thumbnail || (undefined as any),
        },
        {
          onSuccess: () => {
            toast({ title: "Course updated", status: "success" });
            onCourseClose();
          },
          onError: (err: any) => {
            toast({
              title: "Error updating course",
              description: err.response?.data?.message,
              status: "error",
            });
          },
        },
      );
    } else {
      createCourse(
        { ...newCourse, thumbnail: newCourse.thumbnail || (undefined as any) },
        {
          onSuccess: () => {
            toast({ title: "Course created", status: "success" });
            onCourseClose();
          },
          onError: (err: any) => {
            toast({
              title: "Error creating course",
              description: err.response?.data?.message,
              status: "error",
            });
          },
        },
      );
    }
  };

  const handleEditCourse = (course: any) => {
    setIsCourseEditMode(true);
    setSelectedCourseId(course.id);
    setNewCourse({
      title: course.title,
      description: course.description || "",
      teacher_id: course.teacher_id,
      price: parseInt(course.price) || 0,
      level: course.level,
      category: course.category || "computer",
      thumbnail: null,
    });
    onCourseOpen();
  };

  const handleDeleteCourseClick = (id: number) => {
    setCourseToDelete(id);
    onCourseDeleteOpen();
  };

  const handleConfirmDeleteCourse = () => {
    if (courseToDelete) {
      deleteCourse(courseToDelete, {
        onSuccess: () => {
          toast({ title: "Course deleted", status: "success" });
          onCourseDeleteClose();
        },
        onError: () =>
          toast({ title: "Error deleting course", status: "error" }),
      });
    }
  };

  const handleSaveUser = () => {
    if (isEditMode && selectedUserId) {
      // Update existing user
      const updateData: any = {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      };
      if (newUser.password) {
        updateData.password = newUser.password;
      }

      updateUser(
        { id: selectedUserId, data: updateData },
        {
          onSuccess: () => {
            toast({
              title: "User updated successfully",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            handleCloseModal();
          },
          onError: (error: any) => {
            toast({
              title: "Error updating user",
              description:
                error.response?.data?.message || "Something went wrong",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          },
        },
      );
    } else {
      // Create new user
      createUser(newUser, {
        onSuccess: () => {
          toast({
            title: "User created successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          handleCloseModal();
        },
        onError: (error: any) => {
          toast({
            title: "Error creating user",
            description:
              error.response?.data?.message || "Something went wrong",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        },
      });
    }
  };

  const handleCloseModal = () => {
    setNewUser({ name: "", email: "", password: "", role: "student" });
    setIsEditMode(false);
    setSelectedUserId(null);
    onClose();
  };

  const handleEditUser = (user: any) => {
    setIsEditMode(true);
    setSelectedUserId(user.id);
    setNewUser({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    onOpen();
  };

  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId);
    onDeleteOpen();
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete, {
        onSuccess: () => {
          toast({
            title: "User deleted successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          onDeleteClose();
          setUserToDelete(null);
        },
        onError: (error: any) => {
          toast({
            title: "Error deleting user",
            description:
              error.response?.data?.message || "Something went wrong",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        },
      });
    }
  };

  const menuItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "users", label: "Users" },
    { key: "courses", label: "Courses" },
    { key: "books", label: "Books" },
    { key: "settings", label: "Settings" },
  ];

  const openBook = (book: any) => {
    setSelectedBook(book);
    onViewerOpen();
  };

  return (
    <>
      <Navbar />

      <Box bg="gray.50" minH="100vh" pt={{ base: 20, md: 24 }} pb={12}>
        <Container maxW="7xl">
          <Grid templateColumns={{ base: "1fr", lg: "260px 1fr" }} gap={8}>
            {/* SIDEBAR */}
            <Box
              bg="white"
              borderRadius="2xl"
              p={6}
              shadow="sm"
              position="sticky"
              top="100px"
              alignSelf="start"
            >
              <VStack spacing={6} align="start">
                <HStack spacing={4}>
                  <Avatar size="lg" border="2px solid" borderColor="red.400" />
                  <Box>
                    <Heading size="sm">Admin Panel</Heading>
                    <Badge colorScheme="red">Administrator</Badge>
                  </Box>
                </HStack>

                <Stack spacing={2} w="100%">
                  {menuItems.map((item) => (
                    <Button
                      key={item.key}
                      w="100%"
                      justifyContent="flex-start"
                      variant={activeView === item.key ? "solid" : "ghost"}
                      colorScheme={activeView === item.key ? "red" : "gray"}
                      _hover={{
                        bg: activeView === item.key ? "red.500" : "gray.100",
                      }}
                      onClick={() => setActiveView(item.key)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Stack>
              </VStack>
            </Box>

            {/* MAIN CONTENT */}
            <Stack spacing={8}>
              {/* HEADER */}
              <Box
                bgGradient="linear(to-r, red.500, orange.400)"
                color="white"
                p={6}
                borderRadius="2xl"
              >
                <Heading size="md" textTransform="capitalize">
                  {activeView}
                </Heading>
                <Text opacity={0.9}>Manage {activeView} efficiently</Text>
              </Box>

              {/* DASHBOARD */}
              {activeView === "dashboard" && (
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                  {stats.map((s) => (
                    <Stat
                      key={s.label}
                      bg="white"
                      p={5}
                      borderRadius="2xl"
                      shadow="sm"
                    >
                      <StatLabel>{s.label}</StatLabel>
                      <StatNumber>{s.value}</StatNumber>
                    </Stat>
                  ))}
                </SimpleGrid>
              )}

              {/* USERS */}
              {activeView === "users" && (
                <Box bg="white" p={6} borderRadius="2xl" shadow="sm">
                  <HStack justify="space-between" mb={4}>
                    <Heading size="md">Users</Heading>
                    <Button
                      leftIcon={<AddIcon />}
                      colorScheme="red"
                      onClick={onOpen}
                    >
                      Add User
                    </Button>
                  </HStack>

                  {isLoadingUsers ? (
                    <Center py={10}>
                      <Spinner size="lg" />
                    </Center>
                  ) : (
                    <Stack spacing={3}>
                      {users.map((u) => (
                        <HStack
                          key={u.id}
                          justify="space-between"
                          p={3}
                          bg="gray.50"
                          borderRadius="lg"
                        >
                          <Box>
                            <Text fontWeight="600">{u.name}</Text>
                            <Text fontSize="sm" color="gray.600">
                              {u.email}
                            </Text>
                          </Box>
                          <HStack>
                            <Badge
                              colorScheme={
                                u.role === "teacher"
                                  ? "blue"
                                  : u.role === "admin"
                                    ? "red"
                                    : "teal"
                              }
                            >
                              {u.role}
                            </Badge>
                            <IconButton
                              icon={<EditIcon />}
                              size="sm"
                              aria-label="Edit"
                              onClick={() => handleEditUser(u)}
                            />
                            <IconButton
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              aria-label="Delete"
                              onClick={() => handleDeleteClick(u.id)}
                            />
                          </HStack>
                        </HStack>
                      ))}
                    </Stack>
                  )}

                  {/* CREATE/EDIT USER MODAL */}
                  <Modal isOpen={isOpen} onClose={handleCloseModal}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>
                        {isEditMode ? "Edit User" : "Create New User"}
                      </ModalHeader>
                      <ModalCloseButton />
                      <ModalBody pb={6}>
                        <VStack spacing={4}>
                          <FormControl>
                            <FormLabel>Full Name</FormLabel>
                            <Input
                              placeholder="Full Name"
                              value={newUser.name}
                              onChange={(e) =>
                                setNewUser({ ...newUser, name: e.target.value })
                              }
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input
                              placeholder="Email"
                              type="email"
                              value={newUser.email}
                              onChange={(e) =>
                                setNewUser({
                                  ...newUser,
                                  email: e.target.value,
                                })
                              }
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel>Password</FormLabel>
                            <Input
                              placeholder="Password"
                              type="password"
                              value={newUser.password}
                              onChange={(e) =>
                                setNewUser({
                                  ...newUser,
                                  password: e.target.value,
                                })
                              }
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel>Role</FormLabel>
                            <Select
                              value={newUser.role}
                              onChange={(e) =>
                                setNewUser({ ...newUser, role: e.target.value })
                              }
                            >
                              <option value="student">Student</option>
                              <option value="teacher">Teacher</option>
                              <option value="admin">Admin</option>
                            </Select>
                          </FormControl>
                        </VStack>
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          colorScheme="red"
                          mr={3}
                          onClick={handleSaveUser}
                          isLoading={isCreating || isUpdating}
                        >
                          Save
                        </Button>
                        <Button onClick={handleCloseModal}>Cancel</Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>

                  {/* DELETE CONFIRMATION DIALOG */}
                  <AlertDialog
                    isOpen={isDeleteOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onDeleteClose}
                  >
                    <AlertDialogOverlay>
                      <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                          Delete User
                        </AlertDialogHeader>

                        <AlertDialogBody>
                          Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                          <Button ref={cancelRef} onClick={onDeleteClose}>
                            Cancel
                          </Button>
                          <Button
                            colorScheme="red"
                            onClick={handleConfirmDelete}
                            ml={3}
                            isLoading={isDeleting}
                          >
                            Delete
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialogOverlay>
                  </AlertDialog>
                </Box>
              )}
              {/* BOOKS */}
              {activeView === "books" && (
                <Box bg="white" p={6} borderRadius="2xl" shadow="sm">
                  <Heading size="md" mb={4}>
                    Books Library
                  </Heading>
                  <Stack spacing={3}>
                    {books.map((book: any) => (
                      <HStack
                        key={book.id}
                        justify="space-between"
                        p={3}
                        bg="gray.50"
                        borderRadius="lg"
                      >
                        <Box>
                          <Text fontWeight="600">{book.title}</Text>
                          <Text fontSize="xs" color="gray.500">
                            Course:{" "}
                            {
                              coursesList.find(
                                (c: any) => c.id === book.course_id,
                              )?.title
                            }
                          </Text>
                        </Box>
                        <Button
                          size="sm"
                          colorScheme="purple"
                          onClick={() => openBook(book)}
                        >
                          View
                        </Button>
                      </HStack>
                    ))}
                    {books.length === 0 && (
                      <Text color="gray.500">
                        No books found across courses.
                      </Text>
                    )}
                  </Stack>
                </Box>
              )}

              {/* COURSES */}
              {activeView === "courses" && (
                <Box bg="white" p={6} borderRadius="2xl" shadow="sm">
                  <HStack justify="space-between" mb={4}>
                    <Heading size="md">Courses</Heading>
                    <Heading size="md">Courses</Heading>
                    <HStack>
                      <Select
                        w="150px"
                        size="sm"
                        value={courseFilter}
                        onChange={(e) => setCourseFilter(e.target.value)}
                      >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </Select>
                      <Button
                        leftIcon={<AddIcon />}
                        colorScheme="orange"
                        onClick={() => {
                          setIsCourseEditMode(false);
                          setNewCourse({
                            title: "",
                            description: "",
                            teacher_id:
                              users.find((u) => u.role === "teacher")?.id || 0,
                            price: 0,
                            level: "beginner",
                            category: "computer",
                            thumbnail: null,
                          });
                          onCourseOpen();
                        }}
                      >
                        Add Course
                      </Button>
                    </HStack>
                  </HStack>

                  <Stack spacing={3}>
                    {coursesList
                      .filter(
                        (c: any) =>
                          courseFilter === "all" || c.status === courseFilter,
                      )
                      .map((c: any) => (
                        <HStack
                          key={c.id}
                          justify="space-between"
                          p={3}
                          bg="gray.50"
                          borderRadius="lg"
                        >
                          <Box>
                            <HStack>
                              <Text fontWeight="600">{c.title}</Text>
                              <Badge
                                colorScheme={
                                  c.status === "approved"
                                    ? "green"
                                    : c.status === "rejected"
                                      ? "red"
                                      : "yellow"
                                }
                              >
                                {c.status}
                              </Badge>
                            </HStack>
                            <Text fontSize="xs" color="gray.500">
                              Teacher: {c.teacher?.name || "Unknown"}
                            </Text>
                            <Badge
                              colorScheme={
                                c.category === "computer"
                                  ? "blue"
                                  : c.category === "english"
                                    ? "green"
                                    : "gray"
                              }
                            >
                              {c.category || "general"}
                            </Badge>
                          </Box>
                          <HStack>
                            {c.status === "pending" && (
                              <>
                                <IconButton
                                  icon={<CheckIcon />}
                                  size="sm"
                                  colorScheme="green"
                                  aria-label="Approve"
                                  isLoading={isStatusUpdating}
                                  onClick={() =>
                                    handleStatusUpdate(c.id, "approved")
                                  }
                                />
                                <IconButton
                                  icon={<CloseIcon />}
                                  size="sm"
                                  colorScheme="red"
                                  aria-label="Reject"
                                  isLoading={isStatusUpdating}
                                  onClick={() =>
                                    handleStatusUpdate(c.id, "rejected")
                                  }
                                />
                              </>
                            )}
                            <Badge colorScheme="blue">{c.level}</Badge>
                            <IconButton
                              icon={<EditIcon />}
                              size="sm"
                              aria-label="Edit"
                              onClick={() => handleEditCourse(c)}
                            />
                            <IconButton
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              aria-label="Delete"
                              onClick={() => handleDeleteCourseClick(c.id)}
                            />
                          </HStack>
                        </HStack>
                      ))}
                  </Stack>

                  {/* CREATE/EDIT COURSE MODAL */}
                  <Modal isOpen={isCourseOpen} onClose={onCourseClose}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>
                        {isCourseEditMode ? "Edit Course" : "Create New Course"}
                      </ModalHeader>
                      <ModalCloseButton />
                      <ModalBody pb={6}>
                        <VStack spacing={4}>
                          <FormControl isRequired>
                            <FormLabel>Title</FormLabel>
                            <Input
                              value={newCourse.title}
                              onChange={(e) =>
                                setNewCourse({
                                  ...newCourse,
                                  title: e.target.value,
                                })
                              }
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                              value={newCourse.description}
                              onChange={(e) =>
                                setNewCourse({
                                  ...newCourse,
                                  description: e.target.value,
                                })
                              }
                            />
                          </FormControl>
                          <FormControl isRequired>
                            <FormLabel>Teacher</FormLabel>
                            <Select
                              value={newCourse.teacher_id}
                              onChange={(e) =>
                                setNewCourse({
                                  ...newCourse,
                                  teacher_id: parseInt(e.target.value),
                                })
                              }
                            >
                              {users
                                .filter((u: any) => u.role === "teacher")
                                .map((u: any) => (
                                  <option key={u.id} value={u.id}>
                                    {u.name}
                                  </option>
                                ))}
                            </Select>
                          </FormControl>
                          <Grid templateColumns="1fr 1fr" gap={4} w="100%">
                            <FormControl>
                              <FormLabel>Price (AFN)</FormLabel>
                              <Input
                                type="number"
                                value={newCourse.price}
                                onChange={(e) =>
                                  setNewCourse({
                                    ...newCourse,
                                    price: parseInt(e.target.value),
                                  })
                                }
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Level</FormLabel>
                              <Select
                                value={newCourse.level}
                                onChange={(e) =>
                                  setNewCourse({
                                    ...newCourse,
                                    level: e.target.value,
                                  })
                                }
                              >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">
                                  Intermediate
                                </option>
                                <option value="advanced">Advanced</option>
                              </Select>
                            </FormControl>

                            <FormControl>
                              <FormLabel>Category</FormLabel>
                              <Select
                                value={newCourse.category}
                                onChange={(
                                  e: React.ChangeEvent<HTMLSelectElement>,
                                ) =>
                                  setNewCourse({
                                    ...newCourse,
                                    category: e.target.value,
                                  })
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
                            <FormLabel>Thumbnail</FormLabel>
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
                        <Button
                          colorScheme="red"
                          mr={3}
                          onClick={handleSaveCourse}
                          isLoading={isCourseCreating || isCourseUpdating}
                        >
                          Save
                        </Button>
                        <Button onClick={onCourseClose}>Cancel</Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>

                  {/* DELETE COURSE CONFIRMATION */}
                  <AlertDialog
                    isOpen={isCourseDeleteOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onCourseDeleteClose}
                  >
                    <AlertDialogOverlay>
                      <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                          Delete Course
                        </AlertDialogHeader>
                        <AlertDialogBody>
                          Are you sure? This will delete the course and all its
                          content.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                          <Button ref={cancelRef} onClick={onCourseDeleteClose}>
                            Cancel
                          </Button>
                          <Button
                            colorScheme="red"
                            onClick={handleConfirmDeleteCourse}
                            ml={3}
                            isLoading={isCourseDeleting}
                          >
                            Delete
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialogOverlay>
                  </AlertDialog>
                </Box>
              )}

              {/* BOOKS */}
              {/* BOOKS */}
              {activeView === "books" && (
                <Box bg="white" p={6} borderRadius="2xl" shadow="sm">
                  <Heading size="md" mb={4}>
                    Books Library
                  </Heading>
                  <Stack spacing={3}>
                    {books.map((book: any) => (
                      <HStack
                        key={book.id}
                        justify="space-between"
                        p={3}
                        bg="gray.50"
                        borderRadius="lg"
                      >
                        <Box>
                          <Text fontWeight="600">{book.title}</Text>
                          <Text fontSize="xs" color="gray.500">
                            Course:{" "}
                            {
                              coursesList.find(
                                (c: any) => c.id === book.course_id,
                              )?.title
                            }
                          </Text>
                        </Box>
                        <Button
                          size="sm"
                          colorScheme="purple"
                          onClick={() => openBook(book)}
                        >
                          View
                        </Button>
                      </HStack>
                    ))}
                    {books.length === 0 && (
                      <Text color="gray.500">
                        No books found across courses.
                      </Text>
                    )}
                  </Stack>
                </Box>
              )}

              {/* RESOURCES / SETTINGS */}
              {/* SETTINGS */}
              {activeView === "settings" && (
                <Box bg="white" p={6} borderRadius="2xl" shadow="sm">
                  <Text color="gray.500">
                    Settings section is ready for future expansion.
                  </Text>
                </Box>
              )}
            </Stack>
          </Grid>
        </Container>
      </Box>
      <BookViewer
        isOpen={isViewerOpen}
        onClose={onViewerClose}
        book={selectedBook}
      />
    </>
  );
};

export default AdminDashboardPage;
