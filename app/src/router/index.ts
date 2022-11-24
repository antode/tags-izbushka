import { createRouter, createWebHistory } from "vue-router";
import SourceTextProcessingView from "@/views/SourceTextProcessingView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: SourceTextProcessingView,
    },
  ],
});

export default router;
