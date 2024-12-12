<script setup>
import { ref } from 'vue'
import OrganizationChart from 'primevue/organizationchart';
const data = ref({
    label: 'Tetsuya Kumiko',
    children: [
        {
            label: 'Udin Ganteng',
            children: [
                {
                    label: 'Arjuna'
                },
                {
                    label: 'Syarif QL'
                }
            ]
        },
        {
            label: 'Yuandi',
            children: [
                {
                    label: 'Steven QL'
                },
                {
                    label: 'Josef B'
                }
            ]
        }
    ]
});
</script>

<template>

  <div class="h-screen flex justify-center items-center bg-black">
    <OrganizationChart :value="data">
    <template #default="slotProps">
        <span>{{ slotProps.node.label }}</span>
    </template>
</OrganizationChart>

  </div>

</template>
