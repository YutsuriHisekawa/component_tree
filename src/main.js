import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';


const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{cyan.50}',
            100: '{cyan.100}',
            200: '{cyan.200}',
            300: '{cyan.300}',
            400: '{cyan.400}',
            500: '{cyan.500}',
            600: '{cyan.600}',
            700: '{cyan.700}',
            800: '{cyan.800}',
            900: '{cyan.900}',
            950: '{cyan.950}'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{cyan.950}',
                    inverseColor: '#ffffff',
                    hoverColor: '{cyan.300}',
                    activeColor: '{cyan.800}'
                },
                highlight: {
                    background: '{cyan.950}',
                    focusBackground: '{cyan.700}',
                    color: '#ffffff',
                    focusColor: '#ffffff'
                }
            },
            dark: {
                primary: {
                    color: '{cyan.50}',
                    inverseColor: '{cyan.950}',
                    hoverColor: '{cyan.100}',
                    activeColor: '{cyan.200}'
                },
                highlight: {
                    background: 'rgba(250, 250, 250, .16)',
                    focusBackground: 'rgba(250, 250, 250, .24)',
                    color: 'rgba(255,255,255,.87)',
                    focusColor: 'rgba(255,255,255,.87)'
                }
            }
        }
    }
});

const app = createApp(App)
app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: false || 'none',
        }
    }
});

app.use(PrimeVue);
app.use(router);

app.mount('#app')
