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
      ganttConfig: {
        locale: {
          weekdays: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
          weekdaysShort: ['N', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'],
          weekdaysMin: ['N', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'],
          months: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
          monthsShort: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
        },
        height: window.innerHeight - 190,
        list: {
          rows: {},
          columns: {
            data: {
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
              }
            }
          },
          toggle: {
            display: false,
          },
        },
        chart: {
          items: {},
          time: {
            from: (+ +new Date()) - (7 * 24 * 60 * 60 * 1000),
            to: (+ +new Date()) + (90 * 24 * 60 * 60 * 1000),
          },
        },
      },

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

<template>
  <div id="app">
    <div class="content">
      <h1>Basic usage</h1>
      <VueDjGantt
        :config="ganttConfig"
        :rows="rows"
        :items="items"
      />
    </div>
  </div>
</template>

<style lang="scss">
.content {
  background: #f8f8f8;
  padding: 5rem 8rem 8rem;
}
</style>
