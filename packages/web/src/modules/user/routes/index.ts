import Login from "@/modules/user/views/Login.vue";
import { ifNotAuthenticated } from "@/router/utils";
import Register from "@/modules/user/views/Register.vue";

export default [
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: ifNotAuthenticated
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    beforeEnter: ifNotAuthenticated
  }
];
