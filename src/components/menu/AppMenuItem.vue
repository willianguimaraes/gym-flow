<template>
    <router-link :to="to" class="menu-item" active-class="menu-item-active">

        <q-item-section v-if="icon" avatar>
            <q-icon :name="icon" />
        </q-item-section>

        <q-item-section>
            <q-item-label>{{ title }}</q-item-label>
            <q-item-label caption>{{ caption }}</q-item-label>
        </q-item-section>

    </router-link>
</template>

<script setup lang="ts">
export interface AppMenuItemProps {
    title: string;
    caption?: string;
    to?: string;
    icon?: string;
};

withDefaults(defineProps<AppMenuItemProps>(), {
    caption: '',
    to: '/',
    icon: '',
});

</script>

<style scoped>
.menu-item {
    width: 100%;

    height: 52px;

    display: flex;
    align-items: center;
    gap: 14px;

    padding: 0 18px;

    border-radius: 14px;

    color: #d5d5d5;
    text-decoration: none;

    transition:
        background 0.2s,
        transform 0.15s,
        color 0.2s;

    font-weight: 600;

    margin-bottom: 8px;
}

.menu-item:hover {
    background: rgba(255, 115, 0, 0.12);

    color: #ff7300;

    transform: translateX(4px);
}

.menu-item-active {
    background: linear-gradient(90deg,
            rgba(255, 115, 0, 0.22),
            rgba(255, 115, 0, 0.08));

    color: #ff7300;

    border-left: 4px solid #ff7300;
}
</style>