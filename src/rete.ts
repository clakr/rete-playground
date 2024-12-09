import { NodeEditor, type GetSchemes, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
	ConnectionPlugin,
	Presets as ConnectionPresets,
} from "rete-connection-plugin";
import { VuePlugin, Presets, type VueArea2D } from "rete-vue-plugin";

type Schemes = GetSchemes<
	ClassicPreset.Node,
	ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;

type AreaExtra = VueArea2D<Schemes>;

export async function createEditor(container: HTMLElement) {
	// for managing nodes and connections
	const editor = new NodeEditor<Schemes>();

	const socket = new ClassicPreset.Socket("socket");

	// for displaying the viewport that the user can
	// drag, zoom, and drag other elements such as nodes within it
	const area = new AreaPlugin<Schemes, AreaExtra>(container);

	// for rendering nodes, connections, and
	// other built-in components of the framework
	const render = new VuePlugin<Schemes, AreaExtra>();
	render.addPreset(Presets.classic.setup());

	editor.use(area);
	area.use(render);

	const nodeA = new ClassicPreset.Node("a");
	nodeA.addControl("a", new ClassicPreset.InputControl("text", {}));
	nodeA.addOutput("a", new ClassicPreset.Output(socket));
	await editor.addNode(nodeA);

	const nodeB = new ClassicPreset.Node("b");
	nodeB.addControl("b", new ClassicPreset.InputControl("text", {}));
	nodeB.addInput("b", new ClassicPreset.Input(socket));
	await editor.addNode(nodeB);

	await editor.addConnection(
		new ClassicPreset.Connection(nodeA, "a", nodeB, "b"),
	);

	await area.translate(nodeB.id, { x: 270, y: 0 });

	// for the user's interaction with connections
	const connection = new ConnectionPlugin<Schemes, AreaExtra>();
	connection.addPreset(ConnectionPresets.classic.setup());

	area.use(connection);

	AreaExtensions.zoomAt(area, editor.getNodes());
	AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
		accumulating: AreaExtensions.accumulateOnCtrl(),
	});
	AreaExtensions.simpleNodesOrder(area);

	return () => area.destroy();
}
