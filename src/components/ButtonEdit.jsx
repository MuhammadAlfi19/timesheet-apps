import React, {useState, useEffect} from 'react'
import { 
  IconButton,
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
  Select,
  useToast
} from '@chakra-ui/react'
import {Eraser} from '@phosphor-icons/react';
import axios from 'axios';
import ModalProyek from './ModalProyek';
import { validationField } from '../utils/utils';

const ButtonEdit = ({idKegiatan,callback}) => {
  
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [proyek, setProyek] = useState([]);

  const [kegiatan, setkegiatan] = useState({
      id_user: '',
      id_kegiatan: '',
      tglMulai: '',
      tglBerakhir: '',
      jamMulai: '',
      jamBerakhir: '',
      judulKegiatan: '',
      idProyek: '',
      namaProyek: '',
  });

  const getProyek = () => {
    axios.get('http://localhost:4000/kegiatan/proyekAll').then(res => {
      const response = res.data[0].payload;
    
      setProyek(response);

    }).catch(err => {
      console.log(err);
    }) 
  }

  const getData = () => {
    axios.get(`http://localhost:4000/kegiatan/getAllByIdKegiatan/${idKegiatan}`).then(res => {
      setkegiatan({
        id_user: res.data[0].payload[0].id_user,
        id_kegiatan: res.data[0].payload[0].id_kegiatan,
        tglMulai: res.data[0].payload[0].tgl_mulai,
        tglBerakhir: res.data[0].payload[0].tgl_berakhir,
        jamMulai: res.data[0].payload[0].waktu_mulai,
        jamBerakhir: res.data[0].payload[0].waktu_berakhir,
        judulKegiatan: res.data[0].payload[0].judul_kegiatan,
        idProyek: res.data[0].payload[0].id_proyek,
        namaProyek: res.data[0].payload[0].nama_proyek,
      })
      
      getProyek();

    }).catch(err => {
      console.log(err);
    });

  }

  const refresh = (status) => {
     if (status) {
        getProyek();
     }
  }

  useEffect(() => {
     
      if (isOpen === true) {
          getData();
      }
  },[isOpen])

  const handleInput = (e) => {
    e.persist();

    setkegiatan({...kegiatan,[e.target.name] : e.target.value})
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const data  = {
      id_user: kegiatan.id_user,
      id_kegiatan: kegiatan.id_kegiatan,
      tglMulai: kegiatan.tglMulai,
      tglBerakhir: kegiatan.tglBerakhir,
      jamMulai: kegiatan.jamMulai,
      jamBerakhir: kegiatan.jamBerakhir,
      judulKegiatan: kegiatan.judulKegiatan,
      idProyek: kegiatan.idProyek,
    }

    if (kegiatan.tglMulai === '' || kegiatan.tglBerakhir === '' || kegiatan.jamMulai === '' || kegiatan.jamBerakhir === '' || kegiatan.judulKegiatan === '' || kegiatan.idProyek === '' ) {
      validationField(data,toast);
      
    }else {
      axios.put('http://localhost:4000/kegiatan/update', data).then(res => {
        onClose();
        callback(true);
        toast({
            title: 'Berhasil.',
            description: "Update Proyek Berhasil",
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
    <div>
       <IconButton aria-label='edit' icon={<Eraser size={20} weight="fill" color="#F15858" />} onClick={onOpen} />

       <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW="80vw">
          <ModalHeader>Edit Kegiatan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form action="">
                <Flex justifyContent='space-between' gap='5'>
                     <FormControl>
                        <FormLabel>Tanggal Mulai</FormLabel>
                        <Input placeholder='Select Date' size='md' type='date' value={kegiatan.tglMulai} name='tglMulai' onChange={handleInput} />
                    </FormControl>
                     <FormControl>
                        <FormLabel>Tanggal Berakhir</FormLabel>
                        <Input placeholder='Select Date' size='md' type='date' value={kegiatan.tglBerakhir} name='tglBerakhir' onChange={handleInput} />
                    </FormControl>
                     <FormControl>
                        <FormLabel>Jam Mulai</FormLabel>
                        <Input placeholder='Select Date' size='md' type='time' value={kegiatan.jamMulai} name='jamMulai' onChange={handleInput} />
                    </FormControl>
                     <FormControl>
                        <FormLabel>Jam Berakhir</FormLabel>
                        <Input placeholder='Select Date' size='md' type='time' value={kegiatan.jamBerakhir} name='jamBerakhir' onChange={handleInput} />
                    </FormControl>
                </Flex>

                <FormControl mt='5'>
                <FormLabel>Judul Kegiatan</FormLabel>
                    <Input type='text' value={kegiatan.judulKegiatan} name='judulKegiatan' onChange={handleInput} />
                </FormControl>

                <Flex alignItems='end' gap='5' mb='5'>
                    <FormControl mt='5'>
                    <FormLabel>Nama Proyek</FormLabel>
                        <Select  onChange={handleInput} name='idProyek'>
                          <option value={kegiatan.idProyek}>{kegiatan.namaProyek}</option>
                          {
                            proyek.filter(value => value.id_proyek !== kegiatan.idProyek).map(data => {
                          
                              return (
                                    <option key={data.id_proyek} value={data.id_proyek}>{data.nama_proyek}</option>
                                  )
                                                          
                            })
                          }
                        </Select>
                    </FormControl>
                    <ModalProyek callback={refresh} />
                </Flex>
            </form>

          </ModalBody>

          <ModalFooter gap='5'>
            <Button color='custom.red' variant='link' onClick={onClose}>
                Kembali
            </Button>
            <Button bg='custom.red' mr={3} color='white' onClick={handleUpdate} >
                Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ButtonEdit