import { Skeleton, Text, TextProps } from "@chakra-ui/react";

interface PendingTextProps extends TextProps {
  isLoading: boolean;
}

export default function PendingText(props: PendingTextProps) {
  const { isLoading, children, ...rest } = props;

  return (
    <Skeleton display='inline-block' height='4' minW={10} isLoaded={!isLoading}>
      <Text {...rest}>{children || null}</Text>
    </Skeleton>
  )
}
