<template>
  <div
    ref="gantt"
    class="gantt"
    :style="{ height: px(componentHeight) }"
    @wheel="scrollBasic"
  >
    <div
      class="gantt-rows"
      @wheel="scrollRows"
    >
      <div
        v-for="(rowHeader, rowHeaderIndex) in list"
        :key="rowHeaderIndex"
        :style="{ width: px(rowHeader.width) }"
        class="gantt-row"
      >
        <div class="gantt-row-header">
          <div class="gantt-row-header-title">
            {{ rowHeader.header.content }}
          </div>
          <div class="gantt-row-header-dots">
            <div class="gantt-row-header-dots" />
          </div>
        </div>
        <div
          ref="rowlabel"
          class="gantt-row-header-data"
          :style="{ width: px(rowHeader.width), height: px(dataHeight) }"
          @mousemove="onRowsHeaderMove"
        >
          <div
            v-for="(row, rowIndex) in rows"
            :key="rowIndex"
            class="gantt-row-header-data-row"
            @click="$emit('row', row)"
          >
            {{ row[rowHeader.id] }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="gantt-data"
      @wheel="scrollData"
    >
      <div
        ref="dataheader"
        class="gantt-data-header"
        @mousemove="onDataHeaderMove"
      >
        <div ref="datacalendar" class="gantt-data-header-calendar-wrap">
          <div class="gantt-data-header-calendar">
            <div
              v-for="(slot, slotIndex) in dataSlots.calendar"
              :key="slotIndex"
              :style="{
                width: px(Math.max(slot.width, 260)),
                left: slot.offset,
              }"
              class="gantt-data-header-calendar-date"
            >
              {{ slot.moment.format(calendarFormat) }}
            </div>
          </div>
        </div>
        <div
          ref="dataslots"
          :style="{ width: px(dataWidth) }"
          class="gantt-data-header-slots-wrap"
        >
          <div
            class="gantt-data-header-slots"
            :style="{ width: px(dataTotalWidth) }"
          >
            <div
              v-for="(slot, slotIndex) in dataSlots.slots"
              :key="slotIndex"
              :style="{ width: px(dataSlotWidth), left: slot.offset }"
              class="gantt-data-header-slot"
            >
              <div
                v-if="isSlotHeaderInLine"
                class="gantt-data-header-slot-label"
              >
                <span
                  v-for="(line, lineIndex) in labelDescription"
                  :key="lineIndex"
                  :style="{
                    fontSize: `${line.size || 14}px`,
                    fontWeight: line.weight || 400,
                  }"
                >
                  {{ slot.moment.format(line.str) }}
                </span>
              </div>
              <div v-else class="gantt-data-header-slot-label">
                <div
                  v-for="(line, lineIndex) in labelDescription"
                  :key="lineIndex"
                  :style="{
                    fontSize: `${line.size || 14}px`,
                    fontWeight: line.weight || 400,
                  }"
                >
                  {{ slot.moment.format(line.str) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div :style="{ height: px(dataHeight) }" class="gantt-data-wrap-with-scroll">
        <div ref="scrolly" class="gantt-data-y-scroll" @scroll="onYScroll">
          <div
            class="gantt-data-y-scroll-ref"
            :style="{ height: px(dataTotalHeight) }"
          />
        </div>
        <div
          ref="cells"
          :style="{ width: px(dataWidth), height: px(dataHeight) }"
          class="gantt-data-wrap"
        >
          <div
            ref="cellswrap"
            class="gantt-data-wrapped"
            :style="{ width: px(dataTotalWidth), height: px(dataTotalHeight) }"
            @mousedown="onDataMouseDown"
            @mouseup="onDataMouseUp"
            @mousemove="onDataMove"
            @moseleave="selectFrom = selectTo = moveItem = resizeItem = null"
          >
            <div
              v-for="(cell, cellIndex) in cellsAndDataEditable.cells"
              :key="cellIndex"
              :style="{
                left: cell.x,
                top: `${cell.y}px`,
                width: `${cell.width}px`,
                height: `${cell.height}px`,
                background: cell.background,
              }"
              :class="cell.classes"
              class="gantt-data-cell"
            />

            <div
              v-for="(item, itemIndex) in cellsAndDataEditable.data"
              :key="1e9 + itemIndex"
              :style="{
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `${item.width}px`,
                height: `${item.height}px`,
                background:
                  item.item.style && item.item.style.background
                    ? item.item.style.background
                    : null,
                cursor: item.item.moveable ? 'pointer' : null,
                zIndex:
                  (moveItem && item.item == moveItem.item) ||
                  (resizeItem && item.item == resizeItem.item)
                    ? 1000
                    : null,
              }"
              class="gantt-data-item"
              @mousedown.stop="onItemMouseDown(item)"
              @mouseup.stop="onItemMouseUp"
            >
              <div class="gantt-data-item-label">
                {{ item.item.label }}
              </div>
              <div
                v-if="item.item.resizable"
                class="gantt-data-item-resizer"
                @mousedown.stop="onItemResizeMouseDown(item)"
                @mouseup.stop="onItemResizeMouseUp"
              >
                <i class="ion ion-md-arrow-round-forward" />
              </div>
            </div>

            <div
              v-if="selectFrom && selectTo"
              :style="{
                left: `${Math.min(selectFrom.x, selectTo.x)}px`,
                top: `${Math.min(selectFrom.y, selectTo.y)}px`,
                width: `${Math.abs(selectTo.x - selectFrom.x)}px`,
                height: `${Math.abs(selectTo.y - selectFrom.y)}px`,
              }"
              class="gantt-data-select"
            />
          </div>
        </div>
      </div>
      <div ref="scrollx" class="gantt-data-x-scroll" @scroll="onXScroll">
        <div
          class="gantt-data-x-scroll-ref"
          :style="{ width: px(dataTotalWidth) }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

