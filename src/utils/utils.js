import moment from 'moment';



function sumDurations(durations) {
    let totalDuration = moment.duration();

    durations.forEach(duration => {
        const [hours,minutes,seconds] = duration.split(':');
        totalDuration.add(moment.duration({
            hours: parseInt(hours,10),
            minutes: parseInt(minutes,10),
            seconds: parseInt(seconds,10)
        }));
    });

    return totalDuration;
}

// Fungsi untuk menghitung total pendapatan
function calculateTotalIncome(duration,ratePerHour) {
    const [hours,minutes] = duration.split(':').map(Number);
    const totalHours = hours + (minutes / 60);
    const totalIncome = totalHours * ratePerHour;
    return totalIncome;
}

const formatRupiah = (value) => {
    const numberString = value.replace(/[^,\d]/g,'').toString();
    const split = numberString.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0,sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        const separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
    return rupiah;
};

const clearTitik = (value) => {
    return value.replace(/\./g,'');
};

function getSelisihHari(date1,date2) {
    // Membuat objek Date untuk kedua tanggal
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);

    // Mendapatkan waktu dalam milidetik untuk kedua tanggal
    const timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime());

    // Menghitung selisih hari dengan membagi jumlah milidetik dalam satu hari
    const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return dayDifference;
}


const validationField = (data,toast) => {

    if (data.tglMulai === "") {
        toast({
            title: `Tanggal Mulai Belum Dipilih!`,
            status: 'warning',
            isClosable: true,
            position: 'top',
        })
        return false;
    } else if (data.tglBerakhir === "") {
        toast({
            title: `Tanggal Berakhir Belum Dipilih!`,
            status: 'warning',
            isClosable: true,
            position: 'top',
        })
        return false;
    } else if (data.jamMulai === "") {
        toast({
            title: `Jam Mulai Belum Dipilih!`,
            status: 'warning',
            isClosable: true,
            position: 'top',
        })
        return false;
    } else if (data.jamBerakhir === "") {
        toast({
            title: `Jam Berakhir Belum Dipilih!`,
            status: 'warning',
            isClosable: true,
            position: 'top',
        })
        return false;
    } else if (data.judulKegiatan === "") {
        toast({
            title: `Judul Kegiatan Belum Diisi!`,
            status: 'warning',
            isClosable: true,
            position: 'top',
        })
        return false;
    } else if (data.idProyek === "") {
        toast({
            title: `Proyek Belum Dipilih!`,
            status: 'warning',
            isClosable: true,
            position: 'top',
        })
        return false;
    };
}

const validationPengaturan = (data,toast) => {

    if (data.nama === "") {
        toast({
            title: `Nama Belum Diisi!`,
            status: 'warning',
            isClosable: true,
            position: 'top',
        })
        return false;
    } else if (data.rate === "") {
        toast({
            title: `Rate Belum Diisi!`,
            status: 'warning',
            isClosable: true,
            position: 'top',
        })
        return false;
    }
}

export { sumDurations,calculateTotalIncome,formatRupiah,clearTitik,validationField,validationPengaturan,getSelisihHari }