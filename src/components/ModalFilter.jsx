import React, {useEffect, useState} from 'react'
import { 
    Modal,
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalFooter, 
    ModalBody, 
    ModalCloseButton, 
    Button,
    useDisclosure,
    Avatar,
    AvatarBadge
} from '@chakra-ui/react'
import axios from 'axios';
import {FunnelSimple} from '@phosphor-icons/react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
  

const ModalFilter = ({status, fillters}) => {

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [proyek, setProyek] = useState([]);

  const [fillterProyek, setFillterProyek] = useState([]);

  const animatedComponents = makeAnimated();

  const getProyek = () => {
    axios.get('http://localhost:4000/kegiatan/proyekAll').then((res) => {
        const response = res.data[0].payload;
        const list = [];

        response.forEach(result => {

            const object = {
                value: result.id_proyek,
                label: result.nama_proyek
            }

            list.push(object);
        })
        
        setProyek(list);
    }).catch((err) => {
        console.log(err);
    }) 
}

  useEffect(() => {
      if (isOpen === true) {
        getProyek();
      }
  },[isOpen])

  const handleChange = (selected) => {
    setFillterProyek(selected);
  } 

  const handleFilter = (e) => {
    onClose();
    
    if (e.target.name === 'terapkan') {
        status(true);
        fillters(fillterProyek);
    } else {
        status(false);
        setFillterProyek([]);
    }
  }

  return (
    <>

        <Button  variant='outline' _hover={{ bg: "#FFFFFF"}} onClick={onOpen}>
                <Avatar icon={ <FunnelSimple size={30} color="#F15858" />} bg="transparent">
                     {
                        fillterProyek.length > 0 ? <AvatarBadge boxSize='1.25em' bg='custom.blue' position="absolute" top="15%" left="100%" transform="translate(-50%, -50%)" /> : <div></div>
                     }
                    
                </Avatar>
        </Button>
   
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={'lg'}
            isCentered
        >
        <ModalOverlay />
            <ModalContent >
                <ModalHeader>Filter</ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={6}>
                
                <Select
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    onChange={handleChange}
                    isMulti
                    options={proyek}
                    defaultValue={fillterProyek}
                    />

                </ModalBody>

            <ModalFooter gap='5'>
                <Button color='custom.red' name='hapus' variant='link' onClick={handleFilter}>
                    Hapus Filter
                </Button>
                <Button bg='custom.red' name='terapkan' mr={3} color='white' onClick={handleFilter}>
                    Terapkan
                </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
    </>
  )
}

export default ModalFilter