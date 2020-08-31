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
        locale="pl"
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
import moment from "moment";

export default Vue.extend({
  components: {
    VueDjGantt
  },

  data() {
    return {
      list: [
        {
          id: "internalId",
          width: 80,
          header: {
            content: "# ID"
          }
        },
        {
          id: "name",
          width: 200,
          header: {
            content: "Resurce name"
          }
        },
      ],

      from: (+ +new Date()) - (2 * 24 * 60 * 60 * 1000),
      to: moment().startOf('day').add(1, 'months'),

      rows: [
        {
          id: 1,
          internalId: '#1',
          name: 'First',
        },
        {
          id: 2,
          internalId: '#2',
          name: 'Second',
        },
      ],

      items: [
        {
          rowId: 1,
          label: `Some task`,
          style: {background: '#24abf2'},
          time: {
            start: (+ +new Date()) - (1.2 * 24 * 60 * 60 * 1000),
            end: (+ +new Date()) + (1 * 24 * 60 * 60 * 1000),
          },
        },
        {
          rowId: 2,
          label: `Other task`,
          style: {background: '#abf224'},
          time: {
            start: moment().add(12, 'hours'),
            end: moment().add(2, 'days').add(4, 'hours'),
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
