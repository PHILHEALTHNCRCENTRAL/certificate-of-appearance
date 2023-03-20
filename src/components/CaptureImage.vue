<script setup>
import { useQuasar } from "quasar";
import { ref, onMounted, onUnmounted } from "vue";
import Camera from "simple-vue-camera";
import { useGenerateAppearanceStore } from "src/stores/GenerateAppearancePDF";

const cameraRef = ref(null);
const showCamera = ref(false);
const gas = useGenerateAppearanceStore();
// const dialogRef = ref(null);

const $q = useQuasar();

const snapshot = async () => {
  try {
    const blob = await cameraRef.value?.snapshot();
    gas.form.image = URL.createObjectURL(blob);
  } catch (error) {
    $q.dialog({
      message: "Failed capture image!",
    });
  }
};

onMounted(() => (showCamera.value = true));
onUnmounted(() => (showCamera.value = false));
</script>

<template>
  <q-dialog>
    <q-card style="max-width: 80%">
      <q-card-section>
        <div class="row justify-center q-gutter-md">
          <Camera
            ref="cameraRef"
            :resolution="{ width: 1920, height: 1080 }"
            :autoplay="showCamera"
          />
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          @click="snapshot"
          color="primary"
          label="CAPTURE"
          icon="camera"
        />
        <q-btn v-close-popup color="negative" label="CANCEL" icon="camera" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
