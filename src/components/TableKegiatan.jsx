import React, {useEffect,useState} from 'react'
import { Card,  CardBody, Text, Flex, Box, Divider, Input, InputGroup, InputLeftElement,Button } from '@chakra-ui/react'
import {MagnifyingGlass,ArrowSquareOut} from '@phosphor-icons/react';
import DataTable from 'react-data-table-component';
import ModalTambahKegiatan from './ModalTambahKegiatan';
import axios from 'axios';
import moment from 'moment';
import ButtonEdit from './ButtonEdit';
import ButtonHapus from './ButtonHapus';
import { calculateTotalIncome, getSelisihHari, sumDurations } from '../utils/utils';
import ModalFilter from './ModalFilter';
import * as XLSX from 'xlsx';

const TableKegiatan = ({namaKaryawan = '',rateKaryawan = 0}) => {

  var dataArray;
  
  const [dataKegiatan,setDataKegiatan] = useState([]);
  const [dataKegiatanOld,setDataKegiatanOld] = useState([]);
  const [durasi,setDurasi] = useState('');
  const [rate,setRate] = useState(0);
  const [jumlahHari,setJumlahHari] = useState(0);
  const [search,setSearch] = useState('');

  const getTotalHari = (response) => {
      
       var jumlahHari = 0;

      response.forEach((value) => {
        const selesihHari = getSelisihHari(value.tgl_mulai,value.tgl_berakhir);
        jumlahHari += selesihHari;
      });

      if (jumlahHari === 0) {
        jumlahHari = 1;
      }

      setJumlahHari(jumlahHari);

  }
  

  const getTotalPendapatan = (response) => {

   
      
      const listDurasi = [];
     

      response.forEach((value) => {
        const formatDurasi = moment(value.durasi,'HH:mm').format('HH:mm')
        listDurasi.push(formatDurasi);
      })


    const total =  sumDurations(listDurasi);
    const formattedTotalDuration = `${Math.floor(total.asHours()).toString().padStart(2, '0')}:${total.minutes().toString().padStart(2, '0')}`;
  
    const splitDurasi = formattedTotalDuration.split(':');
    const jam   =  Number(splitDurasi[0]) === 0 ? "" : Number(splitDurasi[0]) + " Jam ";
    const menit =  Number(splitDurasi[1]) === 0 ? "" : Number(splitDurasi[1]) + " Menit ";

    setDurasi(jam + menit);
    
    const totalPendapatan =  calculateTotalIncome(formattedTotalDuration, rateKaryawan);
    setRate(totalPendapatan);

  }
  

  const getData =  (response) => {
      const data = [];
     
  
    
      response.forEach((value) => {
          const splitDurasi = value.durasi.split(':');
          const jam   =  Number(splitDurasi[0]) === 0 ? "" : Number(splitDurasi[0]) + " Jam ";
          const menit =  Number(splitDurasi[1]) === 0 ? "" : Number(splitDurasi[1]) + " Menit ";
          const durasiString = jam + menit;
         
         
          const object = {
            id_kegiatan: value.id_kegiatan,
            judul_kegiatan : value.judul_kegiatan,
            nama_proyek: value.nama_proyek,
            id_proyek: value.id_proyek,
            tgl_mulai : moment(value.tgl_mulai).format('DD MMMM YYYY'),
            tgl_berakhir: moment(value.tgl_berakhir).format('DD MMMM YYYY'),
            waktu_mulai: moment(value.waktu_mulai, 'HH:mm').format('HH:mm'),
            waktu_berakhir: moment(value.waktu_berakhir, 'HH:mm').format('HH:mm'),
            durasi: durasiString,
            durasiTime: value.durasi,
            aksi: <Flex gap='3'> <ButtonEdit idKegiatan={value.id_kegiatan} callback={refresh} /> <ButtonHapus idKegiatan={value.id_kegiatan} judulKegiatan={value.judul_kegiatan} callback={refresh} /> </Flex>
          };

         data.push(object);
         
      
      });

      setDataKegiatan(data);
      dataArray = data;
      setDataKegiatanOld(data);

  }

  
  
  useEffect(() => {

      axios.get('http://localhost:4000/kegiatan/getAllById').then((res) => {
          getData(res.data[0].payload);
          getTotalHari(res.data[0].payload);
          getTotalPendapatan(res.data[0].payload);
          setDataKegiatanOld(res.data[0].payload);
      }).catch(err => console.log(err));

  },[rateKaryawan]);
      

  const columns = [
    {
        name: 'Judul Kegiatan',
        selector: row => row.judul_kegiatan,
        sortable: true,
      },
      {
        name: 'Nama Proyek',
        selector: row => row.nama_proyek,
        sortable: true,
        
      },
      {
        name: 'Tanggal Mulai',
        selector: row => row.tgl_mulai,
        sortable: true,
      },
      {
        name: 'Tanggal Berakhir',
        selector: row => row.tgl_berakhir,
        sortable: true,
      },
      {
        name: 'Waktu Mulai',
        selector: row => row.waktu_mulai,
        sortable: true,
      },
      {
        name: 'Waktu Berakhir',
        selector: row => row.waktu_berakhir,
        sortable: true,
      },
      {
        name: 'Durasi',
        selector: row => row.durasi,
        sortable: true,
      },
      {
        name: 'Aksi',
        selector: row => row.aksi,
        sortable: true,
      },

  ];

  const customStyles = {
      
      headCells: {
        style: {
          fontWeight: 'bold',
          borderRight: '1px solid #EDF2F7',
        },
      },
      cells: {
        style: {
          borderRight: '1px solid #EDF2F7',
        },
      },
  };

  
  const dataFillter = (fillters) => {

        const data = [];
        // console.log(dataKegiatanOld);

        const set = new Set(fillters.map(item => item.label));
        const result = dataKegiatanOld.filter(item => set.has(item.nama_proyek));
          
        result.forEach(value => {
           
          const object = {
            id_kegiatan: value.id_kegiatan,
            judul_kegiatan : value.judul_kegiatan,
            nama_proyek: value.nama_proyek,
            id_proyek: value.id_proyek,
            tgl_mulai : moment(value.tgl_mulai).format('DD MMMM YYYY'),
            tgl_berakhir: moment(value.tgl_berakhir).format('DD MMMM YYYY'),
            waktu_mulai: moment(value.waktu_mulai, 'HH:mm').format('HH:mm'),
            waktu_berakhir: moment(value.waktu_berakhir, 'HH:mm').format('HH:mm'),
            durasi: value.durasiTime,
            durasiTime: value.durasiTime,
            aksi: <Flex gap='3'> <ButtonEdit idKegiatan={value.id_kegiatan} callback={refresh} /> <ButtonHapus idKegiatan={value.id_kegiatan} judulKegiatan={value.judul_kegiatan} callback={refresh} /> </Flex>
          }

          data.push(object);
        });
        
        getData(data);
        getTotalHari(data)
        getTotalPendapatan(result);

                
  }

  const handleStatus  = (status) => {
    if (status === false) {
      axios.get('http://localhost:4000/kegiatan/getAllById').then((res) => {
        getData(res.data[0].payload);
        getTotalHari(res.data[0].payload);
        getTotalPendapatan(res.data[0].payload);
        }).catch(err => console.log(err));
        
    }

    
  }


 
  const refresh = (status) => {
    
    
    if (status) {
      
        const array = [];
        axios.get('http://localhost:4000/kegiatan/getAllById').then((res) => {
           
          const set = new Set(dataArray.map(item => item.id_kegiatan));
          const result = res.data[0].payload.filter(item => set.has(item.id_kegiatan));

        
          result.forEach(value => {
            
            const object = {
              id_kegiatan: value.id_kegiatan,
              judul_kegiatan : value.judul_kegiatan,
              nama_proyek: value.nama_proyek,
              id_proyek: value.id_proyek,
              tgl_mulai : moment(value.tgl_mulai).format('DD MMMM YYYY'),
              tgl_berakhir: moment(value.tgl_berakhir).format('DD MMMM YYYY'),
              waktu_mulai: moment(value.waktu_mulai, 'HH:mm').format('HH:mm'),
              waktu_berakhir: moment(value.waktu_berakhir, 'HH:mm').format('HH:mm'),
              durasi: value.durasi,
              durasiTime: value.durasi,
              aksi: <Flex gap='3'> <ButtonEdit idKegiatan={value.id_kegiatan} callback={refresh} /> <ButtonHapus idKegiatan={value.id_kegiatan} judulKegiatan={value.judul_kegiatan} callback={refresh} /> </Flex>
            }
  
            array.push(object);
          })

         

           getData(array);
           getTotalHari(array);
           getTotalPendapatan(array);

          }).catch(err => console.log(err));
      }else {
        axios.get('http://localhost:4000/kegiatan/getAllById').then((res) => {
          getData(res.data[0].payload);
          getTotalHari(res.data[0].payload);
          getTotalPendapatan(res.data[0].payload);
          }).catch(err => console.log(err));
      }
    }
        
  const handleSearch = (e) => {
    e.persist();
    setSearch(e.target.value);
    
    
    if(e.target.value === '') {
      refresh(false);
    }

    const listArray = [];
    
    dataKegiatan.filter((item) => {
      return search.toUpperCase() === '' ? item : item.judul_kegiatan.toUpperCase().includes(e.target.value.toUpperCase())
    }).forEach(value => {

      const object = {
        id_kegiatan: value.id_kegiatan,
        judul_kegiatan : value.judul_kegiatan,
        nama_proyek: value.nama_proyek,
        id_proyek: value.id_proyek,
        tgl_mulai : moment(value.tgl_mulai).format('DD MMMM YYYY'),
        tgl_berakhir: moment(value.tgl_berakhir).format('DD MMMM YYYY'),
        waktu_mulai: moment(value.waktu_mulai, 'HH:mm').format('HH:mm'),
        waktu_berakhir: moment(value.waktu_berakhir, 'HH:mm').format('HH:mm'),
        durasi: value.durasiTime,
        durasiTime: value.durasiTime,
        aksi: <Flex gap='3'> <ButtonEdit idKegiatan={value.id_kegiatan} callback={refresh} /> <ButtonHapus idKegiatan={value.id_kegiatan} judulKegiatan={value.judul_kegiatan} callback={refresh} /> </Flex>
      }

      listArray.push(object);
    })

    getData(listArray);
    getTotalHari(listArray);
    getTotalPendapatan(listArray);

  }

  const handleExport = (e) => {
      e.preventDefault();

      const listdata = [];

      dataKegiatan.forEach((value,index) => {

        const object = {
            No            : index + 1,
            JudulKegiatan : value.judul_kegiatan,
            NamaProyek    : value.nama_proyek,
            TglMulai      : value.tgl_mulai,
            TglBerakhir   : value.tgl_berakhir,
            WaktuMulai    : value.waktu_mulai,
            WaktuBerakhir : value.waktu_berakhir,
            Durasi        : value.durasi,
        }

        listdata.push(object);

      });

      var wb  = XLSX.utils.book_new();
      var ws   = XLSX.utils.json_to_sheet(listdata);
      
      XLSX.utils.book_append_sheet(wb,ws,'MySheet1');

      XLSX.writeFile(wb,"DocsTimeSheet.xlsx");

  }


  return (
    <div>
        <Card>
            <CardBody>
                  <Flex gap='20' mb="25px">
                      <Box>
                        <Text fontSize='md' fontWeight='bold'>Nama</Text>
                        <Text>{namaKaryawan}</Text>
                      </Box>
                      <Box>
                        <Text fontSize='md' fontWeight='bold'>Rate</Text>
                        <Text>Rp.{rateKaryawan.toLocaleString('id-ID')}/Jam</Text>
                      </Box>
                      <Box>
                        <Button leftIcon={<ArrowSquareOut size={25} weight="fill" />} bg='custom.lightBlue' size='sm'  _hover={{ bg: "custom.lightBlue", color: "custom.blue" }} color='custom.blue' variant='solid' onClick={handleExport}>
                          Export Excel
                        </Button>
                      </Box>
                  </Flex>

                  <Divider mb="15px"/>

                  <Flex alignItems='center' justifyContent="space-between" mb="10px">
                       <Box>
                        <Flex alignItems='center' gap='10'>
                          <Text fontSize='sm' fontWeight='bold'>Daftar Kegiatan</Text>
                          <ModalTambahKegiatan callback={refresh} />
                        </Flex>
                       </Box>
                       <Box>
                        <Flex gap='5'>
                            <InputGroup>
                                  <InputLeftElement pointerEvents='none'>
                                    <MagnifyingGlass size={20} color="#343330" />
                                    </InputLeftElement>
                                    <Input type='text' onChange={handleSearch} placeholder='Cari Berdasarkan Judul' />
                            </InputGroup>
                            <ModalFilter status={handleStatus}  fillters={dataFillter}/>
                        </Flex>
                       </Box>
                  </Flex>

                  <Card>

                    <DataTable
                      columns={columns}
                      data={dataKegiatan.filter((item) => {
                        return search.toLowerCase() === '' ? item : item.judul_kegiatan.toLowerCase().includes(search)
                      })}
                      persistTableHead
                      noDataComponent="Belum ada kegiatan"
                      pagination
                      customStyles={customStyles}
                    >  
                    </DataTable>


                     <Box bg='custom.lightBlue' w='100%' p={4} color='white' mt='15px'>
                          <Flex justifyContent='space-between'>
                            <Text color='custom.blue' fontSize='sm'>Total Durasi</Text>
                            <Text color='custom.blue' fontSize='sm'>{durasi}</Text>
                          </Flex>
                          <Flex justifyContent='space-between' mt='3'>
                            <Text color='custom.blue' fontSize='md' fontWeight='bold'>Total Pendapatan</Text>
                            <Text color='custom.blue' fontSize='md' fontWeight='bold'>Rp. {(rate * jumlahHari).toLocaleString('id-ID')}</Text>
                          </Flex>
                      </Box>
                </Card>


            </CardBody>
        </Card>
    </div>
  )
}

export default TableKegiatan