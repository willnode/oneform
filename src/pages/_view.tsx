import config, { DataContext } from "@/components/editor/puck";
import { Render } from "@measured/puck";

export default function R({ schema, data }: any) {
    return <DataContext.Provider value={data}>
        <Render config={config} data={schema} />
    </DataContext.Provider>
}