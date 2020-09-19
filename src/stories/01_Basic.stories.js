import VueDjGantt from '../VueDjGantt.vue';
import moment from "moment";

const rows = ['First', 'Second', 'Third', 'Forth'].map((v, k) => ({
  id: k + 1,
  internalId: `#${k + 1}`,
  name: v,
}))

export default {
  title: 'VueDjGantt/Basic usage',
  component: VueDjGantt,
  argTypes: {
    locale: {
      description: 'language support (optional, default: en)',
      control: { type: 'select', options: ['pl', 'en', 'es'] }
    },

    row: {
      description: 'triggered when row label is clicked',
      action: '@row',
    },

    item: {
      description: 'triggered when item is clicked',
      action: '@item',
    },

    cell: {
      description: 'triggered when cell is clicked',
      action: '@cell',
    },

    zoom: {
      description: 'triggered when zoom is changed',
      action: '@zoom',
    },

    scrollX: {
      description: 'triggered when x is scrolled',
      action: '@scrollX',
    },

    scrollY: {
      description: 'triggered when y is scrolled',
      action: '@scrollY',
    },

    timeSlot: {
      description: 'triggered when timeslot is clicked',
      action: '@timeslot',
    },

    resized: {
      description: 'triggered when item is resized',
      action: '@resized',
    },

    moved: {
      description: 'triggered when item is moved',
      action: '@moved',
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { VueDjGantt },
  template: `
    <vue-dj-gantt
      v-bind="$props"
      @row="row"
      @item="item"
      @cell="cell"
      @time-slot="timeSlot"
      @zoom="zoom"
      @_resized="resized"
      @_moved="moved"
      @_scroll-x="scrollX"
      @_scroll-y="scrollY"
    />`,
});

export const BasicUsage = Template.bind({});
BasicUsage.storyName = 'Just display items'
BasicUsage.args = {
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

  from: (+ +new Date()) - (3 * 24 * 60 * 60 * 1000),
  to: moment().startOf('day').add(1, 'months'),

  rows: rows,

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

  locale: 'pl',
  height: 0,
};

export const FixedHeight = Template.bind({});
FixedHeight.storyName = 'Fixed height'
FixedHeight.args = {
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

  from: (+ +new Date()) - (3 * 24 * 60 * 60 * 1000),
  to: moment().startOf('day').add(1, 'months'),

  rows: rows,

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

  locale: 'pl',
  height: 160,
};

export const MoveableAndResizable = Template.bind({});
MoveableAndResizable.storyName = 'Move and resize'
MoveableAndResizable.args = {
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

  from: (+ +new Date()) - (3 * 24 * 60 * 60 * 1000),
  to: moment().startOf('day').add(1, 'months'),

  rows: rows,

  items: [
    {
      rowId: 1,
      label: `Some task`,
      style: {background: '#24abf2'},
      time: {
        start: (+ +new Date()) - (1.2 * 24 * 60 * 60 * 1000),
        end: (+ +new Date()) + (1 * 24 * 60 * 60 * 1000),
      },
      moveable: true,
    },
    {
      rowId: 2,
      label: `Other task`,
      style: {background: '#abf224'},
      time: {
        start: moment().add(12, 'hours'),
        end: moment().add(2, 'days').add(4, 'hours'),
      },
      moveable: true,
      resizable: true,
    },
  ],

  locale: 'pl',
  height: 0,
};
