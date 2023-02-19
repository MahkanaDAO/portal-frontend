import {Box, Divider, GridItem, Heading, Link, Text, VStack} from "@chakra-ui/react";
import * as React from "react";

const Docs = () => {
    return (
        <GridItem colStart={2} colEnd={12}>
            <Box marginY={5}>
                <Heading size="md">Installation and Setup</Heading>
            </Box>
            <Divider />
            <VStack align="left" marginY={5}>
                <Box>
                    <Text fontSize="sm">
                        The reliability rating affects how providers are selected for new storage deals.
                        It's calculated by dividing the number of sectors that a provider has successfully proven
                        by the the number of sectors that it has promised to prove.
                        If no work history is available, a default rating is given.
                    </Text>
                </Box>
                <Box>
                </Box>
            </VStack>
        </GridItem>
    );
};

export { Docs };