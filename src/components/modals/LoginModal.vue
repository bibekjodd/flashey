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
  if (res.data) user.setUser(res.data);
  else toast.error(res.error || "");

  isFormLoading.value = false;
};
</script>

<template>
  <main
    class="grid place-items-center xs:py-10 h-screen min-h-screen md:p-0 absolute inset-0 z-50 w-full text-neutral-900 bg-black/5"
  >
    <div
      class="w-full h-full sm:h-fit flex flex-col justify-center xs:max-w-md border bg-neutral-50 rounded-lg pb-5 pt-8 px-6 relative"
    >
      <div class="text-center relative flex items-center flex-col">
        <p class="text-xl font-semibold">Welcome back</p>
        <p class="text-gray-700">Please enter your details to sign in</p>
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
              :src="imageUri"
              alt="user chosen profile picture"
              class="h-10 w-10 rounded-full object-cover"
            />
          </div>
        </div>

        <button
          :disabled="isFormLoading"
          class="font-medium text-white flex items-center justify-center bg-black rounded-lg p-2 transition active:scale-95 relative space-x-2 disabled:opacity-80 h-10"
        >
          <span v-if="!isFormLoading">
            <span v-if="isLoginMode">Sign in</span>
            <span v-else>Register</span>
          </span>
          <span v-else class="form-loader h-5 w-5"></span>
        </button>
      </form>

      <p class="text-center" v-if="isLoginMode">
        <span class="text-neutral-700 text-sm">Don't have an account yet? </span
        ><button @click="toggleLoginMode" class="font-semibold">
          Register
        </button>
      </p>

      <p class="text-center" v-else>
        <span class="text-neutral-700 text-sm">Already have an account? </span
        ><button @click="toggleLoginMode" class="font-semibold">Sign in</button>
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
