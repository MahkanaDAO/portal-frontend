import * as React from "react";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Code,
    Divider,
    Flex,
    GridItem,
    Heading,
    HStack,
    Image,
    Link,
    ListItem,
    Spacer,
    Text,
    UnorderedList,
    VStack,
} from "@chakra-ui/react";
import { FaCopy, FaDownload } from "react-icons/fa";

import RegistrationDiagram from "./assets/1_register.png";
import CreationDiagram from "./assets/2_create.png";
import ProofDiagram from "./assets/3_prove.png";
import EndDiagram from "./assets/4_end.png";

const Docs = () => {
    const installationCmds = [
        "git clone https://github.com/Yiwen-Gao/micro-storage-platform-monorepo",
        "cd mahkana-micro-node && git checkout latest",
        "make all",
    ];
    const poRepCmd = "mahkana submit porep --path=/path/to/data --contract=address";
    const poStCmd = "mahkana submit posts --path=/path/to/data --contract=address";
    const poStNoVerifyCmd = "mahkana submit posts --path=/path/to/data --contract=address --no-verify";
    const verifyCmd = "mahkana verify --contract=address"
    return (
        <GridItem colStart={2} colEnd={12}>
            <Box marginY={5}>
                <Heading size="md">Mahkana Docs</Heading>
            </Box>
            <Divider />
            <Accordion defaultIndex={[0]} allowMultiple>
                <AccordionItem>
                    <AccordionButton>
                        <Text as="span" flex="1" textAlign="left">Install Micro-node Application</Text>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                        <VStack align="start" gap={5}>
                            <VStack align="start">
                                <Text as="b">Install Directly</Text>
                                <Text>
                                    Click the button to download a pre-built version of Mahkana.
                                </Text>
                                <Button leftIcon={<FaDownload />}>Download v0.1.5</Button>
                            </VStack>
                            <Text as="b">OR</Text>
                            <VStack align="start">
                                <Text as="b">Build from Source</Text>
                                <Text>Clone the repository, check out the latest release, and run the make target to build.</Text>
                                <Code borderRadius="md" padding={2.5}>
                                    <HStack gap={1} align="start">
                                        <VStack align="start">
                                            {installationCmds.map((cmd, idx) => (<Text key={idx}>{`$ ${cmd}`}</Text>))}
                                        </VStack>
                                        <Button
                                            variant="outline"
                                            padding={0}
                                            onClick={() => navigator.clipboard.writeText(installationCmds.join("\n"))}
                                        >
                                            <Text fontSize="sm"><FaCopy /></Text>
                                        </Button>
                                    </HStack>
                                </Code>
                            </VStack>
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                    <AccordionButton>
                        <Text as="span" flex="1" textAlign="left">Run Micro-node Application</Text>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                        <VStack align="start" gap={5}>
                            <VStack align="start">
                                <Text as="b">Submit Proof of Replication (PoRep)</Text>
                                <Text>
                                    Once you've registered as a provider and been selected for a storage deal, you'll receive a notification via Push Protocol.
                                </Text>
                                <Text>Navigate to your provider profile, find the deal, and download the sector data.</Text>
                                <Text>
                                    You'll need to submit a proof of replication (poRep) over the data to the network within 5 days of the notification.
                                </Text>
                                <Code borderRadius="md" padding={2.5}>
                                    <HStack gap={5}>
                                        <Text>{`$ ${poRepCmd}`}</Text>
                                        <Button
                                            variant="outline"
                                            padding={0}
                                            onClick={() => navigator.clipboard.writeText(poRepCmd)}
                                        >
                                            <FaCopy />
                                        </Button>
                                    </HStack>
                                </Code>
                            </VStack>
                            <VStack align="start">
                                <Text as="b">Submit Proof of Spacetime (PoSt)</Text>
                                <Text>
                                    After all the selected providers have submitted poReps and the deal is active,
                                    you'll need to submit to submit proofs of spacetime (poSt) every hour for the duration of the deal.
                                </Text>
                                <Code borderRadius="md" padding={2.5}>
                                    <HStack gap={1}>
                                        <Text>{`$ ${poStCmd}`}</Text>
                                        <Button
                                            variant="outline"
                                            padding={0}
                                            onClick={() => navigator.clipboard.writeText(poStCmd)}
                                        >
                                            <FaCopy />
                                        </Button>
                                    </HStack>
                                </Code>
                            </VStack>
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                    <AccordionButton>
                        <Text as="span" flex="1" textAlign="left">How it Works</Text>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                        <Image src={RegistrationDiagram}></Image>
                        <Image src={CreationDiagram}></Image>
                        <Image src={ProofDiagram}></Image>
                        <Image src={EndDiagram}></Image>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </GridItem>
    );
};

export { Docs };