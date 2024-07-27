import { useEffect, useMemo } from "react";
import { parse } from "yaml";

export function ComponentPreview({ schema, config }: any) {
    let dataConf = useMemo(() => {
        try {
            if (!config) return {};
            let parsedConf = parse(config) || {};
            if (!parsedConf['mock'] || typeof parsedConf['mock'] !== 'object') return {};
            return Object.entries(parsedConf['mock']).reduce((o: Record<string, string>, [k, v]) => {
                o['data-' + k] = ['array', 'object'].includes(typeof v) ? JSON.stringify(v) : v + '';
                return o;
            }, {})
        } catch (error) {
            console.error(error);
            return {};
        }
    }, [config])

    let ElemName = 'preview-component';

    // @ts-ignore
    return <ElemName schema={schema} {...dataConf}></ElemName>
}

export function ComponentRender({ component, data, style }: any) {
    if (!component || !component.identifier) return <div></div>

    let dataConf = useMemo(() => {
        try {
            if (!data) return {};
            return data.reduce((o: Record<string, string>, { key, value }: any) => {
                o['data-' + key] = ['array', 'object'].includes(typeof value) ? JSON.stringify(value) : value + '';
                return o;
            }, {})
        } catch (error) {
            console.error(error);
            return {};
        }
    }, [data])

    let ElemName = 'preview-component';
    // @ts-ignore
    return <ElemName schema={component.schema} style={style} {...dataConf}></ElemName>
}
