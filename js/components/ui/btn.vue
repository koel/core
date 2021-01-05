<template>
  <button @click="$emit('click', $event)">
    <slot>Click me</slot>
  </button>
</template>

<script lang="ts">
export default {}
</script>

<style lang="scss" scoped>
@import "~#/partials/_mixins.scss";

button {
  background: var(--color-blue);
  color: var(--color-white);
  font-size: 1rem;
  padding: .6rem 1rem;
  cursor: pointer;

  &:hover {
    background-color: var(--color-blue-darker);
  }

  &[small] {
    font-size: .9rem;
    padding: .3rem .7rem;
  }

  @include inset-when-pressed();

  &[green] {
    background-color: var(--color-green);

    &:hover {
      background-color: var(--color-green-darker)
    }
  }

  &[white] {
    background-color: var(--color-white);
    color: var(--color-black);

    &:hover {
      background-color: var(--color-white-darker);
    }
  }

  &[red] {
    background-color: var(--color-red);

    &:hover {
      background-color: var(--color-red-darker);
    }
  }

  &[grey], &[gray] {
    background-color: var(--color-grey);

    &:hover {
      background-color: var(--color-grey-darker)
    }
  }

  &[orange] {
    background-color: var(--color-orange);

    &:hover {
      background-color: var(--color-orange-darker);
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

  &[uppercase] {
    text-transform: uppercase;
  }

  i {
    margin-right: 4px;
  }
}
</style>