const colHeight = 38;
const DAY_LONG = 86400000;
const HOUR_LONG = 3600000;

const zoomParams = {
  8: {
    slot: DAY_LONG,
    width: 21,
    line: false,
    label: [
      { str: "DD", size: 13 },
      { str: "dd", size: 13 },
    ],
    calendar: "MMMM YYYY",
  },
  9: {
    slot: DAY_LONG,
    width: 42,
    line: false,
    label: [
      { str: "DD", size: 16 },
      { str: "ddd", size: 13 },
    ],
    calendar: "MMMM YYYY",
  },
  10: {
    slot: DAY_LONG,
    width: 84,
    line: false,
    label: [
      { str: "DD", size: 18 },
      { str: "dddd", size: 13 },
    ],
    calendar: "MMMM YYYY",
  },
  11: {
    slot: DAY_LONG,
    width: 160,
    line: true,
    label: [
      { str: "DD", size: 18 },
      { str: "dddd", size: 16 },
    ],
    calendar: "MMMM YYYY",
  },
  12: {
    slot: DAY_LONG,
    width: 320,
    line: true,
    label: [
      { str: "DD", size: 18 },
      { str: "dddd", size: 18 },
    ],
    calendar: "MMMM YYYY",
  },
  13: {
    slot: HOUR_LONG,
    width: 21,
    line: true,
    label: [{ str: "HH", size: 13 }],
    calendar: "DD MMMM YYYY",
  },
  14: {
    slot: HOUR_LONG,
    width: 42,
    line: true,
    label: [{ str: "HH:00", size: 14 }],
    calendar: "DD MMMM YYYY",
  },
  15: {
    slot: HOUR_LONG,
    width: 84,
    line: true,
    label: [{ str: "HH:00", size: 16 }],
    calendar: "DD MMMM YYYY",
  },
  16: {
    slot: HOUR_LONG,
    width: 160,
    line: true,
    label: [{ str: "HH:00", size: 16 }],
    calendar: "DD MMMM YYYY",
  },
};

