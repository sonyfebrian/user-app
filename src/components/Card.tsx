import { Box, SimpleGrid, Icon, Text, Stack, Flex } from '@chakra-ui/react';

interface FeatureProps {
    title: string;
    text: string;
}

const Feature = ({ title, text }: FeatureProps) => {
    return (
        <Stack>
            <Flex
                w={16}
                h={16}
                align={'center'}
                justify={'center'}
                color={'white'}
                rounded={'full'}
                bg={'gray.100'}
                mb={1}>

            </Flex>
            <Text fontWeight={600}>{title}</Text>
            <Text color={'gray.600'}>{text}</Text>
        </Stack>
    );
};

export default Feature;