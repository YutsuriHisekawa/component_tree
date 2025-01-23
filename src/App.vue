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
                const m_comp_id = item.m_kary_det_jabatan?.[0]?.m_comp_id ?? null;
                const m_divisi_id = item.m_kary_det_jabatan?.[0]?.m_divisi_id ?? null;
                const m_branch_id = item.m_kary_det_jabatan?.[0]?.m_branch_id ?? null;
                const m_subcomp_id = item.m_kary_det_jabatan?.[0]?.m_subcomp_id ?? null;

                if (jabatan !== null || level !== null) {
                    return {
                        level: level,
                        nama_lengkap: item.nama_lengkap,
                        jabatan: jabatan,
                        nama_sbu: nama_sbu,
                        m_comp_id: m_comp_id,
                        m_divisi_id: m_divisi_id,
                        m_branch_id: m_branch_id,
                        m_subcomp_id: m_subcomp_id
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

const pohon = ref({
    label1: 'PT.TEMPRINA',
    label2: 'STRUKTRU ORGANISASI',
    level: 0,
    m_comp_id: 0,
    m_divisi_id: 0,
    m_branch_id: 0,
    m_subcomp_id: 0,
    children: []
});

const covert_data = () => {
    const levelMap = {};
    datalevel.forEach(item => {
        if (!levelMap[item.level]) {
            levelMap[item.level] = [];
        }
        levelMap[item.level].push(item);
    });

    const processLevel = (level, parent = null) => {
        if (!levelMap[level]) return [];

        return levelMap[level].map(item => {
            // Check if item should be added as a child of the parent
            const isValidChild = parent 
                ? (
                    (parent.m_comp_id === null || item.m_comp_id === parent.m_comp_id) &&
                    (parent.m_divisi_id === null || item.m_divisi_id === parent.m_divisi_id) &&
                    (parent.m_branch_id === null || item.m_branch_id === parent.m_branch_id) &&
                    (parent.m_subcomp_id === null || item.m_subcomp_id === parent.m_subcomp_id)
                )
                : true;

            if (!isValidChild) {
                return null; // Skip adding this item as a child
            }

            const obj = {
                level: item.level,
                nama_lengkap: item.nama_lengkap,
                jabatan: item.jabatan,
                nama_sbu: item.nama_sbu,
                m_comp_id: item.m_comp_id ?? null,
                m_divisi_id: item.m_divisi_id ?? null,
                m_branch_id: item.m_branch_id ?? null,
                m_subcomp_id: item.m_subcomp_id ?? null,
                children: processLevel(level + 1, item) // Pass current item as parent
            };

            // Only add children if they exist
            if (obj.children.length === 0) {
                delete obj.children;
            }

            return obj;
        }).filter(item => item !== null); // Filter out invalid children
    };

    const structure = processLevel(0);
    if (structure.length > 0) {
        pohon.value.children = structure;
    }

    console.log('Final Structure', pohon.value);
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

        <OrganizationChart :value="pohon">
            <template #default="slotProps">
                <span class="text-xl font-bold">{{ slotProps.node.nama_lengkap }}</span>
                <span class="text-xl font-bold">{{ slotProps.node.label1 }}</span>
                <br>
                <span>{{ slotProps.node.label2 }}</span>
                <span>{{ slotProps.node.jabatan }}</span>
                <br>
                <span>{{ slotProps.node.nama_sbu }}</span>
                <br>
                <span>LEVEL {{ slotProps.node.level }}</span>
            </template>
        </OrganizationChart>

    </div>

</template>
