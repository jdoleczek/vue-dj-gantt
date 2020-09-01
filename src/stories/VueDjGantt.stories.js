import VueDjGantt from '../VueDjGantt.vue';
import moment from "moment";

export default {
  title: 'COMPONENT/VueDjGantt',
  component: VueDjGantt,
  argTypes: {
    locale: {
      description: 'language support',
      control: { type: 'select', options: ['pl', 'en', 'es'] }
    },

    row: {
      description: 'triggered when row label clicked',
      action: '@row',
    },

    item: {
      description: 'triggered when item clicked',
      action: '@item',
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { VueDjGantt },
  template: '<vue-dj-gantt @row="row" @item="item" v-bind="$props" />',
});

export const BasicUsage = Template.bind({});
BasicUsage.storyName = 'Basic usage'
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

  locale: 'pl',
};
