<template>
    <div ref="xmlExampleContainer"></div>
</template>

<script lang="ts">
import { getLanguage } from "@/drawio/editor/i18n";
import '@/drawio/index.scss';
import { stringToXml, xmlToString } from "@/drawio/utils/xml";
import { defineComponent, onMounted, onUnmounted, ref } from '@vue/composition-api';
import { XML_DATA } from "./constant";
import { loadEditor, loadViewer } from "./loader";
import { clearElement } from "./utils";

export default defineComponent({
  name: 'Editor',
  setup(props, ctx) {
    const xmlExample = ref(XML_DATA)
    const xmlExampleContainer = ref()

    const convertXML = (xml: string = xmlExample.value) => {
      const div = xmlExampleContainer.value;
      if (div) {
        loadViewer().then(Viewer => {
          const diagramViewer = new Viewer(stringToXml(xml));
          const svg = diagramViewer.renderSVG(null, 1, 1);
          diagramViewer.destroy();
          clearElement(div);
          svg && div.appendChild(svg);
        });
      }
    };

  const editXML = async () => {
    const Editor = await loadEditor();
    const diagramEditor = new Editor(document.body, () => {
      diagramEditor.exit();
    });
    const lang = await getLanguage("zh");
    diagramEditor.start(lang, stringToXml(xmlExample.value), (xml: Node) => {
      const xmlString = xmlToString(xml);
      xmlString && (xmlExample.value = xmlString);
      xmlString && convertXML(xmlString);
    });
  };


    onMounted(() => {
      editXML()
    })

    onUnmounted(() => {
    })

    return {
      xmlExampleContainer
    }
  }
})
</script>

<style>

</style>
