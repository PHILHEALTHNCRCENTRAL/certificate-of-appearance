<script setup>
import CaptureImageBtn from "../components/CaptureImageBtn.vue";
import { ref, onMounted } from "vue";
import SignaturePad from "signature_pad";
import jsPDF from "jspdf";
import LetterHead from "src/custom_templates/letter_head";
import autoTable from "jspdf-autotable";
import { useQuasar } from "quasar";
import { useGenerateAppearanceStore } from "src/stores/GenerateAppearancePDF";

const canvas = ref(null);
const $q = useQuasar();
let signaturePad = null;
let doc = null;
const gas = useGenerateAppearanceStore();

onMounted(() => {
  signaturePad = new SignaturePad(canvas.value);
});

const handleSubmit = () => {
  const now = new Date().toDateString();
  doc = new jsPDF({
    orientation: "portrait",
  });

  const sig = signaturePad.toDataURL();

  gas.form.signature = signaturePad.toDataURL();
  doc.addImage(LetterHead, 35, 10, 150, 25);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICATE OF APPEARANCE", 105, 50, null, null, "center");
  doc.setFont("times", "normal");
  doc.text(`Date: ${now}`, 190, 70, null, null, "right");
  doc.text("To whom it may concern:", 20, 80, "left");
  doc.text(
    `This is to certify that ${gas.form.employee_name} went out of the office premises on the following date/s on official business`,
    20,
    90,
    {
      align: "left",
      maxWidth: "170", // default 170
    }
  );
  // CREATE THE TABLE
  autoTable(doc, {
    head: [
      [
        "DATE",
        "TIME OF ARRIVAL",
        "TIME OF DEPARTURE",
        "PERSON AND PLACED VISITED",
        "SIGNATURE",
      ],
    ],
    body: [
      [
        gas.form.ob_date,
        gas.form.time_of_arrival,
        gas.form.time_of_departure,
        `${gas.form.person_visited} - ${gas.form.place_visited}`,
      ],
    ],
    // ATTACH THE SIGNATURE
    didDrawCell: (data) => {
      if (data.section === "body" && data.column.index === 4) {
        doc.addImage(sig, "JPEG", data.cell.x + 2, data.cell.y + 2, 20, 10);
      }
    },
    startY: 120,
  });

  // ID IMAGE
  doc.addImage(gas.form.image, "JPEG", 50, 160, 100, 60);

  doc.save("certificate_of_appearance.pdf");

  $q.dialog({
    message: "Certificate of Appearance has been generated!",
    ok: true,
  });
};

const handleClear = () => signaturePad.clear();
</script>

<template>
  <q-page class="flex flex-center">
    <q-card style="max-width: 80%; width: 800px">
      <q-card-section> </q-card-section>
      <q-card-section class="text-h6"> Enter your info: </q-card-section>
      <q-form @submit.prevent="handleSubmit" greedy>
        <q-card-section class="q-col-gutter-sm">
          <div class="row q-col-gutter-sm">
            <q-input
              v-model="gas.form.ob_date"
              class="col-12 col-md-6"
              label="OB date"
              type="date"
              outlined
              :rules="[(val) => !!val || 'OB date is required!']"
            />
            <q-input
              v-model="gas.form.place_visited"
              class="col-12 col-md-6"
              label="Place Visited"
              outlined
              :rules="[(val) => !!val || 'Place visited is required!']"
            />
          </div>
          <q-input
            v-model="gas.form.employee_name"
            class="col-12"
            label="Employee name"
            outlined
            :rules="[(val) => !!val || 'Employee name is required!']"
          />
          <div class="row q-col-gutter-sm">
            <q-input
              v-model="gas.form.time_of_arrival"
              class="col-12 col-md-6"
              label="Time of Arrival"
              type="time"
              outlined
              :rules="[(val) => !!val || 'Time of Arrival is required!']"
            />
            <q-input
              v-model="gas.form.time_of_departure"
              class="col-12 col-md-6"
              label="Time of Departure"
              type="time"
              outlined
              :rules="[(val) => !!val || 'Time of Departure is required!']"
            />
          </div>
          <q-input
            v-model="gas.form.person_visited"
            class="col"
            label="Person visited"
            outlined
            :rules="[(val) => !!val || 'Person Visited is required!']"
          />
          <div class="text-h6">Person Visited Signature</div>
          <div class="row q-gutter-sm justify-center items-center q-mt-md">
            <div class="wrapper">
              <canvas
                ref="canvas"
                class="signature-pad"
                width="270"
                height="200"
              ></canvas>
            </div>
            <div>
              <q-btn
                @click="handleClear"
                icon="clear"
                label="clear signature"
                color="negative"
              />
            </div>
          </div>
          <div class="text-h6">Person ID</div>

          <div class="row justify-center q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-img v-if="gas.form.image" :src="gas.form.image" />
            </div>
            <div class="col-12 col-md-6 flex flex-center">
              <CaptureImageBtn />
            </div>
          </div>
        </q-card-section>

        <q-card-actions>
          <q-btn
            label="GENERATE"
            type="submit"
            class="full-width"
            color="primary"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<style scoped>
.wrapper {
  position: relative;
  width: 400px;
  height: 200px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.signature-pad {
  position: absolute;
  left: 0;
  top: 0;
  /* width: 350px;
  height: 200px; */
  background-color: white;
  border: 1px solid black;
}
</style>
