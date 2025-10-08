<template>
  <div class="qa-answer-wrapper">
    <ul class="qa-answer-link-list" v-if="qaAnswer.linkList != null && qaAnswer.linkList.length > 0">
      <li v-for="answerLink in qaAnswer.linkList" :key="answerLink.id">
        <qa-link :qa-link="answerLink"></qa-link>
      </li>
    </ul>
    <div v-if="qaAnswer.description">
      <span>{{qaAnswer.description}}</span>
    </div>
  </div>
</template>

<script>
import QaLink from '@/views/qa/qa-link';

export default {
  name: "qa-answer",
  props: {
    qaAnswer: Object
  },
  data() {
    return {}
  },
  components: {
    'qa-link': QaLink
  }
}
</script>

<style lang="scss" scoped>
  .qa-answer-wrapper {
    background: #f2f2f2;
    //padding: 10px 0;
    //margin-top: 5px;
  }

  .qa-answer-link-list {
  }
</style>
