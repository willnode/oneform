import { AutoField, DropZone, dropZoneContext, FieldLabel, type Config, type CustomField } from "@measured/puck";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { cacheBuster, cssToStyle, twToStyle } from "../helper";
import { buttonVariants } from "../ui/button";
import _ from "lodash-es";
import RM from "react-markdown";
import { parse } from 'yaml';
import React, { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { Liquid } from "liquidjs";
import { client } from "@/api/client";
import { ComponentRender } from "./component";
import * as Fa from "react-icons/fa6";
import type { IconType } from "react-icons";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { cn } from "@/lib/utils";

function opt(arr: string[]) {
  return arr.map(x => ({ label: _.startCase(x || '[Empty]'), value: x }));
}
function bool(): any[] {
  return [{ label: 'Yes', value: 'y' }, { label: 'No', value: undefined }]
}
const variants = ["default", "secondary", "destructive", "warning", "success", "info", "outline"];
const icons = ["", ...Object.keys(Fa)];
const liquid = new Liquid();

function useTempl(str: string) {
  let data = useContext(DataContext);
  return useMemo(() => {
    if (!str) {
      return '';
    }
    try {
      return liquid.parseAndRenderSync(str, data);
    } catch (error: any) {
      console.error(error);
      return 'error evaluating syntax: ' + error?.message;
    }
  }, [data, str])
}

function useTemplArray(arr: { key: string, value: string }[]) {
  let data = useContext(DataContext);
  return useMemo(() => {
    return arr.map(({ key, value }) => {
      if (!value) {
        return { key, value: '' };
      }
      try {
        return { key, value: liquid.parseAndRenderSync(value, data) };
      } catch (error: any) {
        console.error(error);
        return { key, value: 'error evaluating syntax: ' + error?.message };
      }
    });
  }, [data, (arr?.map(x => x?.value).join() || '')])
}

export const DataContext = createContext<any>({});

const useStyle = (style: string) => {
  return useMemo(() => (cssToStyle(style)), [style])
}

const useClasses = (classes: string) => {
  return useMemo(() => (twToStyle(classes)), [classes])
}

const fileSelectionRender = ({ field, onChange, value }: {
  field: CustomField<any>;
  name: string;
  id: string;
  value: any;
  onChange: (value: any) => void;
  readOnly?: boolean;
}) => {
  return <FieldLabel label={field.label || 'Thumbnail'}>
    <AutoField
      field={{ type: "text" }}
      onChange={(value) => onChange(value)}
      value={value}
    />
    <AutoField
      field={{
        type: "external", fetchList: async () => {
          // ... fetch data from a third party API, or other async source
          let r = await client.api.file.get.$get();
          let rw = await r.json();
          if (rw.status == 'error') return [];
          return rw.data.map(x => ({ id: x.id, type: x.type, name: x.name }));
        },
      }}
      onChange={(value) => onChange(value ? `/upload/file/${value.id}/${value.name}` : '')}
      value={value}
    />
  </FieldLabel >
}

const config: Config = {
  categories: {
    layout: {
      components: ['Box', 'Data', 'Component']
    },
    content: {
      components: ['Text', 'Image', 'Button']
    },
    visual: {
      components: ['Card', 'Alert', 'Badge']
    }
  },
  root: {
    fields: {
      title: {
        type: "text",
      },
      description: {
        type: "textarea",
      },
      thumbnail: {
        type: "custom",
        render: fileSelectionRender,
      },
      css: {
        type: "textarea",
      },
    },
    render({ children }) {
      let body = useRef<HTMLDivElement>(null);

      useEffect(() => {
        const script = document.createElement('script');

        script.src = "/component-client.js?v=" + cacheBuster;
        script.type = 'module';
        body.current?.ownerDocument.head.appendChild(script);

        return () => {
          body.current?.ownerDocument.head.removeChild(script);
        }
      }, []);

      return <div ref={body}>
        {children}
      </div>
    }
  },
  components: {
    Box: {
      fields: {
        classes: {
          type: "text",
        },
        style: {
          type: "textarea",
        },
      },
      render: ({ classes, style }) => {
        let ctx = useContext(dropZoneContext);
        let ref = useRef<HTMLDivElement>(null);
        let refOldClasses = useRef<string>("");

        let styling = useStyle(style);
        let css = useClasses(classes);
        let edit = ctx && ctx.mode == "edit";
        classes = classes || '';

        useEffect(() => {
          if (!edit || !ref.current) return;
          let target = ref.current.querySelector<HTMLDivElement>(`div[class^='_DropZone-content']`);
          if (!target) return;
          if (classes != refOldClasses.current) {
            let oldList = refOldClasses.current.split(' ').filter(x => x);
            let newList = classes.split(' ').filter((x: string) => x);
            if (oldList.length > 0) {
              target.classList.remove(...oldList);
            }
            if (newList.length > 0) {
              target.classList.add(...newList);
            }
            refOldClasses.current = classes;
          }
          target.style.cssText = style;
        }, [classes, style, edit])

        return <div ref={ref} className={edit ? undefined : classes} style={edit ? undefined : styling}>
          {css && <style >{css}</style>}
          <DropZone zone="children" />
        </div>
      },
    },
    Button: {
      defaultProps: {
        text: "Button",
      },
      fields: {
        text: {
          type: "text",
        },
        link: {
          type: "text",
        },
        icon: {
          type: "select",
          options: opt(icons)
        },
        variant: {
          type: "select",
          options: opt([...variants, "ghost", "link"]),
        },
        classes: {
          type: "text",
        },
      },
      render: ({ icon, text, link, classes, variant }) => {
        link = useTempl(link);
        text = useTempl(text);
        let css = useClasses(classes);
        // @ts-ignore
        let Icon: IconType = useMemo(() => Fa[icon] || null, [Fa, icon]);
        return <a href={link} className={cn(buttonVariants({
          variant,
        }), classes)}>{Icon && <Icon className={text && "me-2"} />}{text}
          {css && <style >{css}</style>}
        </a>
      },
    },
    Badge: {
      defaultProps: {
        text: "Badge",
      },
      fields: {
        text: {
          type: "text",
        },
        icon: {
          type: "select",
          options: opt(icons)
        },
        variant: {
          type: "select",
          options: opt([...variants]),
        },
        classes: {
          type: "text",
        },
      },
      render: ({ icon, text, classes, variant }) => {
        text = useTempl(text);
        let css = useClasses(classes);
        // @ts-ignore
        let Icon: IconType = useMemo(() => Fa[icon] || null, [Fa, icon]);
        return <Badge variant={variant} className={classes}>{Icon && <Icon className={text && "me-2"} />}{text}
          {css && <style >{css}</style>}
        </Badge>
      },
    },
    Alert: {
      defaultProps: {
        title: "Alert Title",
        description: "Alert Description",
      },
      fields: {
        title: {
          type: "text",
        },
        description: {
          type: "textarea",
        },
        icon: {
          type: "select",
          options: opt(icons)
        },
        variant: {
          type: "select",
          options: opt([...variants]),
        },
        classes: {
          type: "text",
        },
      },
      render: ({ icon, title, description, variant, classes }) => {
        title = useTempl(title);
        description = useTempl(description);
        let css = useClasses(classes);
        // @ts-ignore
        let Icon: IconType = useMemo(() => Fa[icon] || null, [Fa, icon]);
        return <Alert className={classes} variant={variant}>{Icon && <Icon className="me-2" />}
          {title && <AlertTitle>{title}</AlertTitle>}
          {description && <AlertDescription>{description}</AlertDescription>}
          {css && <style >{css}</style>}
        </Alert>
      },
    },
    Card: {
      defaultProps: {
        title: "Card Here"
      },
      fields: {
        title: {
          type: "text",
        },
        description: {
          type: "text",
        },
        classes: {
          type: "text",
        },
        hasHeader: {
          type: "radio",
          options: bool(),
        },
        hasFooter: {
          type: "radio",
          options: bool(),
        }
      },
      render({ title, description, classes, hasHeader, hasFooter }) {
        title = useTempl(title);
        description = useTempl(description);
        let css = useClasses(classes);
        return <Card style={classes}>
          <div className={cn(hasHeader && "flex items-center", classes)}>
            {(title || description) && <CardHeader className={hasHeader ? "flex-grow" : ""}>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>}
            {hasHeader && <div className={(title || description) ? "flex-shrink min-w-24 p-6" : "flex-grow p-6"}> <DropZone zone="header" /> </div>}
          </div>
          <CardContent>
            <DropZone zone="children" />
          </CardContent>
          {hasFooter && <CardFooter className="flex justify-between">
            <DropZone zone="footer" />
          </CardFooter>}
          {css && <style >{css}</style>}
        </Card>
      }
    },
    Data: {
      defaultProps: {
        classes: "flex flex-row",
        mock: [{
          data: 'title: YAML data here'
        }]
      },
      fields: {
        classes: {
          type: "text",
        },
        api: {
          type: "text",
        },
        mock: {
          type: "array",
          arrayFields: {
            data: { type: "textarea", }
          },
        },
      },
      render({ mock, classes }) {
        let oldData = useContext(DataContext);
        let css = useClasses(classes);
        let dataMock = useMemo(() => {
          return mock.map((m: any) => {
            try {
              return parse(m.data);
            } catch (error) {
              console.error(error);
              return 'YAML mock data error';
            }
          })
        }, [mock]);

        return <div className={classes}>{dataMock.map((data: any, i: number) => {
          return <React.Fragment key={i}>
            <DataContext.Provider value={{ ...oldData, ...data }}>
              <DropZone zone="children" />
            </DataContext.Provider>
          </React.Fragment>
        })}
          {css && <style>{css}</style>}
        </div>;
      }
    },
    Text: {
      defaultProps: {
        text: "Text Here",
        mode: 'prose',
      },
      fields: {
        text: {
          type: "textarea",
        },
        mode: {
          type: "radio",
          options: opt(['text', 'prose'])
        },
        classes: {
          type: "text",
        },
      },
      render({ text, classes, mode }) {
        text = useTempl(text);
        let css = useClasses(classes);
        let prose = mode == "prose";
        return <div className={cn(prose && "prose dark:prose-invert", classes)} >
          {prose ? <RM>{text}</RM> : text}
          {css && <style>{css}</style>}
        </div>
      }
    },
    Image: {
      defaultProps: {
        src: "https://picsum.photos/400/300"
      },
      fields: {
        src: {
          type: "custom",
          render: fileSelectionRender,
        },
        classes: {
          type: "text",
        },
        alt: {
          type: "text",
        },
      },
      render({ src, alt, classes }) {
        src = useTempl(src);
        alt = useTempl(alt);
        let css = useClasses(classes);
        return <>
          <img src={src} className={classes} alt={alt} />
          {css && <style>{css}</style>}
        </>
      }
    },
    Component: {
      defaultProps: {
        data: [],
        classes: "block w-full h-48"
      },
      fields: {
        component: {
          type: "external",
          fetchList: async () => {
            // ... fetch data from a third party API, or other async source
            let r = await client.api["view-component"].get.$get();
            let rw = await r.json();
            if (rw.status == 'error') return [];
            return rw.data.map(x => ({ identifier: x.identifier, title: x.title, id: x.id, schema: x.schema, }));
          },
          mapRow: (item) => ({ identifier: item.identifier, title: item.title }),
          getItemSummary: (x) => x.identifier,
        },
        data: {
          type: "array",
          arrayFields: {
            key: {
              type: "text",
            },
            value: {
              type: "text",
            }
          },
          getItemSummary(item, index) {
            return item?.key || "Item #" + (index || 0);
          }
        },
        classes: {
          type: "text",
        },
      },
      render({ component, data, classes }) {
        data = useTemplArray(data);
        let css = useClasses(classes);
        if (component) {
          return <>
            <ComponentRender className={classes} component={component} data={data} />
            {css && <style>{css}</style>}
          </>;
        } else {
          return <>
            <div className={classes}>Choose a component</div>
            css && <style>{css}</style>
          </>;
        }
      }
    }
  },
};

export default config;