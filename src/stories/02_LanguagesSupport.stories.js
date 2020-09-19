import VueDjGantt from '../VueDjGantt.vue';
import moment from "moment";

const rows = ['First', 'Second', 'Third', 'Forth'].map((v, k) => ({
  id: k + 1,
  internalId: `#${k + 1}`,
  name: v,
}));

const momentLocales = [
  'af',
  'ar-dz',
  'ar-kw',
  'ar-ly',
  'ar-ma',
  'ar-sa',
  'ar-tn',
  'ar',
  'az',
  'be',
  'bg',
  'bm',
  'bn',
  'bo',
  'br',
  'bs',
  'ca',
  'cs',
  'cv',
  'cy',
  'da',
  'de-at',
  'de-ch',
  'de',
  'dv',
  'el',
  'en-au',
  'en-ca',
  'en-gb',
  'en-ie',
  'en-nz',
  'eo',
  'es-do',
  'es-us',
  'es',
  'et',
  'eu',
  'fa',
  'fi',
  'fo',
  'fr-ca',
  'fr-ch',
  'fr',
  'fy',
  'gd',
  'gl',
  'gom-latn',
  'gu',
  'he',
  'hi',
  'hr',
  'hu',
  'hy-am',
  'id',
  'is',
  'it',
  'ja',
  'jv',
  'ka',
  'kk',
  'km',
  'kn',
  'ko',
  'ky',
  'lb',
  'lo',
  'lt',
  'lv',
  'me',
  'mi',
  'mk',
  'ml',
  'mr',
  'ms-my',
  'ms',
  'mt',
  'my',
  'nb',
  'ne',
  'nl-be',
  'nl',
  'nn',
  'pa-in',
  'pl',
  'pt-br',
  'pt',
  'ro',
  'ru',
  'sd',
  'se',
  'si',
  'sk',
  'sl',
  'sq',
  'sr-cyrl',
  'sr',
  'ss',
  'sv',
  'sw',
  'ta',
  'te',
  'tet',
  'th',
  'tl-ph',
  'tlh',
  'tr',
  'tzl',
  'tzm-latn',
  'tzm',
  'uk',
  'ur',
  'uz-latn',
  'uz',
  'vi',
  'x-pseudo',
  'yo',
  'zh-cn',
  'zh-hk',
  'zh-tw',
];

export default {
  title: 'VueDjGantt/Languages support',
  component: VueDjGantt,
  argTypes: {
    locale: {
      description: 'language support (optional, default: en)',
      control: { type: 'select', options: momentLocales }
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
  data () {
    return {
      selectedLocale: 'pl',
      momentLocales,
    }
  },
  components: { VueDjGantt },
  template: `
    <div>
      <label>Moment.js locales</label>
      <div style="padding: 1rem 0">
        <button
          v-for="(locale, localeIndex) in momentLocales"
          :key="localeIndex"
          :disabled="selectedLocale == locale"
          @click="selectedLocale = locale"
        >
          {{ locale }}
        </button>
      </div>
      <vue-dj-gantt
        v-bind="$props"
        :locale="selectedLocale"
        @row="row"
        @item="item"
        @cell="cell"
        @time-slot="timeSlot"
        @zoom="zoom"
      />
    </div>
  `,
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

  height: 0,
};