export default {
  name: "VueDjGantt",

  props: {
    from: {},
    to: {},

    height: {
      type: Number,
      default: 0,
    },

    list: {
      type: Object,
      default: () => {},
    },

    rows: {
      type: Array,
      default: () => [],
    },

    items: {
      type: Array,
      default: () => [],
    },

    cells: { type: Object },
    snapStartFunction: { type: Function },
    snapEndFunction: { type: Function },
    canSelectFunction: { type: Function },

    moveable: {
      type: Boolean,
      default: false,
    },

    resizable: {
      type: Boolean,
      default: false,
    },

    selectable: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      width: 1000,
      zoom: 10,
      xOffset: 0,
      yOffset: 0,
      drag: false,
      dragRef: 0,

      cellsAndDataEditable: {},
      moveItem: null,
      resizeItem: null,
      selectFrom: null,
      selectTo: null,
      selectedCellsBox: {},
      selectedCells: {},

      fromTime: this.from ? new moment(this.from) : (new moment()).startOf('day').add(-7, 'days'),
      toTime: this.to ? new moment(this.to) : (new moment()).startOf('day').add(3, 'months'),
    };
  },

  methods: {
    px(n) {
      return `${n}px`
    },

    get(object, keys, defaultVal = null) {
      keys = Array.isArray(keys) ? keys : keys.replace(/(\[(\d)\])/g, '.$2').split('.');
      object = object[keys[0]];

      if (object && keys.length > 1) {
        return this.__get(object, keys.slice(1), defaultVal);
      }

      return object === undefined ? defaultVal : object;
    },

    scrollBasic(ev) {
      if (ev.ctrlKey) {
        ev.stopPropagation()
        ev.preventDefault()
      }
    },

    scrollData(ev) {
      if (ev.ctrlKey) {
        const zoom = (modifie) => {
          const dataWidth = this.dataWidth;
          const halfDataWidth = dataWidth / 2;
          const w1 = Math.max(this.dataTotalWidth, dataWidth);
          const o1 = this.xOffset + halfDataWidth;
          this.zoom += modifie;
          let w2 = Math.max(this.dataTotalWidth, dataWidth);
          this.scrollX(~~Math.max(0, ((o1 * w2) / w1) - halfDataWidth));
        }

        if (ev.deltaY > 0 && this.zoom > 8) {
          zoom(-1);
        }

        if (ev.deltaY < 0 && this.zoom < 16) {
          zoom(+1);
        }
      } else {
        this.scrollX(this.$refs.scrollx.scrollLeft + ev.deltaX * 10);
        this.scrollY(this.$refs.scrolly.scrollTop + ev.deltaY * 10);
      }
    },

    scrollRows(ev) {
      this.scrollY(this.$refs.scrolly.scrollTop + ev.deltaY * 10);
    },

    scrollX(scrollLeft) {
      let x = Math.max(0, Math.min(this.dataTotalWidth - this.dataWidth, scrollLeft));
      this.xOffset = x;
      this.$refs.scrollx.scrollLeft = x;
      this.$refs.datacalendar.scrollLeft = x;
      this.$refs.dataslots.scrollLeft = x;
      this.$refs.cells.scrollLeft = x;
    },

    scrollY (scrollTop) {
      let y = Math.max(0, Math.min(this.dataTotalHeight - this.dataHeight, scrollTop));
      this.yOffset = y;
      this.$refs.scrolly.scrollTop = y;
      this.$refs.cells.scrollTop = y;

      if (this.$refs.rowlabel) {
        this.$refs.rowlabel.forEach(el => el.scrollTop = y);
      }
    },

    onXScroll (ev) {
      this.scrollX(ev.target.scrollLeft);
    },

    onYScroll (ev) {
      this.scrollY(ev.target.scrollTop);
    },

    onDataHeaderMove (ev) {
      if (ev.buttons == 1) {
        this.scrollX(this.xOffset - ev.movementX);
      }
    },

    onRowsHeaderMove (ev) {
      if (ev.buttons == 1) {
        this.scrollY(this.yOffset - ev.movementY);
      }
    },

    onItemMouseDown (item) {
      this.$emit("item", item);

      if (this.moveable) {
        this.moveItem = item;
      }
    },

    onItemMouseUp () {
      this.moveItem = null;
    },

    onItemResizeMouseDown (item) {
      this.$emit("item", item);

      if (this.resizable) {
        this.resizeItem = item;
      }
    },

    onItemResizeMouseUp () {
      this.resizeItem = null;
    },

    onDataMouseDown (ev) {
      this.moveItem = this.resizeItem = null;

      if (this.selectable) {
        this.selectFrom = this.getDataCoordinates(ev, this.$refs.cellswrap);

        if (!ev.ctrlKey) {
          this.selectedCells = {};
          this.$emit("selected-cells", {});
        }
      }
    },

    onDataMouseUp (ev) {
      if (this.selectFrom && this.selectTo) {
        for (let k in this.selectedCellsBox) {
          this.selectedCells[k] = this.selectedCellsBox[k];
        }

        this.$emit("selected-cells", this.selectedCells);
      }

      this.selectFrom = this.selectTo = this.moveItem = this.resizeItem = null;
    },

    onDataMove (ev) {
      if (ev.buttons == 1) {
        if (this.resizeItem) {
          let time = this.resizeItem.item.time.end + Math.round(ev.movementX / this.pxPerMs);

          if (this.snapEndFunction) {
            time = this.snapEndFunction(this.resizeItem.item.time.end, Math.round(ev.movementX / this.pxPerMs), this.resizeItem.item) || time
          }

          this.resizeItem.item.time.end = time
        } else if (this.moveItem) {
          let time = this.moveItem.item.time.start + Math.round(ev.movementX / this.pxPerMs)
          let refFrom = moment(this.fromTime).startOf("day")

          if (this.snapStartFunction) {
            time = this.snapStartFunction(this.moveItem.item.time.start, Math.round(ev.movementX / this.pxPerMs), this.moveItem.item) || time
          }

          let diff = time - this.moveItem.item.time.start
          this.moveItem.item.time.start = time
          this.moveItem.item.time.end += diff
        } else if (this.selectFrom) {
          this.selectTo = this.getDataCoordinates(ev, this.$refs.cellswrap)
        }
      }
    },

    getDataCoordinates (event, referenceElement) {
      const position = {
        x: event.pageX,
        y: event.pageY
      };

      const offset = {
        left: referenceElement.offsetLeft,
        top: referenceElement.offsetTop
      };

      let reference = referenceElement.offsetParent;

      while(reference){
        offset.left += reference.offsetLeft;
        offset.top += reference.offsetTop;
        reference = reference.offsetParent;
      }

      return {
        x: position.x - offset.left + this.xOffset,
        y: position.y - offset.top + this.yOffset,
      };
    },

    clearSelection () {
      this.selectFrom = null
      this.selectTo = null
      this.selectedCellsBox = {}
      this.selectedCells = {}
      this.$emit("selected-cells", {})
    },
  },

  computed: {
    headerRowsWidth () {
      return Object.values(this.list || {}).reduce((acc, cur) => acc + cur.width, 0)
    },

    componentHeight () {
      return Math.max(72, this.height || (this.dataTotalHeight + 72));
    },

    dataHeight () {
      return Math.max(0, this.componentHeight - 72);
    },

    dataWidth () {
      return this.width - this.headerRowsWidth
    },

    dataTotalHeight () {
      return Object.keys(this.rows).length * colHeight
    },

    dataTotalWidth () {
      return this.dataTotalSlots * zoomParams[this.zoom].width
    },

    dataTotalSlots () {
      let delta = Math.max(this.toTime.valueOf() - this.fromTime.valueOf(), 0)
      return Math.floor(delta / zoomParams[this.zoom].slot)
    },

    dataSlotWidth () {
      return zoomParams[this.zoom].width
    },

    dataSlots () {
      let from = moment(this.fromTime).startOf("day")
      let slotPeriod = zoomParams[this.zoom].slot
      let slotWidth = zoomParams[this.zoom].width
      let slotsCount = ~~((this.toTime.valueOf() - this.fromTime.valueOf()) / slotPeriod)
      let slots = []
      let xOffset = this.xOffset
      let xOffsetEnd = xOffset + this.dataWidth
      let offset = 0
      let calendar = []
      let calendarRef = null

      for (let i = 0; i < slotsCount; i++) {
        if (offset + slotWidth > xOffset && offset < xOffsetEnd) {
          slots.push({
            offset: this.px(Math.max(offset, xOffset) - 1),
            offset_: Math.max(offset, xOffset) - 1,
            moment: moment(from),
          })

          let current = slotPeriod == DAY_LONG ? from.month() : from.day()

          if (current != calendarRef) {
            calendarRef = current

            calendar.push({
              moment: moment(from),
              offset: this.px(Math.max(offset, xOffset) - 1),
              width: slotWidth,
            })
          } else {
            calendar[calendar.length - 1].width += slotWidth
          }
        }

        from.add(1, slotPeriod == DAY_LONG ? "days" : "hours")
        offset += slotWidth
      }

      return {slots, calendar}
    },

    isSlotHeaderInLine () {
      return zoomParams[this.zoom].line
    },

    labelDescription () {
      return zoomParams[this.zoom].label
    },

    calendarFormat () {
      return zoomParams[this.zoom].calendar
    },

    visibleRows () {
      let from = Math.floor(this.yOffset / colHeight)
      let count = Math.ceil(this.dataHeight / colHeight) + 1

      return Object.values(this.rows).slice(from, from + count).map((row, k) => ({
        row,
        y: (from + k) * colHeight,
      }))
    },

    itemGroupedByRowIds () {
      let rows = {}

      // add support for objects
      this.items.forEach(item => {
        if (!rows[item.rowId]) {
          rows[item.rowId] = []
        }

        rows[item.rowId].push(item)
      })

      return rows
    },

    pxPerMs () {
      return zoomParams[this.zoom].width / zoomParams[this.zoom].slot
    },

    cellsAndData () {
      let cells = []
      let data = []
      let slotPeriod = zoomParams[this.zoom].slot
      let now = slotPeriod == DAY_LONG ? moment().startOf("day") : moment().startOf("hour")
      let from = null;

      try {
        from = this.dataSlots.slots[0].moment.valueOf()
      } catch (e) {
        from = moment().valueOf()
      }

      let to = from + (this.dataSlots.slots.length * slotPeriod)
      let refFrom = moment(this.fromTime).startOf("day")
      let dataSlotWidth = this.dataSlotWidth

      this.visibleRows.forEach(row => {
        this.dataSlots.slots.forEach(slot => {
          let background = "#fff"
          let id = `${row.row.id}-${slot.moment.valueOf()}`
          let classes = {}

          if (slot.moment.isSame(now)) {
            background = "#fcf7e4"
          }

          if (this.selectFrom && this.selectTo) {
            let x1 = Math.min(this.selectFrom.x, this.selectTo.x)
            let y1 = Math.min(this.selectFrom.y, this.selectTo.y)
            let x2 = Math.max(this.selectFrom.x, this.selectTo.x)
            let y2 = Math.max(this.selectFrom.y, this.selectTo.y)

            if (slot.offset_ < x2 && slot.offset_ + dataSlotWidth > x1 && row.y < y2 && row.y + colHeight > y1) {
              let canSelect = true

              let cellData = {
                rowId: row.row.id,
                from: slot.moment.valueOf(),
                to: slot.moment.valueOf() + slotPeriod - 1,
                x1: slot.offset_,
                y1: row.y,
                x2: slot.offset_ + dataSlotWidth,
                y2: row.y + colHeight,
              }

              if (this.canSelectFunction) {
                canSelect = this.canSelectFunction(cellData)
              }

              if (canSelect) {
                background = "#80d0ff"
                // this.selectedCellsBox[id] = cellData
              }
            }
          }

          if (this.selectedCells[id]) {
            background = "#40b0ff"
          }

          if (this.cells && this.cells[id]) {
            (this.cells[id].classes || []).forEach(name => classes[name] = true)
          }

          cells.push({
            x: slot.offset,
            y: row.y,
            width: dataSlotWidth,
            height: colHeight,
            background,
            row,
            slot,
            classes,
          })
        })

        if (this.itemGroupedByRowIds[row.row.id]) {
          this.itemGroupedByRowIds[row.row.id].forEach(item => {
            if (item.time.start < to && item.time.end > from) {
              data.push({
                item,
                row,
                y: row.y + 3,
                x: Math.round((item.time.start - refFrom) * this.pxPerMs),
                width: Math.round((item.time.end - item.time.start) * this.pxPerMs),
                height: colHeight - 6,
              })
            }
          })
        }
      })

      return {
        cells,
        data,
      }
    },
  },

  watch: {
    cellsAndData () {
      this.cellsAndDataEditable = JSON.parse(JSON.stringify(this.cellsAndData))
    },

    zoom () {
      this.selectedCells = {}
    },

    from() {
      this.fromTime = this.from ? new moment(this.from) : (new moment()).startOf('day').add(-7, 'days')
    },

    to() {
      this.toTime = this.to ? moment(this.to) : moment(this.from).startOf('day').add(3, 'months')
    },
  },

  mounted () {
    // todo locale
    // moment.locale("pl-my", this.config.locale)
    // this.fromTime = this.from ? moment(this.from) : moment().startOf('day').add(-7, 'days')
    // this.toTime = this.to ? moment(this.to) : moment().startOf('day').add(3, 'months')
    this.width = this.$refs.gantt.clientWidth
    this.cellsAndDataEditable = JSON.parse(JSON.stringify(this.cellsAndData))
    this.scrollX(0)
    this.scrollY(0)
  },
}
</script>

