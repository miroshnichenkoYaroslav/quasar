<template>
  <div class="q-pa-md">
    <q-carousel
      animated
      v-model="slide"
      navigation
      infinite
      autoplay
      transition-prev="slide-right"
      transition-next="slide-left"
    >
      <q-carousel-slide :name="1" img-src="https://cdn.quasar-framework.org/img/mountains.jpg" />
      <q-carousel-slide :name="2" img-src="https://cdn.quasar-framework.org/img/parallax1.jpg" />
      <q-carousel-slide :name="3" img-src="https://cdn.quasar-framework.org/img/parallax2.jpg" />
      <q-carousel-slide :name="4" img-src="https://cdn.quasar-framework.org/img/quasar.jpg" />
    </q-carousel>
  </div>
</template>

<script>
export default {
  data () {
    return {
      slide: 1
    }
  }
}
</script>
