<script setup>
import { ref, onMounted } from 'vue'
import OrganizationChart from 'primevue/organizationchart';
const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;


const isRequesting = ref(false);
let initialValues = {};
let datalevel = {}

const getData = async () => {
    const dataURL = `${API_URL}/operation/m_kary`;
    isRequesting.value = true;

    const params = {
        join: true,
        scopes: "Structure",
        transform: false,
    };
    const fixedParams = new URLSearchParams(params);

    try {
        const res = await fetch(dataURL + '?' + fixedParams, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_TOKEN}`,
            },
        });
        if (!res.ok) throw new Error("Failed when trying to read data");

        const resultJson = await res.json();
        initialValues = resultJson.data;

        datalevel = initialValues
            .map(item => {
                // console.log('tes',item)
                const jabatan = item.m_kary_det_jabatan?.[0]?.jabatan ?? null;
                const level = item.m_kary_det_jabatan?.[0]?.level ?? null;
                const nama_sbu = item.m_kary_det_jabatan?.[0]?.nama_sbu ?? null;
                if (jabatan !== null || level !== null) {
                    return {
                        level: level,
                        nama_lengkap: item.nama_lengkap,
                        jabatan: jabatan,
                        nama_sbu: nama_sbu
                    };
                }
                return null;  
            })
            .filter(item => item !== null);  
        
        console.log('Data Level', datalevel);

    } catch (error) {
        console.error("Error fetching data: ", error);
    } finally {
        isRequesting.value = false;
    }
};

const pohon = ref({});

const covert_data = () => {
    const levelMap = {};
    datalevel.forEach(item => {
        if (!levelMap[item.level]) {
            levelMap[item.level] = [];
        }
        levelMap[item.level].push(item);
    });

    const processLevel = (level) => {
        if (!levelMap[level]) return [];

        return levelMap[level].map(item => {
            const obj = {
                level: item.level,
                nama_lengkap: item.nama_lengkap, 
                jabatan: item.jabatan,
                nama_sbu : item.nama_sbu,
                children: processLevel(level + 1) 
            };

            if (obj.children.length === 0) {
                delete obj.children;
            }
            return obj;
        });
    };

    const minLevel = Math.min(...datalevel.map(item => item.level));
    const structure = processLevel(minLevel);
    const finalStructure = structure.length === 1 ? structure[0] : structure;
    console.log('halo',finalStructure)
    console.log('finalResult', finalStructure);
    pohon.value = finalStructure; 
};

onMounted(() => {
    getData();
});

</script>

<template>


    <div class="h-screen flex flex-col justify-center items-center bg-gray-500">
        <button @click="covert_data" class="font-semibold p-4 mb-10 bg-red-500 rounded-xl shadow-xl">
            UBAH DATA
        </button>

        <OrganizationChart :value="pohon" >
            <template #default="slotProps">
                <span class="text-xl font-bold">{{ slotProps.node.nama_lengkap }}</span>
                <br>
                <span>{{ slotProps.node.jabatan }}</span>
                <br>
                <span>{{ slotProps.node.nama_sbu }}</span>
            </template>
</OrganizationChart>

    </div>

</template>
