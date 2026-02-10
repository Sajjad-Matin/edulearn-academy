import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  Box,
} from "@chakra-ui/react";

export default function HoverMenu() {
  return (
    <Popover trigger="hover" placement="bottom-start" openDelay={150}>
      <PopoverTrigger>
        <Text
          fontWeight="500"
          cursor="pointer"
          _hover={{ color: "blue.500" }}
        >
          Categories
        </Text>
      </PopoverTrigger>

      <PopoverContent
        p={0}
        border="1px solid"
        borderColor="gray.200"
        boxShadow="xl"
        w="260px"
      >
        <PopoverBody p={4}>
          <Box _hover={{ bg: "gray.50" }} p={2} borderRadius="md">
            Web Development
          </Box>
          <Box _hover={{ bg: "gray.50" }} p={2} borderRadius="md">
            Mobile Development
          </Box>
          <Box _hover={{ bg: "gray.50" }} p={2} borderRadius="md">
            Data Science
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
