<template>
    <div>
      <h1>Localização da Subestação</h1>
      <h2>{{ subestacao?.codigo }}</h2>
      <h2>{{ subestacao?.nome }}</h2>
      <p>Latitude: {{ subestacao?.latitude }}</p>
      <p>Longitude: {{ subestacao?.longitude }}</p>
  
      <div id="map" style="height: 400px; width: 100%;"></div>
  
      <button @click="fecharMapa">Fechar</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import api from "@/services/api.ts";

  export default defineComponent({
    name: "ExibirMapa",
    props: {
      codigo: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const route = useRoute();
      const router = useRouter();
      const subestacao = ref<{ nome: string; latitude: number; longitude: number; codigo: string } | null>(null);

      const codigo = route.params.codigo as string;

      // Buscar os dados da subestação com base no código
      const fetchSubestacao = async () => {
        try {
          const response = await api.get(`/Subestacao/${codigo}`);
          subestacao.value = response.data;
        } catch (error) {
          console.error("Erro ao buscar subestação:", error);
        }
      };

      // Inicializar o mapa e adicionar o marcador
      const initMap = () => {
        if (subestacao.value) {
          const { latitude, longitude } = subestacao.value;

          const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
            center: { lat: latitude, lng: longitude },
            zoom: 14,
          });

          const marker = new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: map,
            title: subestacao.value.nome,
          });

          const labelDiv = document.createElement("div");
          labelDiv.style.position = "absolute";
          labelDiv.style.fontWeight = "bold";
          labelDiv.style.color = "black";
          labelDiv.style.backgroundColor = "white";
          labelDiv.style.padding = "2px 4px";
          labelDiv.style.borderRadius = "4px";
          labelDiv.innerText = subestacao.value.codigo;

          const overlay = new google.maps.OverlayView();
          overlay.onAdd = function () {
            const panes = this.getPanes();
            if (panes) panes.overlayLayer.appendChild(labelDiv);
          };
          overlay.draw = function () {
            const projection = this.getProjection();
            const position = marker.getPosition();
            if (projection && position) {
              const point = projection.fromLatLngToDivPixel(position);
              if (point) {
                labelDiv.style.left = `${point.x}px`;
                labelDiv.style.top = `${point.y + 30}px`;
              }
            }
          };
          overlay.setMap(map);
        }
      };

  
      const fecharMapa = () => {
        router.push("/Lista");
      };

      onMounted(() => {
        fetchSubestacao().then(() => {
          if (subestacao.value) {
            initMap();
          }
        });
      });

      return {
        subestacao,
        fecharMapa,
      };
    },
  });
</script>


  
  <style scoped>
  h1 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  h2 {
    font-size: 1.5rem;
    margin: 1rem 0;
  }
  
  p {
    font-size: 1rem;
  }
  
  button {
    /* background-color: #007bff; */
    /* color: white; */
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    margin-top: 20px;
  }
  
 
  </style>
  