<style lang="scss">
$header-background: #f8f8f8;
$header-color: #606060;

.gantt {
  background: #fff;
  display: flex;
  user-select: none;

  .gantt-rows {
    display: flex;

    .gantt-row {
      .gantt-row-header {
        background: $header-background;
        color: $header-color;
        height: 72px;
        line-height: 70px;
        font-weight: bold;
        box-sizing: border-box;
        padding-left: 5px;
        border-left: solid 1px #fff;
        border-right: solid 2px #eee;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .gantt-row-header-data {
      overflow: hidden;

      .gantt-row-header-data-row {
        box-sizing: border-box;
        border-bottom: solid 1px #eee;
        border-right: solid 1px #eee;
        padding-left: 6px;
        height: 38px;
        line-height: 36px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #555;
        cursor: pointer;

        &:hover {
          background: #f8f8f8;
        }
      }
    }
  }

  .gantt-data {
    position: relative;
    flex-grow: 1;
    flex-shrink: 1;

    .gantt-data-header {
      height: 72px;
      background: $header-background;
      overflow: hidden;

      .gantt-data-header-calendar-wrap {
        height: 18px;
        line-height: 17px;
        font-size: 14px;
        overflow: hidden;

        .gantt-data-header-calendar {
          position: relative;

          .gantt-data-header-calendar-date {
            padding-left: 5px;
            position: absolute;
            top: 0;
            height: 18px;
            box-sizing: border-box;
            border-left: solid 1px #ddd;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            background: $header-background;
            color: $header-color;
          }
        }
      }

      .gantt-data-header-slots-wrap {
        height: 54px;
        overflow: hidden;

        .gantt-data-header-slots {
          position: relative;

          .gantt-data-header-slot {
            position: absolute;
            top: 0;
            box-sizing: border-box;
            border-left: solid 1px #ddd;
            height: 54px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            background: $header-background;
            color: $header-color;
            text-align: center;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;

            .gantt-data-header-slot-label {
              line-height: 130%;
            }
          }
        }
      }
    }

    .gantt-data-wrap {
      overflow: hidden;

      .gantt-data-wrapped {
        position: relative;
      }
    }

    .gantt-data-wrap-with-scroll {
      position: relative;

      .gantt-data-y-scroll {
        overflow-y: scroll;
        overflow-x: hidden;
        position: absolute;
        top: 0;
        bottom: 0;
        right: -14px;
        width: 14px;

        div {
          width: 14px;
        }
      }

      .gantt-data-cell {
        position: absolute;
        box-sizing: border-box;
        border-left: solid 1px #eee;
        border-bottom: solid 1px #eee;
      }

      .gantt-data-item {
        display: flex;
        position: absolute;
        box-sizing: border-box;
        border-left: solid 1px #eee;
        border-bottom: solid 1px #eee;
        background: #ccc;
        border-radius: 20px;
        font-size: 14px;
        line-height: 32px;
        color: #fff;
        overflow: hidden;
        padding-left: 7px;
        padding-right: 2px;

        .gantt-data-item-label {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex-grow: 1;
        }

        .gantt-data-item-resizer {
          width: 14px;
          background: rgba(0, 0, 0, .1);
          text-align: center;
          border-radius: 0 20px 20px 0;
          cursor: pointer;
        }
      }

      .gantt-data-select {
        position: absolute;
        z-index: 1000;
        background: rgba(0, 140, 255, 0.2);
        border: dashed 2px #008fff;
      }
    }

    .gantt-data-x-scroll {
      overflow-x: scroll;
      overflow-y: hidden;
      position: absolute;
      bottom: -14px;
      left: 0;
      right: 0;
      height: 14px;

      div {
        height: 14px;
      }
    }
  }
}
</style>
