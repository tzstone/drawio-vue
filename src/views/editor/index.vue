<template>
    <div ref="xmlExampleContainer"></div>
</template>

<script lang="ts">
import { mxEvent } from "@/drawio/core/mxgraph";
import { getLanguage } from "@/drawio/editor/i18n";
import '@/drawio/index.scss';
import { stringToXml, xmlToString } from "@/drawio/utils/xml";
import { defineComponent, onMounted, onUnmounted, ref } from '@vue/composition-api';
import { XML_DATA } from "./constant";
import { loadEditor, loadViewer } from "./loader";

export default defineComponent({
  name: 'Editor',
  setup(props, ctx) {
    const xmlExample = ref(XML_DATA)
    const xmlExampleContainer = ref()
    let diagramEditor
    let diagramViewer

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
                const graph = diagramViewer.graph
                const model = graph.getModel()
                const cell = model.getCell(child.id)
                model.beginUpdate();
                model.setValue(cell, 'real middle')
                // 修改属性后不是mxcell,变成了UserObject
                // graph.setAttributeForCell(cell, 'label', 'real middle')
                model.endUpdate();
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
          diagramViewer = new Viewer(xmlDoc);
          // traverseXML(xmlDoc.documentElement)

          diagramViewer.render(div)

          const {graph} = diagramViewer

          let mouseDownPos = null;

          graph.addListener(mxEvent.MOUSE_DOWN, function(sender, evt) {
            const e = evt.getProperty('event');
            mouseDownPos = { x: e.clientX, y: e.clientY };
          });
          // TODO: 禁用框选后, 框选动作在某元素上结束时仍会触发click
          graph.addListener(mxEvent.CLICK, function(sender, evt) {
            const e = evt.getProperty('event');
            if (mouseDownPos) {
              const dx = Math.abs(e.clientX - mouseDownPos.x);
              const dy = Math.abs(e.clientY - mouseDownPos.y);
              // 阈值可根据实际体验调整
              if (dx > 5 || dy > 5) {
                // 认为是拖动，不处理点击
                return;
              }
            }

            var cell = evt.getProperty('cell'); // 获取点击的mxCell

            if (cell) {
              // 处理点击事件，例如弹出单元格的值
              alert('点击了节点: ' + cell.value);
            }
          });


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
      // editXML()
      convertXML(xmlExample.value)
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
