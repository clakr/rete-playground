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
	const socket = new ClassicPreset.Socket("socket");

	// for managing nodes and connections
	const editor = new NodeEditor<Schemes>();

	// for displaying the viewport that the user can
	// drag, zoom, and drag other elements such as nodes within it
	const area = new AreaPlugin<Schemes, AreaExtra>(container);

	// for the user's interaction with connections
	const connection = new ConnectionPlugin<Schemes, AreaExtra>();

	// for rendering nodes, connections and
	// other built-in components of the framework
	const render = new VuePlugin<Schemes, AreaExtra>();

	AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
		accumulating: AreaExtensions.accumulateOnCtrl(),
	});

	render.addPreset(Presets.classic.setup());

	connection.addPreset(ConnectionPresets.classic.setup());

	editor.use(area);
	area.use(connection);
	area.use(render);

	AreaExtensions.simpleNodesOrder(area);

	const a = new ClassicPreset.Node("A");
	a.addControl(
		"a",
		new ClassicPreset.InputControl("text", { initial: "hello" }),
	);
	a.addOutput("a", new ClassicPreset.Output(socket));
	await editor.addNode(a);

	const b = new ClassicPreset.Node("B");
	b.addControl(
		"b",
		new ClassicPreset.InputControl("text", { initial: "hello" }),
	);
	b.addInput("b", new ClassicPreset.Input(socket));
	await editor.addNode(b);

	await area.translate(b.id, { x: 320, y: 0 });

	await editor.addConnection(new ClassicPreset.Connection(a, "a", b, "b"));

	AreaExtensions.zoomAt(area, editor.getNodes());

	return () => area.destroy();
}
