<template>
  <div id="app">
    <div class="content">
      <h1>Basic usage</h1>
      <VueDjGantt
        :list="list"
        :rows="rows"
        :items="items"
      />

      <h1>No parameters</h1>
      <VueDjGantt
      />

      <h1>Custom dates</h1>
      <VueDjGantt
        :list="list"
        :rows="rows"
        :items="items"
        :from="from"
        :to="to"
      />

      <h1>Play with height</h1>
      <VueDjGantt
        :list="list"
        :rows="rows"
        :items="items"
        :from="from"
        :to="to"
        :height="100"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VueDjGantt from '@/VueDjGantt.vue';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    VueDjGantt
  },
  data() {
    return {
      list: {
        internalId: {
          id: "internalId",
          data: "internalId",
          width: 80,
          header: {
            content: "ID"
          }
        },
        name: {
          id: "name",
          data: "name",
          width: 200,
          header: {
            content: "Nazwa"
          }
        },
      },

      from: (+ +new Date()) - (2 * 24 * 60 * 60 * 1000),
      to: (+ +new Date()) + (4 * 24 * 60 * 60 * 1000),

      rows: [
        {
          id: 1,
          internalId: 'first',
          name: 'First',
        },
        {
          id: 2,
          internalId: 'second',
          name: 'Second',
        },
      ],

      items: [
        {
          id: 1,
          rowId: 1,
          label: `Some task`,
          style: {background: '#24abf2'},
          time: {
            start: (+ +new Date()) - (1.2 * 24 * 60 * 60 * 1000),
            end: (+ +new Date()) + (1 * 24 * 60 * 60 * 1000),
          },
        },
        {
          id: 1,
          rowId: 2,
          label: `Other task`,
          style: {background: '#abf224'},
          time: {
            start: (+ +new Date()) + (0.5 * 24 * 60 * 60 * 1000),
            end: (+ +new Date()) + (2.4 * 24 * 60 * 60 * 1000),
          },
        },
      ],
    }
  },
});
</script>

<style lang="scss">
html, body {
  font-family: Tahoma, Verdana, Arial;
}

.content {
  background: #f8f8f8;
  padding: 5rem 8rem 8rem;
}
</style>
