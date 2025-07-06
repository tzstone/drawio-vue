// import Vue from 'vue';

// declare module 'vue/types/vue' {
//   interface Vue {
//     $myObject: {
//       message: string;
//     };
//   }
// }

declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
