import React, {useState} from 'react'
import { 
    Flex,
    IconButton, 
    ModalOverlay,
    useToast,
    Modal, 
    ModalContent,
    ModalBody,
    Button,
    useDisclosure, 
    Text,
    } from '@chakra-ui/react'
import {TrashSimple} from '@phosphor-icons/react';
import axios from 'axios';


const ButtonHapus = ({idKegiatan,judulKegiatan, callback}) => {

    const toast = useToast();
    
    const OverlayOne = () => (
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px) hue-rotate(90deg)'
        />
      )
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [overlay, setOverlay] = useState(<OverlayOne />)

    const handleHapus = (e) => {
        e.preventDefault();

        axios.delete(`http://localhost:4000/kegiatan/delete/${idKegiatan}`).then(res => {
            onClose();
            callback(true);
            toast({
                title: 'Berhasil.',
                description: "Hapus Kegiatan Berhasil",
                status: 'success',
                duration: 3000,
                position: 'top',
                isClosable: true,
            })
        }).catch(err => {
            console.log(err);
        })
    }

  return (
    <>
      <IconButton aria-label='edit' icon={<TrashSimple size={20} weight="fill" color="#F15858" />} onClick={() => {
        setOverlay(<OverlayOne />)
        onOpen()
      }}/>

        <Modal isCentered isOpen={isOpen} onClose={onClose}>
                {overlay}
            <ModalContent p='5'>
            <ModalBody>
                <Text textAlign='center' fontWeight='bold'>Apakah anda yakin ingin menghapus ?</Text>
                <Text textAlign='center' fontWeight='bold'>Dengan Judul Kegiatan :</Text>
                <Text textAlign='center'>{judulKegiatan}</Text>
                <Flex justifyContent='center' gap='3' mt='5'>
                  <Button onClick={handleHapus} color='custom.red'>Hapus</Button>    
                  <Button onClick={onClose} color='custom.blue'>Kembali</Button>    
                </Flex>
            </ModalBody>
            </ModalContent>
        </Modal>
    </>
  )
}

export default ButtonHapus