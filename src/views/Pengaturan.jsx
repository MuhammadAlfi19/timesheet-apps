import React, {useState,useEffect} from 'react'
import { Container,Flex,Card, CardBody, FormControl,FormLabel,Input,InputGroup, InputLeftAddon,Button,useToast} from '@chakra-ui/react'
import {clearTitik, formatRupiah, validationPengaturan} from '../utils/utils'
import axios from 'axios';

const Pengaturan = ({callback}) => {

  const toast = useToast();

  const [idKaryawan,setIdKaryawan] = useState('');
  const [inputRate, setInputRate] = useState('');
  const [namakaryawan, setNamaKaryawan] = useState('')

  const getKaryawan = () => {

     axios.get('http://localhost:4000/user/getuser').then(res => {
        setIdKaryawan(res.data[0].payload[0].id_user);
        setNamaKaryawan(res.data[0].payload[0].nama);
        setInputRate(res.data[0].payload[0].rate.toLocaleString('id-ID'));
        
     }).catch(err => console.log(err))
  }

  useEffect(() => {
      getKaryawan();
  }, [])

  const handleInput = (e) => {
    e.persist();

    setNamaKaryawan(e.target.value)
    }

const handleRate = (e) => {
    e.persist();

    const rateKaryawan = e.target.value.replace(/[^,\d]/g, '');
    setInputRate(formatRupiah(rateKaryawan));
}

const handleUpdate = (e) => {

    e.preventDefault();

    const data = {
        id_user: idKaryawan,
        nama: namakaryawan,
        rate: clearTitik(inputRate),
    } 

    if (data.nama === "" || data.rate === "") {
        validationPengaturan(data,toast);
    }else {
        axios.put('http://localhost:4000/user/update', data).then(res => {
            callback(true);
            toast({
                title: 'Berhasil.',
                description: "Update Pengaturan Berhasil",
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
        <Flex justifyContent="center" alignItems="center" height="60vh">
            <Container maxW='md' >
                <Card>
                    <CardBody>
                        <FormControl>
                                <FormLabel>Nama Karyawan</FormLabel>
                                <Input required type='text' name='nama' value={namakaryawan} onChange={handleInput} />
                        </FormControl>
                        <FormControl mt='10' mb='10'>
                                <FormLabel>Rate</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon>Rp</InputLeftAddon>
                                    <Input type='number' value={inputRate} onChange={handleRate} textAlign='right' />
                                </InputGroup>
                        </FormControl>
                        <Flex justifyContent='center' gap='2'>
                        <Button bg='#EDF2F7' width='100%' colorScheme='#F7FAFC' color='custom.blue'>Batalkan</Button>
                        <Button bg='custom.blue' width='100%' colorScheme='blue' color='white' onClick={handleUpdate}>Simpan</Button>
                        </Flex>
                    </CardBody>
                </Card>
            </Container>
        </Flex>
    </div>
  )
}

export default Pengaturan