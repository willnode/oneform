import config from "@/components/editor/puck";
import { Render } from "@measured/puck";

export default function R({ schema }) {
    return <Render config={config} data={schema} />
}