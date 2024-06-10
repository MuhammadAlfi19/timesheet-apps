import React, {useState, useEffect} from 'react'
import { 
    Flex,
    Modal,
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalFooter, 
    ModalBody, 
    ModalCloseButton, 
    Button,useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Select,
    useToast
 } from '@chakra-ui/react';
import {PlusCircle} from '@phosphor-icons/react';
import axios from 'axios';
import ModalProyek from './ModalProyek';
import { validationField } from '../utils/utils';

const ModalTambahKegiatan = ({callback}) => {

    const toast = useToast();

    const [proyek, setProyek] = useState([]);

    const { isOpen, onOpen, onClose } = useDisclosure();
    
    const [kegiatan, setkegiatan] = useState({
        tglMulai: '',
        tglBerakhir: '',
        jamMulai: '',
        jamBerakhir: '',
        judulKegiatan: '',
        idProyek: '',
    })

    const getProyek = () => {
        axios.get('http://localhost:4000/kegiatan/proyekAll').then((res) => {
            setProyek(res.data[0].payload);
        }).catch((err) => {
            console.log(err);
        }) 
    }

    const refresh = (status) => {
        if (status) {
            getProyek();
        }
    }

    useEffect(() => {

        if (isOpen === false) {
           getProyek();
        }
    },[]);


    const handleInput = (e) => {
        e.persist();

        setkegiatan({...kegiatan,[e.target.name] : e.target.value})
    }

    const simpanKegiatan = (e) => {
        e.preventDefault();
        

    
        const data  = {
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
            axios.post('http://localhost:4000/kegiatan/simpan',data).then((res) => {
                onClose();
                callback(false);
                setkegiatan({
                    tglMulai: '',
                    tglBerakhir: '',
                    jamMulai: '',
                    jamBerakhir: '',
                    judulKegiatan: '',
                    idProyek: '',
                })
                toast({
                    title: 'Berhasil.',
                    description: "Tambah Proyek Baru Berhasil",
                    status: 'success',
                    duration: 3000,
                    position: 'top',
                    isClosable: true,
                })
            }).catch((error) => {
                toast({
                    title: 'Gagal',
                    description: error,
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
      <Button bg='custom.lightBlue' size='sm'  _hover={{ bg: "custom.lightBlue", color: "custom.blue" }} onClick={onOpen}><Flex alignItems='center' gap='2' color='custom.blue'><PlusCircle size={25} />Tambah Kegiatan</Flex></Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW="80vw">
          <ModalHeader>Tambah Kegiatan Baru</ModalHeader>
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
                        <Select placeholder='Pilih Proyek' onChange={handleInput} name='idProyek'>
                           {
                             proyek.map(data => {
                                return (<option key={data.id_proyek} value={data.id_proyek}>{data.nama_proyek}</option>)
                             })
                           }
                            
                        </Select>
                    </FormControl>
                    <ModalProyek callback={refresh}/>
                </Flex>
            </form>

          </ModalBody>

          <ModalFooter gap='5'>
            <Button color='custom.red' variant='link' onClick={onClose}>
                Kembali
            </Button>
            <Button bg='custom.red' mr={3} color='white' onClick={simpanKegiatan}>
                Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ModalTambahKegiatan