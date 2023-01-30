import { ServiceLayout } from '@/components/service_layout';
import { UseAuth } from '@/contexts/auth_user.context';
import { InAuthUser } from '@/models/in_auth_user';
import {
  Box,
  Avatar,
  Flex,
  Text,
  Textarea,
  Button,
  useToast,
  FormControl,
  Switch,
  FormLabel,
  VStack,
} from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import ResizeTextArea from 'react-textarea-autosize';
import axios, { AxiosResponse } from 'axios';
import MessageItem from '@/components/message_item';
// const userInfo = {
//   uid: 'test',
//   email: 'totuworld@gmail.com',
//   displayName: 'lenson lee',
//   photoURL: 'https://lh3.googleusercontent.com/a/AEdFTp67L7vDPdVv4YcFxNmdeJZBkkWmdKiFa07Izgcf5A=s96-c',
// };

interface Props {
  userInfo: InAuthUser | null;
}

// 등록 클릭 시 등록 처리
async function postMessage({
  uid,
  message,
  author,
}: {
  uid: string;
  message: string;
  author?: {
    displayName: string;
    photoURL?: string;
  };
}) {
  if (message.length <= 0) {
    return {
      result: false,
      message: '메시지를 입력해주세요',
    };
  }
  try {
    await fetch('/api/messages.add', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        uid,
        message,
        author,
      }),
    });
    return {
      result: true,
    };
  } catch (err) {
    console.error(err);
    return {
      result: false,
      message: '메시지등록실패',
    };
  }
}

const UserHomePage: NextPage<Props> = function ({ userInfo }) {
  const [message, setMessage] = useState('');
  const [isAnonymous, setAnonymous] = useState(true);
  const toast = useToast();
  const { authUser } = UseAuth();
  if (userInfo === null) {
    return <p>사용자를 찾을 수 없습니다.</p>;
  }

  return (
    <ServiceLayout title={`${userInfo.displayName}의 홈`} minH="100vh" backgroundColor="gray.50">
      <Box maxW="md" mx="auto" pt="6">
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
          <Flex p="6">
            <Avatar size="lg" src={userInfo.photoURL ?? 'https://bit.ly/broken-link'} mr="2" />
            <Flex direction="column" justify="center">
              <Text fontSize="md">{userInfo.displayName}</Text>
              <Text fontSize="xs">{userInfo.email}</Text>
            </Flex>
          </Flex>
        </Box>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
          <Flex align="center" p="2">
            <Avatar
              size="xs"
              src={isAnonymous ? 'https://bit.ly/broken-link' : authUser?.photoURL ?? 'https://bit.ly/broken-link'}
              mr="2"
            />
            <Textarea
              bg="gray.100"
              border="none"
              placeholder="무엇이 궁금한가요?"
              resize="none"
              minH="unset"
              overflow="hidden"
              fontSize="xs"
              mr="2"
              maxRows={7}
              value={message}
              onChange={(e) => {
                if (e.currentTarget.value) {
                  const lineCount = e.currentTarget.value.match(/[^\n]*\n[^\n]*/gi)?.length ?? 1;
                  if (lineCount + 1 > 7) {
                    toast({ title: '최대 7줄만 가능합니다.', position: 'top-right' });
                    return;
                  }
                }
                setMessage(e.currentTarget.value);
              }}
              as={ResizeTextArea}
            />
            <Button
              disabled={message.length === 0}
              bgColor="#FFB86C"
              color="white"
              colorScheme="yellow"
              variant="solid"
              size="sm"
              onClick={async () => {
                const postData: {
                  message: string;
                  uid: string;
                  author?: {
                    displayName: string;
                    photoURL?: string;
                  };
                } = {
                  message,
                  uid: userInfo.uid,
                };
                if (isAnonymous === false) {
                  postData.author = {
                    photoURL: authUser?.photoURL ?? 'https://bit.ly/broken-link',
                    displayName: authUser?.displayName ?? 'anonymous',
                  };
                }
                const messageResp = await postMessage(postData);
                if (messageResp.result === false) {
                  toast({ title: '메시지 등록 실패', position: 'top-right' });
                }
                setMessage('');
              }}
            >
              등록
            </Button>
          </Flex>
          <FormControl display="flex" alignItems="center" mt="1" mx="2" pb="2">
            <Switch
              size="sm"
              colorScheme="orange"
              id="anonymous"
              mr="1"
              isChecked={isAnonymous}
              onChange={() => {
                if (authUser === null) {
                  toast({ title: '로그인이 필요합니다.', position: 'top-right' });
                  return;
                }
                setAnonymous((prey) => !prey);
              }}
            />
            <FormLabel htmlFor="anonymous" mb="0" fontSize="xx-small">
              asdf
            </FormLabel>
          </FormControl>
        </Box>
        <VStack spacing="12px" mt="6">
          <MessageItem
            uid=""
            displayName="test"
            photoURL={authUser?.photoURL ?? ''}
            isOwner={false}
            item={{
              id: 'test',
              message: 'test_asdf',
              createAt: '2022-01-30T20:15:55+09:00',
              reply: 'reply',
              replyAt: '2022-04-15T20:15:55+09:00',
            }}
          />
          <MessageItem
            uid=""
            displayName="test"
            photoURL={authUser?.photoURL ?? ''}
            isOwner={true}
            item={{
              id: 'test',
              message: 'test_asdf',
              createAt: '2022-02-30T20:15:55+09:00',
            }}
          />
        </VStack>
      </Box>
    </ServiceLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const { screenName } = query;
  if (screenName === undefined) {
    return {
      props: {
        userInfo: null,
      },
    };
  }
  // 서버사이드에서 작동해서 fetch 사용불가. node.js에서 사용하는 라이브러리나 axios를 fetch해야함
  // 서버사이드이기때문에 '/'만으로는 위치를 몰라 baseURL 생성

  try {
    const protocol = process.env.PROTOCOL || 'http';
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || '3000';
    const baseUrl = `${protocol}://${host}:${port}`;
    //any같은게 들어와서 뭘 받을지 특정한다.
    const userInfoResp: AxiosResponse<InAuthUser> = await axios(`${baseUrl}/api/user.info/${screenName}`);

    // console.info(userInfoResp.data);
    return {
      props: {
        userInfo: userInfoResp.data ?? null,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        userInfo: null,
      },
    };
  }
};
export default UserHomePage;
