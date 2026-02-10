import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Heading,
  Text,
  Button,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

interface BookViewerProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    title: string;
    file_path?: string;
    link?: string;
    type?: string;
  } | null;
}

const BookViewer = ({ isOpen, onClose, book }: BookViewerProps) => {
  if (!book) return null;

  const isFlipHtml = book.type === "fliphtml" || !!book.link;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent height="90vh">
        <ModalHeader>{book.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0} h="100%">
          {isFlipHtml && book.link ? (
            <Box w="100%" h="100%">
              <iframe
                src={book.link}
                title={book.title}
                width="100%"
                height="100%"
                allowFullScreen
                style={{ border: "none" }}
              />
            </Box>
          ) : book.file_path ? (
            <Box p={10} textAlign="center">
              <Heading size="md" mb={4}>
                This is a downloadable file.
              </Heading>
              <Button
                as="a"
                href={book.file_path}
                target="_blank"
                colorScheme="blue"
                leftIcon={<ExternalLinkIcon />}
              >
                Download / View PDF
              </Button>
            </Box>
          ) : (
            <Box p={10}>
              <Text>No content available.</Text>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BookViewer;
