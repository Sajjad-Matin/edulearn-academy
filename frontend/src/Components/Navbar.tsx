import {
  HStack,
  Image,
  Text,
  Box,
  Button,
  Spinner,
  Container,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import { Link } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import useLogout from "../Hooks/useLogout";
import logo from "../assets/image.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { data: user, isLoading } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      as="nav"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      py={scrolled ? 3 : 6}
      bg={scrolled ? "rgba(255, 255, 255, 0.8)" : "transparent"}
      backdropFilter={scrolled ? "blur(12px)" : "none"}
      borderBottom="1px solid"
      borderColor={scrolled ? "slate.100" : "transparent"}
    >
      <Container maxW="7xl">
        <HStack spacing={8} justify="space-between">
          {/* Logo */}
          <Link to="/">
            <Image
              src={logo}
              alt="EduLearn Logo"
              height={scrolled ? "80px" : "100px"}
              width="auto"
              objectFit="contain"
              transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
              cursor="pointer"
              _hover={{ transform: "scale(1.05)" }}
            />
          </Link>

          {/* Links & Search */}
          <HStack
            spacing={10}
            flex="1"
            justify="center"
            display={{ base: "none", md: "flex" }}
          >
            <Link to="/categories">
              <Text
                fontWeight="600"
                fontSize="sm"
                color="slate.700"
                _hover={{ color: "brand.600" }}
                transition="color 0.2s"
              >
                Explore Categories
              </Text>
            </Link>

            <Link to="/categories">
              <Text
                fontWeight="600"
                fontSize="sm"
                color="slate.700"
                _hover={{ color: "brand.600" }}
                transition="color 0.2s"
              >
                Explore All
              </Text>
            </Link>

            <Box maxW="300px" w="100%">
              <SearchInput onSearch={() => {}} />
            </Box>
          </HStack>

          {/* Auth Actions */}
          <HStack spacing={4}>
            {isLoading ? (
              <Spinner size="sm" color="brand.500" />
            ) : user ? (
              <HStack spacing={4}>
                <Button
                  as={Link}
                  to={
                    user.role === "admin"
                      ? "/dashboard/admin"
                      : user.role === "teacher"
                        ? "/dashboard/teacher"
                        : "/dashboard/student"
                  }
                  variant="ghost"
                  size="sm"
                  colorScheme="brand"
                >
                  Dashboard
                </Button>
                <Button
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                  borderRadius="xl"
                  onClick={() => logout()}
                  isLoading={isLoggingOut}
                >
                  Log Out
                </Button>
              </HStack>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="ghost"
                  size="sm"
                  color="slate.700"
                >
                  Log In
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="premium"
                  size="md"
                  px={6}
                >
                  Get Started
                </Button>
              </>
            )}
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
};

export default Navbar;
