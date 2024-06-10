import React,{useState,useEffect} from 'react'
import { Card, CardBody, Text,Tabs, TabList, TabPanels, Tab, TabPanel,TabIndicator, Box } from '@chakra-ui/react'
import TableKegiatan from '../components/TableKegiatan'
import Pengaturan from './Pengaturan'
import axios from 'axios';

const DaftarTimeSheet = () => {

  const [inputRate, setInputRate] = useState('');
  const [namakaryawan, setNamaKaryawan] = useState('')

  const getKaryawan = () => {

    axios.get('http://localhost:4000/user/getuser').then(res => {
       setNamaKaryawan(res.data[0].payload[0].nama);
       setInputRate(res.data[0].payload[0].rate);
       
    }).catch(err => console.log(err))
 }

 const refresh = (status) => {
    if (status) {
        getKaryawan();
    }
 }


 useEffect(() => {
    getKaryawan();
 },[]);


  return (
    <div>
        <Card px="30px" borderRadius="0px">
            <CardBody>
                <Text fontSize='xl' fontWeight="bold">HH Timesheet</Text>
            </CardBody>
        </Card>

        <Tabs position='relative' variant='unstyled'>
             <Box bg='white' px="30px">
                <TabList>
                    <Tab>Daftar Kegiatan</Tab>
                    <Tab>Pengaturan</Tab>
                </TabList>
             </Box>
            <TabIndicator mt='-1.5px' height='2px' bg='#2775EC' borderRadius='1px' />
            <TabPanels>
                
                <TabPanel>
                   <TableKegiatan namaKaryawan={namakaryawan} rateKaryawan={inputRate} />
                </TabPanel>
                
                <TabPanel>
                   <Pengaturan callback={refresh} />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
  )
}

export default DaftarTimeSheet