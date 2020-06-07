<template>
  <button @click="$emit('click', $event)" v-bind="$attrs">
    <slot>Click me</slot>
  </button>
</template>

<script lang="ts">
export default {}
</script>

<style lang="scss" scoped>
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

button {
  background: $colorBtnBgr;
  color: $colorBtnText;
  font-size: 1rem;
  padding: .6rem 1rem;
  cursor: pointer;

  &[small] {
    font-size: .9rem;
    padding: .3rem .7rem;
  }

  @include inset-when-pressed();

  &[green] {
    background-color: $colorGreen;

    &:hover {
      background-color: darken($colorGreen, 10%);
    }
  }

  &[white] {
    background-color: #fff;
    color: #333;

    &:hover {
      background-color: darken(#fff, 10%);
    }
  }

  &[red] {
    background-color: $colorRed;

    &:hover {
      background-color: darken($colorRed, 10%);
    }
  }

  &[blue] {
    background-color: $colorBlue;

    &:hover {
      background-color: darken($colorBlue, 10%);
    }
  }

  &[grey], &[gray] {
    background-color: $colorGrey;

    &:hover {
      background-color: darken($colorGrey, 10%);
    }
  }

  &[orange] {
    background-color: $colorOrange;

    &:hover {
      background-color: darken($colorOrange, 10%);
    }
  }

  &[transparent] {
    background-color: transparent;
  }

  &[rounded] {
    border-radius: 999px;
  }

  &[unrounded] {
    border-radius: 0;
  }

  &[icon-only] {
    i {
      margin-right: 0;
    }
  }

  i {
    margin-right: 4px;
  }
}
</style>
