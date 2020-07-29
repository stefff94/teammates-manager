<template>
    <div class="flip-card-front">
        <div class="ui card">
            <div class="content">
                <img class="left floated mini ui image rounded"
                     :src="data.photoUrl" alt="icon">
                <div class="header">{{ data.name }}</div>
                <div class="meta">{{ data.role }}</div>
                <div class="description mt35">
                    <div class="ui list">
                        <div class="item">
                            <i class="mail icon"></i>
                            <div class="content">{{ data.email }}</div>
                        </div>
                        <div class="item">
                            <i class="globe icon"></i>
                            <div class="content">{{ data.city }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CardFront",
        props: {
            data: Object
        }
    }
</script>
