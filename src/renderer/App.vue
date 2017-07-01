<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'hello'
    }
</script>

<style>
    /* CSS */
    body {
        margin: 0px;
        padding: 0px;
        /*background: url(assets/bg1.jpg) center !important;
            background-size: cover;*/
        background: #20a0ff url("assets/background.jpg");
        background-size: 100%;
    }
</style>
