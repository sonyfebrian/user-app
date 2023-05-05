import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import {
  useToast,
  Container,
  Textarea,
  SimpleGrid,
  Icon,
  Text,
  Stack,
  HStack,
  VStack,
  Button,
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
type Post = {
  id: number;
  title: string;
  body: string;
};

export default function Posts() {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const toast = useToast();

  const { isLoading, data: posts, error, refetch } = useQuery<Post[]>(
    "posts",
    async () => {
      const { data } = await axios.get<Post[]>(
        "https://jsonplaceholder.typicode.com/posts"
      );
      return data;
    }
  );
  const { mutateAsync: createPost } = useMutation(
    async (postData: Post) => {
      const { data } = await axios.post<Post>(
        "https://jsonplaceholder.typicode.com/posts",
        postData
      );
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("posts");
        reset();
        setSelectedPost(null);
        refetch();
        toast({
          title: "Create Success",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

      },
    }
  );

  const { mutateAsync: updatePost } = useMutation(
    async (postData: Post) => {
      const { data } = await axios.put<Post>(
        `https://jsonplaceholder.typicode.com/posts/${postData.id}`,
        postData
      );
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("posts");
        reset();
        setSelectedPost(null);
        refetch();
        toast({
          title: "Update Succes",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    reset({ title: post.title, body: post.body });
  };

  const handleDelete = async (postId: number) => {
    await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    queryClient.invalidateQueries("posts");
    refetch();
    toast({
      title: "Delete Success",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const onSubmit = async (formData: Record<string, any>) => {
    const { title, body } = formData;
    const postData: Post = { id: selectedPost?.id || 0, title, body }; // define id property here

    if (selectedPost) {
      await updatePost(postData);
    } else {
      await createPost(postData);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <>
      <Flex width="full" align="center" justifyContent="center">
        <Box p={2}>
          <Box textAlign="center">
            <Heading>Login</Heading>
          </Box>
          <Box my={4} textAlign="left">
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input type="text" placeholder="title" {...register("title")} />
              </FormControl>
              <FormControl mt={6}>
                <FormLabel>Deskription</FormLabel>
                <Textarea placeholder='Deskription' {...register("body")} />
              </FormControl>
              <Button width="full" mt={4} type="submit">
                {selectedPost ? "Update" : "Create"}
              </Button>
            </form>
          </Box>
        </Box>
      </Flex>
      <Box p={4}>
        <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
          <Heading fontSize={'3xl'}>List Post</Heading>
        </Stack>

        <Container maxW={'6xl'} mt={10}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            {posts?.map((post) => (
              <>
                <HStack key={post.id} align={'top'}>
                  <Box color={'green.400'} px={2}>
                    <Icon as={CheckIcon} />
                  </Box>
                  <VStack align={'start'}>
                    <Text fontWeight={600}>{post.title}</Text>
                    <Text color={'gray.600'}>{post.body}</Text>
                    <Stack spacing={4} direction='row' align='center'>
                      <Button colorScheme='teal' size='sm' onClick={() => handleEdit(post)}>
                        Edit
                      </Button>
                      <Button colorScheme='teal' size='sm' onClick={() => handleDelete(post.id)}>
                        Delete
                      </Button>

                    </Stack>
                  </VStack>

                </HStack>

              </>

            ))}
          </SimpleGrid>
        </Container>
      </Box>

    </>
  );
}
