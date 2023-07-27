<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "vue-toast-notification";
// @ts-ignore
import AccountIcon from "vue-material-design-icons/AccountOutline.vue";
// @ts-ignore
import EmailIcon from "vue-material-design-icons/EmailOutline.vue";
// @ts-ignore
import LockIcon from "vue-material-design-icons/LockOutline.vue";
// @ts-ignore
import EyeIcon from "vue-material-design-icons/EyeOutline.vue";
// @ts-ignore
import EyeOffIcon from "vue-material-design-icons/EyeOffOutline.vue";
import { useUser } from "../../stores/useUser";
import { authUser } from "@/lib/auth";
import { imageToDataUri } from "@/lib/imageToDataUri";
import { useAuthModal } from "@/stores/useAuthModal";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const authModal = useAuthModal();
const user = useUser();
const toast = useToast();
const isLoginMode = ref<boolean>(true);
const email = ref<string>("");
const name = ref<string>("");
const password = ref<string>("");
const passwordHidden = ref<boolean>(true);
const isFormLoading = ref<boolean>(false);
const imageUri = ref<string>("");

const toggleHidePassword = () => {
  passwordHidden.value = !passwordHidden.value;
};

const toggleLoginMode = () => {
  if (isFormLoading.value) return;
  isLoginMode.value = !isLoginMode.value;
};

const handleImageChange = async (e: Event) => {
  const inputElement = e.target as HTMLInputElement;
  if (inputElement.files) {
    const dataUri = await imageToDataUri(inputElement.files[0]);
    imageUri.value = dataUri;
  }
};

const submitForm = async (e: Event) => {
  toast.clear();
  e.preventDefault();
  isFormLoading.value = true;
  const res = await authUser({
    name: name.value,
    email: email.value,
    password: password.value,
    imageUri: imageUri.value || undefined,
    isLoginMode: isLoginMode.value,
  });
  if (res.data) {
    user.setUser(res.data);
    name.value = "";
    email.value = "";
    password.value = "";
    imageUri.value = "";
  } else toast.error(res.error || "");

  isFormLoading.value = false;
};
</script>

<template>
  <main
    v-show="authModal.isOpen"
    class="grid place-items-center sm:py-10 md:py-10 h-screen min-h-screen md:p-0 absolute inset-0 z-30 w-full text-neutral-900 bg-neutral-200"
  >
    <div
      class="w-full h-full md:h-fit flex flex-col justify-center max-w-screen-sm sm:max-w-lg border bg-neutral-50 rounded-lg pb-5 pt-8 px-4 xs:px-8 relative"
    >
      <div class="text-center relative flex items-center flex-col">
        <p v-if="isLoginMode" class="text-xl font-semibold">Welcome back</p>

        <p v-if="isLoginMode" class="text-gray-700">
          Please enter your details to sign in
        </p>

        <p v-if="!isLoginMode" class="text-xl font-semibold">
          Sign Up to Get Started
        </p>

        <div class="absolute inset-0 grid place-items-center">
          <div class="h-5/6 w-9/12 bg-fuchsia-900/70 filter blur-3xl"></div>
        </div>
      </div>

      <form
        v-auto-animate
        @submit="submitForm"
        action=""
        class="flex flex-col mt-9 mb-5 space-y-5"
      >
        <div v-if="!isLoginMode" class="flex flex-col space-y-1">
          <label for="name" class="font-semibold outline-none">Full Name</label>

          <div
            class="flex items-center border-2 border-neutral-300 rounded-lg p-2 focus-within:border-neutral-400 space-x-2 relative"
          >
            <AccountIcon :size="20" class="text-neutral-500" />

            <input
              :type="passwordHidden ? 'name' : 'text'"
              name="name"
              id="name"
              v-model="name"
              placeholder="Enter your name..."
              class="bg-transparent w-full font-medium placeholder:font-normal"
            />
          </div>
        </div>

        <div class="flex flex-col space-y-1">
          <label for="email" class="font-semibold outline-none"
            >E-Mail Address</label
          >
          <div
            class="flex items-center border-2 border-neutral-300 rounded-lg p-2 focus-within:border-neutral-400 space-x-2"
          >
            <EmailIcon :size="20" class="text-neutral-500" />

            <input
              type="email"
              name="email"
              id="email"
              v-model="email"
              placeholder="Enter your email..."
              class="bg-transparent w-full font-medium placeholder:font-normal"
            />
          </div>
        </div>

        <div class="flex flex-col space-y-1">
          <label for="password" class="font-semibold outline-none"
            >Password</label
          >
          <div
            class="flex items-center border-2 border-neutral-300 rounded-lg p-2 focus-within:border-neutral-400 space-x-2 relative"
          >
            <LockIcon :size="20" class="text-neutral-500" />

            <input
              :type="passwordHidden ? 'password' : 'text'"
              name="password"
              id="password"
              v-model="password"
              placeholder="Enter your password..."
              class="bg-transparent w-full font-medium placeholder:font-normal"
            />

            <div
              @click="toggleHidePassword"
              class="cursor-pointer absolute right-0 p-2"
              v-show="password.length > 0"
            >
              <EyeIcon
                v-if="passwordHidden"
                :size="20"
                class="text-neutral-500"
              />
              <EyeOffIcon v-else :size="20" class="text-neutral-500" />
            </div>
          </div>
        </div>

        <div v-if="!isLoginMode" class="flex flex-col space-y-1">
          <p class="font-semibold">Choose Profile Picture</p>

          <div class="flex justify-between">
            <input
              @change="handleImageChange"
              type="file"
              name="imageUri"
              accept="image/*"
              id="imageUri"
            />
            <img
              v-if="imageUri"
              :src="imageUri"
              class="h-8 w-8 rounded-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <button
          :disabled="isFormLoading"
          class="font-medium text-white flex items-center justify-center bg-black rounded-lg p-2 transition active:scale-95 relative space-x-2 disabled:opacity-80 h-10 text-sm"
        >
          <span v-if="!isFormLoading">
            <span v-if="isLoginMode">Sign in</span>

            <span v-else>Register</span>
          </span>

          <span v-else class="form-loader h-5 w-5"></span>
        </button>
      </form>

      <div class="flex items-center mb-5">
        <span class="w-full h-0.5 bg-neutral-300/80 rounded-full"></span>

        <span class="mx-3 text-sm text-neutral-700">OR</span>

        <span class="w-full h-0.5 bg-neutral-300/80 rounded-full"></span>
      </div>

      <a
        :href="`${backendURL}/api/v1/login/google`"
        class="font-medium text-white flex items-center justify-center bg-black rounded-lg p-2 transition active:scale-95 relative space-x-2 disabled:opacity-80 h-10 mb-3 text-sm"
      >
        <img
          src="/google.png"
          class="h-4 object-contain"
          alt=""
          loading="lazy"
        />

        <span>Continue With Google</span>
      </a>

      <p class="text-center" v-if="isLoginMode">
        <span class="text-neutral-700 text-sm">Don't have an account yet? </span
        ><button @click="toggleLoginMode" class="font-semibold">
          Register
        </button>
      </p>

      <p class="text-center" v-else>
        <span class="text-neutral-700 text-sm">Already have an account? </span>

        <button @click="toggleLoginMode" class="font-semibold">Sign in</button>
      </p>
    </div>
  </main>
</template>

<style>
.form-loader {
  border: 2px solid #fff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
