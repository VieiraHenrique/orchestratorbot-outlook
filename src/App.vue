<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app right>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            OrchestratorBot
          </v-list-item-title>
          <v-list-item-subtitle>
            by FlowIQ
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.path"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-toolbar-title><v-img src="logo.png"></v-img></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
      items: [
        {
          title: "Search orchestrations",
          icon: "mdi-magnify",
          path: "/",
        },
        { title: "Find customer", icon: "mdi-account", path: "/findCustomer" },
        { title: "Get last SO", icon: "mdi-undo", path: "/getLastSO" },
        { title: "Create new SO", icon: "mdi-plus", path: "/createSO" },
        { title: "About", icon: "mdi-information-outline", path: "/about" },
      ],
    };
  },
};
</script>
