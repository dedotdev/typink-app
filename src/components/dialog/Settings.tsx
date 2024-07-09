import { Button, Divider, FormControl, FormLabel, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack, Switch, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useBoolean, useEffectOnce, useLocalStorage } from "react-use";
import { Connection, JsonRpcApi } from '@/types';
import { SettingsIcon } from '@chakra-ui/icons';

export default function Settings() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [connectVia, setConnectVia] = useLocalStorage<Connection>('SETTINGS/CONNECT_VIA', Connection.RPC_ENDPOINT);
  const [jsonRpc, setJsonRpc] = useLocalStorage<JsonRpcApi>('SETTINGS/JSON_RPC_API', JsonRpcApi.NEW);
  const [cacheMetadata, setCacheMetadata] = useLocalStorage<boolean>('SETTINGS/CACHE_METADATA', true);

  const [localConnectVia, setLocalConnectVia] = useState<Connection>();
  const [localJsonRpc, setLocalJsonRpc] = useState<JsonRpcApi>();
  const [localCacheMetadata, setLocalCacheMetadata] = useBoolean(true);

  const [loading, setLoading] = useBoolean(false);

  useEffectOnce(() => {
    setLocalJsonRpc(jsonRpc || JsonRpcApi.NEW);
    setLocalConnectVia(connectVia || Connection.RPC_ENDPOINT);
    setLocalCacheMetadata(cacheMetadata);
  });

  const doSave = () => {
    setConnectVia(localConnectVia);
    setJsonRpc(localJsonRpc);
    setCacheMetadata(localCacheMetadata);

    setLoading(true);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <>
      <IconButton onClick={onOpen} aria-label='Settings' variant='outline' icon={<SettingsIcon />} />
      <Modal onClose={onClose} size='sm' isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody mb={4}>
            <FormControl as='fieldset'>
              <FormLabel as='legend'>Connect via:</FormLabel>
              <RadioGroup value={localConnectVia} onChange={(nextValue) => setLocalConnectVia(nextValue as Connection)}>
                <Stack>
                  <Radio value={Connection.RPC_ENDPOINT}>RPC Endpoint</Radio>
                  <Radio value={Connection.LIGHT_CLIENT}>Light client (Smoldot)</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            <Divider my={4} />
            <FormControl as='fieldset' mb={6}>
              <FormLabel as='legend'>JSON-RPC APIs:</FormLabel>
              <RadioGroup value={localJsonRpc} onChange={(nextValue) => setLocalJsonRpc(nextValue as JsonRpcApi)}>
                <Stack>
                  <Radio value={JsonRpcApi.LEGACY}>Legacy</Radio>
                  <Radio value={JsonRpcApi.NEW}>New</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            <Divider my={4} />
            <FormControl display='flex' alignItems='center'>
              <FormLabel htmlFor='cache-metadata' mb='0'>
                Cache metadata?
              </FormLabel>
              <Switch
                id='cache-metadata'
                isChecked={localCacheMetadata}
                onChange={(e) => setLocalCacheMetadata(e.target.checked)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button onClick={onClose} variant='outline'>
              Cancel
            </Button>
            <Button colorScheme='primary' onClick={doSave} isLoading={loading}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
