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
    let diagramEditor

    // graph.setAttributeForCell
    // this.model.getCell(cells[i].id)
    // const model = this.graph.getModel();

    // 遍历value是 {xxx} 变量类型的节点
    function traverseXML(node) {
      function traverse(node) {
        // 处理当前节点
        // console.log("Node Name:", node.nodeName);
        // console.log("Node Value:", node.nodeValue);

        // 遍历子节点
        if (node.hasChildNodes()) {
          for (let i = 0; i < node.childNodes.length; i++) {
            const child = node.childNodes[i]
            const value = child.getAttribute('value')
            if (/\{\w+\}/.test(value)) {
              console.log(child.id, value, child)
              setTimeout(() => {
                // const graph = diagramEditor.editor.graph
                // const model = graph.getModel()
                // const cell = model.getCell(child.id)
                // model.beginUpdate();
                // 修改属性后不是mxcell,变成了UserObject
                // graph.setAttributeForCell(cell, 'label', 'real middle')
                // model.endUpdate();
              }, 3000);
            }
            traverse(child);
          }
        }
      }

      traverse(node); // 从根节点开始遍历
    }


    const convertXML = (xml: string = xmlExample.value) => {
      const div = xmlExampleContainer.value;
      if (div) {
        loadViewer().then(Viewer => {
          const xmlDoc = stringToXml(xml)
          traverseXML(xmlDoc.documentElement)
          const diagramViewer = new Viewer(xmlDoc);
          const svg = diagramViewer.renderSVG(null, 1, 1);
          diagramViewer.destroy();
          clearElement(div);
          svg && div.appendChild(svg);
        });
      }
    };

  const editXML = async () => {
    const Editor = await loadEditor();
    diagramEditor = new Editor(document.body, () => {
      diagramEditor.exit();
    });
    const lang = await getLanguage("zh");
    diagramEditor.start(lang, stringToXml(xmlExample.value), function onXMLChange(xml: Node) {
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
