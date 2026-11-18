import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.tsx',
                'resources/js/login.tsx',
                'resources/js/orders.tsx',
                'resources/js/hotmix-orders.tsx',
                'resources/js/batu-orders.tsx',
                'resources/js/analytics.tsx',
                'resources/js/suppliers.tsx',
                'resources/js/products.tsx',
                'resources/js/reports.tsx',
                'resources/js/team.tsx',
                'resources/js/integrations.tsx',
                'resources/js/settings.tsx',
                'resources/js/customers.tsx',
                'resources/js/create-customers.tsx',
                'resources/js/create-team.tsx',
                'resources/js/edit-team.tsx',
                'resources/js/create-products.tsx',
                'resources/js/edit-products.tsx',
                'resources/js/detail-products.tsx',
                'resources/js/products-hotmix.tsx',
                'resources/js/create-products-hotmix.tsx',
                'resources/js/edit-products-hotmix.tsx',
                'resources/js/detail-products-hotmix.tsx',
                'resources/js/products-batu.tsx',
                'resources/js/create-products-batu.tsx',
                'resources/js/edit-products-batu.tsx',
                'resources/js/detail-products-batu.tsx',
                'resources/js/create-orders.tsx',
                'resources/js/create-hotmix-orders.tsx',
                'resources/js/create-batu-orders.tsx',
                'resources/js/edit-orders.tsx',
                'resources/js/detail-orders.tsx',
                'resources/js/edit-hotmix-orders.tsx',
                'resources/js/detail-hotmix-orders.tsx',
                'resources/js/detail-batu-orders.tsx',
                'resources/js/edit-batu-orders.tsx',
                'resources/js/create-suppliers.tsx',
                'resources/js/edit-suppliers.tsx',
                'resources/js/detail-suppliers.tsx',
                'resources/js/blade.js',
            ],
            refresh: true,
            config: {
                host: '0.0.0.0',
                port: 5173,
            },
        }),
        tailwindcss(),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});
