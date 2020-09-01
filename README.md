<p float="left">
    <img src="https://cdn.auth0.com/blog/vuejs/vue-logo.png" alt="Vue.js" width="100"/>
</p>

# vue-dj-gantt

Simple Gantt diagram component for Vue.

[Live demo](https://jdoleczek.github.io/vue-dj-gantt/) - with Storybook ( https://storybook.js.org/ )

Inspired by: https://www.npmjs.com/package/gantt-vue \
Created with: https://www.npmjs.com/package/vue-sfc-rollup

## Features

- zoom ( CTRL + scroll ),
- resize,
- drag (only in row).

## Install

```
npm i vue-dj-gantt
```

## Basic usage

![vue-dj-gantt](/images/vue-dj-gantt-example1.png)

```xml
<template>
  <div id="app">
    <div class="content">
      <VueDjGantt
        :from="from"
        :to="to"

        :list="list"
        :rows="rows"
        :items="items"

        locale="pl"
      />
    </div>
  </div>
</template>
```

```javascript
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
```

