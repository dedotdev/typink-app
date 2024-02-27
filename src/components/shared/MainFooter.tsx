import { Box, Flex, Link } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { Props } from '@/types';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';

const MainFooter: FC<Props> = () => {
  return (
    <Box borderTop={1} borderStyle='solid' borderColor='gray.200'>
      <Flex
        maxWidth='container.md'
        px={4}
        mx='auto'
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        direction={{ base: 'column', sm: 'row' }}
        gap={4}
        py={4}>
        <span>
          Copyright &copy; 2024{' '}
          <Link href='https://dedot.dev' isExternal>
            dedot.dev
          </Link>
        </span>
        <Flex gap={6}>
          <a href='https://twitter.com/realsinzii' target='_blank'>
            <FontAwesomeIcon icon={faTwitter} size='xl' className='text-gray-600 hover:text-gray-800' />
          </a>
          <a href='https://github.com/dedotdev/trydedot' target='_blank'>
            <FontAwesomeIcon icon={faGithub} size='xl' className='text-gray-600 hover:text-gray-800' />
          </a>
        </Flex>
      </Flex>
    </Box>
  );
};

export default MainFooter;
