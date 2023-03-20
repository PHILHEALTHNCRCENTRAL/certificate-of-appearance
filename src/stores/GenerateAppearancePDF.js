import { defineStore } from "pinia";
import { reactive } from "vue";

const initialForm = {
  ob_date: null,
  place_visited: null,
  employee_name: null,
  time_of_arrival: null,
  time_of_departure: null,
  person_visited: null,
  signature: null,
  image: null,
};
export const useGenerateAppearanceStore = defineStore(
  "generate_appearance",
  () => {
    const form = reactive({ ...initialForm });

    return {
      form,
    };
  }
);
