import { Graph } from "../editor/js/Graph";
import "../editor/js/Shapes";
import { DEFAULT_STYLE_XML } from "../styles/default";
import { stringToXml } from "../utils/xml";
import { mxCodec, mxEvent } from "./mxgraph";

const themes: Record<string, Node> = {};
themes[Graph.prototype.defaultThemeName] = (
  stringToXml(DEFAULT_STYLE_XML) as XMLDocument
).documentElement;

export class DiagramViewer {
  public graph: Graph | null;
  private container: HTMLDivElement | null;

  constructor(private xml: XMLDocument | null) {
    const container = document.createElement("div");
    const graph = new Graph(container, null, null, null, themes, true);
    this.container = container;
    this.graph = graph;
  }

  public render(el: HTMLDivElement) {
    if (!this.graph) return null;

    const codec = new mxCodec(this.xml);
    // @ts-ignore
    codec.decode(this.xml.documentElement, this.graph.getModel());

    el.appendChild(this.container);

    this.disableEditing();
  }

  private disableEditing() {
    const graph = this.graph as any;

    // 禁止编辑
    graph.setCellsEditable(false);
    // 禁止节点和连线被移动
    graph.setCellsMovable(false);
    // 禁止节点和连线被缩放
    graph.setCellsResizable(false);
    // 禁止节点和连线被删除
    graph.setCellsDeletable(false);
    // 禁止节点和连线被克隆
    graph.setCellsCloneable(false);
    // 禁止节点和连线被连线
    graph.setConnectable(false);
    // 禁止边的弯曲
    graph.setCellsBendable(false);
    // 禁止边断开
    graph.setCellsDisconnectable(false);
    // 禁止节点和连线被选中（可选，如果你不想有选中高亮）
    graph.setCellsSelectable(false);
    // 禁止拖放
    graph.setDropEnabled(false);
    // 禁止橡皮筋框选（可选）
    if (graph.setRubberbandSelectable) {
      graph.setRubberbandSelectable(false);
    }
    if (graph.getRubberband) {
      graph.getRubberband()?.destroy();
      graph.getRubberband = function () {
        return null;
      };
    }
    // 禁用自动平移
    graph.allowAutoPanning = false;

    // 彻底禁用 hover 创建新节点的方式
    graph.connectionArrowsEnabled = false;
    // 禁用右键菜单
    graph.popupMenuHandler.factoryMethod = null;
  }

  public renderSVG = (
    background: string | null,
    scale = 1,
    border = 1
  ): SVGElement | null => {
    if (!this.graph) return null;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const model = this.graph.getModel();
    this.xml && new mxCodec(this.xml).decode(this.xml.documentElement, model);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const svg = this.graph.getSvg(background, scale, border);
    return svg;
  };

  public destroy = (): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.graph && this.graph.destroy();
    this.container && mxEvent.removeAllListeners(this.container);
    this.graph = null;
    this.container = null;
  };

  public static xmlToSvg = (
    xml: XMLDocument | null,
    background: string | null,
    scale = 1,
    border = 1
  ): SVGElement | null => {
    if (!xml) return null;
    const viewer = new DiagramViewer(xml);
    const svg = viewer.renderSVG(background, scale, border);
    viewer.destroy();
    return svg;
  };
}
