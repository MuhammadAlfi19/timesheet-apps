import React, {useRef} from 'react'
import { 
  Flex,
  Modal,
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalFooter, 
  ModalBody, 
  ModalCloseButton, 
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  useToast
} from '@chakra-ui/react'
import {PlusCircle} from '@phosphor-icons/react';
import axios from 'axios';

const ModalProyek = ({callback}) => {

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure()

  const namaProyek = useRef(null);

  const handleSimpan = (e) => {
    e.preventDefault();
    
    // console.log();
    const data = {
      nama_proyek : namaProyek.current.value
    };

    if (data.nama_proyek === "") {
      toast({
        title: `Nama Proyek Belum Diisi!`,
        status: 'warning',
        isClosable: true,
        position: 'top',
    })
    }else {
      axios.post('http://localhost:4000/kegiatan/proyek/simpan', data).then(res => {
        onClose();
        callback(true);
        toast({
          title: 'Berhasil.',
          description: "Tambah Proyek Baru Berhasil",
          status: 'success',
          duration: 3000,
          position: 'top',
          isClosable: true,
      })
      }).catch(err => {
        toast({
          title: 'Gagal',
          description: err,
          status: 'error',
          duration: 3000,
          position: 'top',
          isClosable: true,
      })
      })
    }

    
  }
  return (
    <>
   <Button bg='custom.lightBlue' size='md'  _hover={{ bg: "custom.lightBlue", color: "custom.blue" }} onClick={onOpen}><Flex alignItems='center' gap='2' color='custom.blue' px='5'><PlusCircle size={25} />Tambah Proyek</Flex></Button>

    <Modal
      initialFocusRef={namaProyek}
      isOpen={isOpen}
      onClose={onClose}
      size={'lg'}
    >
      <ModalOverlay />
      <ModalContent >
        <ModalHeader>Tambah Proyek Baru</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Nama Proyek</FormLabel>
            <Input ref={namaProyek} />
          </FormControl>

        </ModalBody>

        <ModalFooter gap='5'>
            <Button color='custom.red' variant='link' onClick={onClose}>
                Kembali
            </Button>
            <Button bg='custom.red' mr={3} color='white' onClick={handleSimpan}>
                Simpan
            </Button>
          </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  )
}

export default ModalProyek