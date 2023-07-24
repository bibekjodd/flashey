<script setup lang="ts">
import { fetchUser } from "@/lib/auth";
import { useAuthModal } from "@/stores/useAuthModal";
import { useUser } from "@/stores/useUser";
import { onMounted } from "vue";

const authModal = useAuthModal();
const user = useUser();

onMounted(async () => {
  const res = await fetchUser();
  if (res.data) {
    user.setUser(res.data);
    authModal.close();
  }
  user.clearLoading();
});
</script>

<template>
  <section
    v-show="user.isLoading"
    class="absolute inset-0 bg-white z-50 grid place-items-center"
  >
    <div class="overlay-loader"></div>
  </section>
</template>

<style>
.overlay-loader {
  transform: rotateZ(45deg);
  perspective: 1000px;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  color: #000;
}
.overlay-loader:before,
.overlay-loader:after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: inherit;
  height: inherit;
  border-radius: 50%;
  transform: rotateX(70deg);
  animation: 1s spin linear infinite;
}
.overlay-loader:after {
  color: #ff3d00;
  transform: rotateY(70deg);
  animation-delay: 0.4s;
}

@keyframes rotate {
  0% {
    transform: translate(-50%, -50%) rotateZ(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotateZ(360deg);
  }
}

@keyframes rotateccw {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(-360deg);
  }
}

@keyframes spin {
  0%,
  100% {
    box-shadow: 0.2em 0px 0 0px currentcolor;
  }
  12% {
    box-shadow: 0.2em 0.2em 0 0 currentcolor;
  }
  25% {
    box-shadow: 0 0.2em 0 0px currentcolor;
  }
  37% {
    box-shadow: -0.2em 0.2em 0 0 currentcolor;
  }
  50% {
    box-shadow: -0.2em 0 0 0 currentcolor;
  }
  62% {
    box-shadow: -0.2em -0.2em 0 0 currentcolor;
  }
  75% {
    box-shadow: 0px -0.2em 0 0 currentcolor;
  }
  87% {
    box-shadow: 0.2em -0.2em 0 0 currentcolor;
  }
}
</style>
